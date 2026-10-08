// Native in-process parsing avoids worker sandbox child-process restrictions.
import {readdirSync,readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {SourceTextModule} from 'node:vm';
const tool=resolve(fileURLToPath(new URL('.',import.meta.url)));
const files=readdirSync(tool).filter(name=>name.endsWith('.mjs')).sort();
for(const name of files)new SourceTextModule(readFileSync(resolve(tool,name),'utf8'),{identifier:name});
console.log(JSON.stringify({status:'PASS',syntaxParsedModules:files.length}));
