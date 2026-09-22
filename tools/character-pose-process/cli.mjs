#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import {
  appendLedgerFile, emitProceduralGraph, emptyLedger, hashFile, loadJson,
  validateGraph, validateLedger, validateRecipe, writeExclusiveJson,
} from './index.mjs';

function parseArgs(values) {
  const result = { _: [] };
  for (let index = 0; index < values.length; index++) {
    const value = values[index];
    if (!value.startsWith('--')) result._.push(value);
    else {
      const key = value.slice(2);
      if (index + 1 >= values.length || values[index + 1].startsWith('--')) throw new Error(`missing value for --${key}`);
      if (key in result) throw new Error(`duplicate flag --${key}`);
      result[key] = values[++index];
    }
  }
  return result;
}

const options = parseArgs(process.argv.slice(2));
const command = options._[0];
if (!command) throw new Error('command required: validate-recipe | emit | validate-graph | ledger-init | ledger-append | ledger-validate');
if (options._.length !== 1) throw new Error('exactly one command positional is required');
const allowedByCommand = {
  'validate-recipe': ['recipe', 'schema'], emit: ['recipe', 'schema', 'output'], 'validate-graph': ['graph', 'schema'],
  'ledger-init': ['output'], 'ledger-append': ['ledger', 'event', 'expected-revision', 'expected-sha'], 'ledger-validate': ['ledger'],
};
if (!allowedByCommand[command]) throw new Error(`unknown command ${command}`);
const supplied = Object.keys(options).filter(key => key !== '_');
const unknown = supplied.filter(key => !allowedByCommand[command].includes(key));
const missing = allowedByCommand[command].filter(key => !(key in options));
if (unknown.length || missing.length) throw new Error(`invalid flags for ${command}; unknown=${unknown.join(',') || 'none'} missing=${missing.join(',') || 'none'}`);

if (command === 'validate-recipe') {
  const recipe = loadJson(options.recipe); const schemaSha = hashFile(options.schema);
  validateRecipe(recipe, { schemaFileSha256: schemaSha });
  process.stdout.write(`${JSON.stringify({ ok: true, recipe: options.recipe, schemaSha256: schemaSha })}\n`);
} else if (command === 'emit') {
  const recipe = loadJson(options.recipe); const schema = JSON.parse(readFileSync(options.schema));
  const graph = emitProceduralGraph(recipe, schema, { schemaFileSha256: hashFile(options.schema) });
  writeExclusiveJson(options.output, graph);
  process.stdout.write(`${JSON.stringify({ ok: true, output: options.output, graphSha256: hashFile(options.output), nodes: Object.keys(graph.graph).length })}\n`);
} else if (command === 'validate-graph') {
  const document = loadJson(options.graph); validateGraph(document.graph ?? document, loadJson(options.schema));
  process.stdout.write(`${JSON.stringify({ ok: true, graph: options.graph, graphSha256: hashFile(options.graph) })}\n`);
} else if (command === 'ledger-init') {
  writeExclusiveJson(options.output, emptyLedger());
  process.stdout.write(`${JSON.stringify({ ok: true, output: options.output, ledger: loadJson(options.output) })}\n`);
} else if (command === 'ledger-append') {
  const eventEnvelope = loadJson(options.event);
  if (Object.keys(eventEnvelope).some(key => key !== 'event')) throw new Error('event input may contain only the event field; embedded ledger state is prohibited');
  const ledger = appendLedgerFile(options.ledger, eventEnvelope.event, { expectedRevision: Number(options['expected-revision']), expectedSha256: options['expected-sha'] });
  process.stdout.write(`${JSON.stringify({ ok: true, ledger: options.ledger, revision: ledger.revision, stateSha256: ledger.stateSha256 })}\n`);
} else if (command === 'ledger-validate') {
  const ledger = loadJson(options.ledger); validateLedger(ledger);
  process.stdout.write(`${JSON.stringify({ ok: true, ledger: options.ledger, revision: ledger.revision, stateSha256: ledger.stateSha256, summary: ledger.summary })}\n`);
}
