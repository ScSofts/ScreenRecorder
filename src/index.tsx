import {App} from "./App";
import {createRoot} from "react-dom/client";

let rootElement = document.querySelector("div");

let rootRenderer = createRoot(rootElement as HTMLDivElement);
rootRenderer.render(<App/>);