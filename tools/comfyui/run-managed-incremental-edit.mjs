import { createHash } from "node:crypto";
import {
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { basename, resolve } from "node:path";
import { chromium, request } from "playwright";

function parseArguments(argv) {
  const values = {};
  for (let index = 2; index < argv.length; index += 2) {
    const key = argv[index];
    const value = argv[index + 1];
    if (!key?.startsWith("--") || value === undefined) {
      throw new Error(`Expected --name value arguments; stopped at ${key ?? "end"}.`);
    }
    values[key.slice(2)] = value;
  }
  return values;
}

function required(values, key) {
  const value = values[key];
  if (!value) throw new Error(`Missing required --${key} argument.`);
  return value;
}

function sha256(buffer) {
  return createHash("sha256").update(buffer).digest("hex");
}

function safeRunId(value) {
  const safe = value.replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/^-+|-+$/g, "");
  if (!safe || safe !== value) {
    throw new Error("--run-id must contain only letters, numbers, dot, underscore, or dash.");
  }
  return safe;
}

const args = parseArguments(process.argv);
const baseUrl = required(args, "base-url").replace(/\/$/, "");
const workflowPath = resolve(required(args, "workflow"));
const currentPath = resolve(required(args, "current"));
const maskPath = resolve(required(args, "mask"));
const referencePath = args.reference ? resolve(args.reference) : undefined;
const promptPath = resolve(required(args, "prompt-file"));
const outputDirectory = resolve(required(args, "output-dir"));
const runId = safeRunId(required(args, "run-id"));
const seed = Number(args.seed ?? 424242);
if (!Number.isSafeInteger(seed) || seed < 0) throw new Error("--seed must be a non-negative safe integer.");

const workflow = JSON.parse(readFileSync(workflowPath, "utf8"));
const prompt = readFileSync(promptPath, "utf8").trim();
const localInputs = {
  current: readFileSync(currentPath),
  mask: readFileSync(maskPath),
  ...(referencePath ? { reference: readFileSync(referencePath) } : {}),
};
mkdirSync(outputDirectory, { recursive: true });

