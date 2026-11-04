// Command-local Vite fallback for this local-C: workspace in the sandbox.
// Vite's optional `net use` optimization throws synchronously on spawn EPERM.
// Report that same unavailability through its callback, which leaves Vite on
// ordinary fs.realpathSync. No command, network query, storage or save is used.
const childProcess = require("node:child_process");
const {EventEmitter} = require("node:events");
const originalExec = childProcess.exec;
childProcess.exec = function (command, options, callback) {
  if (command !== "net use") return originalExec.apply(this, arguments);
  const done = typeof options === "function" ? options : callback;
  const unavailable = Object.assign(new Error("Optional drive-mapping probe unavailable in sandbox"), {code:"EPERM"});
  if (typeof done === "function") process.nextTick(done, unavailable, "", "");
  return new EventEmitter();
};
require("node:module").syncBuiltinESMExports();
