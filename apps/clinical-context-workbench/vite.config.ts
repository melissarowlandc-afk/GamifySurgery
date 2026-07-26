import react from "@vitejs/plugin-react";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  defineConfig,
  loadEnv,
  type Plugin,
  type UserConfig,
} from "vite";

import { createApiMiddleware } from "./server/api.js";
import { LocalAuthoringContextService } from "./server/authoring.js";
import { LocalPrivateIntakeService } from "./server/intake.js";
import { createLocalScoutCoordinator } from "./server/scouting.js";
import { resolveLocalReviewerProfile } from "./server/reviewer.js";
import {
  WorkspaceConflictError,
  WorkspaceStore,
} from "./server/storage.js";

const appRoot = dirname(fileURLToPath(import.meta.url));
const clientRoot = resolve(appRoot, "client");
const repositoryRoot = resolve(appRoot, "../..");
const dependencyRoot = resolve(repositoryRoot, "node_modules");
const storageRoot = resolve(
  repositoryRoot,
  ".clinical-workbench",
  "context-workbench",
);
const DUE_SCOUT_INTERVAL_MS = 15 * 60 * 1_000;

function clinicalContextApiPlugin(environment: Record<string, string>): Plugin {
  const reviewer = resolveLocalReviewerProfile({
    CLINICAL_WORKBENCH_REVIEWER_ID:
      process.env.CLINICAL_WORKBENCH_REVIEWER_ID ??
      environment.CLINICAL_WORKBENCH_REVIEWER_ID,
    CLINICAL_WORKBENCH_REVIEWER_ROLE:
      process.env.CLINICAL_WORKBENCH_REVIEWER_ROLE ??
      environment.CLINICAL_WORKBENCH_REVIEWER_ROLE,
  });
  const store = new WorkspaceStore(storageRoot);
  const scoutCoordinator = createLocalScoutCoordinator({
    repositoryRoot,
    environment: {
      CLINICAL_SCOUT_CONTACT_EMAIL:
        process.env.CLINICAL_SCOUT_CONTACT_EMAIL ??
        environment.CLINICAL_SCOUT_CONTACT_EMAIL,
      CLINICAL_SCOUT_AUTO:
        process.env.CLINICAL_SCOUT_AUTO ??
        environment.CLINICAL_SCOUT_AUTO,
      NCBI_API_KEY:
        process.env.NCBI_API_KEY ?? environment.NCBI_API_KEY,
    },
  });
  const privateIntake = new LocalPrivateIntakeService(
    repositoryRoot,
    reviewer.id,
  );
  const authoringContext = new LocalAuthoringContextService(repositoryRoot);
  const middleware = createApiMiddleware({
    store,
    expectedHost: "127.0.0.1:4174",
    allowedOrigin: "http://127.0.0.1:4174",
    scoutCoordinator,
    privateIntake,
    authoringContext,
    reviewer,
  });
  let scoutInProgress = false;
  const scoutDue = async () => {
    if (
      scoutInProgress ||
      !scoutCoordinator.status().enabled ||
      !scoutCoordinator.status().automatic ||
      scoutCoordinator.scoutDue === undefined
    ) {
      return;
    }
    scoutInProgress = true;
    try {
      const current = await store.read();
      const next = await scoutCoordinator.scoutDue(current.workspace);
      if (next !== null) {
        await store.save(next, current.etag);
      }
    } catch (error) {
      if (!(error instanceof WorkspaceConflictError)) {
        // Provider failures are recorded by the coordinator where possible.
        // A remaining startup failure must not stop the local review UI.
      }
    } finally {
      scoutInProgress = false;
    }
  };

  return {
    name: "clinical-context-workbench-api",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use(middleware);
      void scoutDue();
      const interval = setInterval(
        () => void scoutDue(),
        DUE_SCOUT_INTERVAL_MS,
      );
      interval.unref();
      server.httpServer?.once("close", () => clearInterval(interval));
    },
  };
}

export const createWorkbenchViteConfig = (mode: string): UserConfig => {
  const environment = loadEnv(mode, repositoryRoot, "");
  return {
    root: clientRoot,
    appType: "spa",
    plugins: [react(), clinicalContextApiPlugin(environment)],
    server: {
      host: "127.0.0.1",
      port: 4174,
      strictPort: true,
      cors: false,
      fs: {
        strict: true,
        allow: [clientRoot, dependencyRoot],
        deny: [
          "**/.clinical-workbench/**",
          "**/.private-clinical-data/**",
          "**/clinical-data/private/**",
          "**/clinical-data/imports/**",
          "**/clinical-data/exports/**",
          ".env",
          ".env.*",
          "*.{crt,pem}",
        ],
      },
      headers: {
        "Content-Security-Policy":
          "default-src 'self'; base-uri 'none'; connect-src 'self' ws://127.0.0.1:4174; font-src 'self'; form-action 'self'; frame-ancestors 'none'; img-src 'self' data:; object-src 'none'; script-src 'self'; style-src 'self' 'unsafe-inline'",
        "Referrer-Policy": "no-referrer",
        "X-Content-Type-Options": "nosniff",
      },
    },
  };
};

export default defineConfig(({ mode }) => createWorkbenchViteConfig(mode));