const requestContext = await request.newContext({
  baseURL: baseUrl,
  ignoreHTTPSErrors: true,
});
let browser;
let promptId;
try {
  const queueResponse = await requestContext.get("/queue");
  if (!queueResponse.ok()) {
    throw new Error(`Cortan queue inventory failed: ${queueResponse.status()} ${await queueResponse.text()}`);
  }
  const queue = await queueResponse.json();
  const running = queue.queue_running ?? queue.Running ?? [];
  const pending = queue.queue_pending ?? queue.Pending ?? [];
  if (running.length || pending.length) {
    throw new Error(`Cortan queue is not empty (${running.length} running, ${pending.length} pending); no job was submitted.`);
  }

  const subfolder = `GamifySurgery/managed-inputs/${runId}`;
  async function upload(label, path, buffer) {
    const filename = `${label}-${basename(path)}`;
    const response = await requestContext.post("/upload/image", {
      multipart: {
        image: { name: filename, mimeType: "image/png", buffer },
        type: "input",
        subfolder,
        overwrite: "false",
      },
    });
    if (!response.ok()) {
      throw new Error(`Upload ${label} failed: ${response.status()} ${await response.text()}`);
    }
    const record = await response.json();
    return {
      ...record,
      loadName: [record.subfolder, record.name].filter(Boolean).join("/"),
    };
  }

  const uploads = {
    current: await upload("current", currentPath, localInputs.current),
    mask: await upload("mask", maskPath, localInputs.mask),
    ...(referencePath
      ? { reference: await upload("reference", referencePath, localInputs.reference) }
      : {}),
  };
  console.log(`Uploaded managed inputs under ${subfolder}`);

  browser = await chromium.launch({ headless: true, channel: "chrome" });
  const page = await browser.newPage({ ignoreHTTPSErrors: true });
  await page.goto(baseUrl, { waitUntil: "networkidle", timeout: 60_000 });
  const queueResult = await page.evaluate(async ({ workflow, uploads, prompt, runId, seed }) => {
    const app = globalThis.app;
    const api = globalThis.comfyAPI.api.api;
    await app.loadGraphData(workflow);
    const setWidget = (nodeId, name, value) => {
      const node = app.graph.getNodeById(Number(nodeId));
      const widget = node?.widgets?.find((candidate) => candidate.name === name);
      if (!widget) throw new Error(`Workflow node ${nodeId} has no ${name} widget.`);
      widget.value = value;
    };
    setWidget(1, "image", uploads.current.loadName);
    if (uploads.reference) setWidget(2, "image", uploads.reference.loadName);
    setWidget(4, "image", uploads.mask.loadName);
    setWidget(4, "channel", "red");
    setWidget(12, "prompt", prompt);
    setWidget(17, "seed", seed);
    setWidget(25, "filename_prefix", `GamifySurgery/managed/${runId}/transparent`);
    setWidget(26, "filename_prefix", `GamifySurgery/managed/${runId}/foreground-mask-qa`);
    const executable = await app.graphToPrompt();
    if (uploads.reference) {
      executable.output["11"].inputs.image2 = ["2", 0];
      executable.output["12"].inputs.image2 = ["2", 0];
    }
    executable.output["27"] = {
      inputs: {
        filename_prefix: `GamifySurgery/managed/${runId}/masked-composite-qa`,
        images: ["19", 0],
      },
      class_type: "SaveImage",
      _meta: { title: "Managed exact-mask composite QA" },
    };
    executable.output["28"] = {
      inputs: {
        filename_prefix: `GamifySurgery/managed/${runId}/raw-generation-qa`,
        images: ["18", 0],
      },
      class_type: "SaveImage",
      _meta: { title: "Managed raw Qwen generation QA" },
    };
    executable.workflow.extra = {
      ...(executable.workflow.extra ?? {}),
      gamifysurgery_managed_run: {
        runId,
        seed,
        current: uploads.current.loadName,
        mask: uploads.mask.loadName,
        reference: uploads.reference?.loadName ?? null,
        referenceConnectedToBothConditioningEncoders: Boolean(uploads.reference),
      },
    };
    return api.queuePrompt(0, executable);
  }, { workflow, uploads, prompt, runId, seed });
  promptId = queueResult.prompt_id;
  if (!promptId) throw new Error(`Cortan returned no prompt_id: ${JSON.stringify(queueResult)}`);
  console.log(`Queued Cortan prompt ${promptId} with fixed seed ${seed}`);

  const deadline = Date.now() + 15 * 60_000;
  let historyRecord;
  let nextProgress = Date.now();
  while (Date.now() < deadline) {
    const response = await requestContext.get(`/history/${encodeURIComponent(promptId)}`);
    if (!response.ok()) {
      throw new Error(`History poll failed: ${response.status()} ${await response.text()}`);
    }
    const history = await response.json();
    historyRecord = history[promptId];
    if (historyRecord?.status?.status_str === "error") {
      throw new Error(`Cortan prompt failed: ${JSON.stringify(historyRecord.status)}`);
    }
    if (historyRecord?.status?.completed || historyRecord?.outputs) break;
    if (Date.now() >= nextProgress) {
      console.log(`Waiting for Cortan prompt ${promptId}...`);
      nextProgress = Date.now() + 15_000;
    }
    await new Promise((resolvePromise) => setTimeout(resolvePromise, 2_000));
  }
  if (!historyRecord?.outputs) {
    throw new Error(`Timed out waiting for Cortan prompt ${promptId}; the job was not cancelled.`);
  }

  const outputLabels = {
    "25": "transparent",
    "26": "foreground-mask-qa",
    "27": "masked-composite-qa",
    "28": "raw-generation-qa",
  };
  const downloaded = [];
  for (const [nodeId, label] of Object.entries(outputLabels)) {
    const images = historyRecord.outputs[nodeId]?.images ?? [];
    for (let index = 0; index < images.length; index += 1) {
      const remote = images[index];
      const response = await requestContext.get("/view", {
        params: {
          filename: remote.filename,
          subfolder: remote.subfolder ?? "",
          type: remote.type ?? "output",
        },
      });
      if (!response.ok()) {
        throw new Error(`Download ${label} failed: ${response.status()} ${await response.text()}`);
      }
      const buffer = await response.body();
      const localName = `${label}${images.length > 1 ? `-${index + 1}` : ""}.png`;
      writeFileSync(resolve(outputDirectory, localName), buffer);
      downloaded.push({ nodeId, label, localName, remote, sha256: sha256(buffer) });
    }
  }
  if (!downloaded.some((item) => item.nodeId === "25")) {
    throw new Error(`Prompt ${promptId} completed without a transparent result.`);
  }

  const audit = {
    runId,
    promptId,
    seed,
    baseUrl,
    workflow: workflowPath,
    prompt,
    submittedAt: new Date().toISOString(),
    inputs: {
      current: { path: currentPath, sha256: sha256(localInputs.current), remote: uploads.current },
      mask: { path: maskPath, sha256: sha256(localInputs.mask), remote: uploads.mask },
      reference: referencePath
        ? { path: referencePath, sha256: sha256(localInputs.reference), remote: uploads.reference }
        : null,
    },
    downloaded,
    status: historyRecord.status,
  };
  writeFileSync(resolve(outputDirectory, "managed-run.json"), JSON.stringify(audit, null, 2), "utf8");
  console.log(`Downloaded ${downloaded.length} review outputs to ${outputDirectory}`);
} catch (error) {
  if (promptId) console.error(`Managed Cortan prompt id: ${promptId}`);
  throw error;
} finally {
  await browser?.close();
  await requestContext.dispose();
}
