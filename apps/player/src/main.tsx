import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import "@fontsource/atkinson-hyperlegible/latin-400.css";
import "@fontsource/atkinson-hyperlegible/latin-700.css";
import "./styles/tokens.css";
import "./styles/global.css";
import "./styles/workspaceDensity.css";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("The player root element is missing.");
}

// Keep App in the navigation's static graph, as before the catalogue split.
// The tiny earlier startup script handles graph/asset failures without reloading.
createRoot(rootElement).render(<StrictMode><App /></StrictMode>);
