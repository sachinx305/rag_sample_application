// renderGraph.js
import { writeFileSync } from "fs";
import graphApp from "./modules/rag/graph/graph.js";

/**
 * Generate Mermaid code from the compiled LangGraph
 */
function generateMermaidFromGraph(graph) {
  const lines = ["graph TD"];

  const edges = graph.builder.edges;

  edges.forEach(([from, to]) => {
    const source = from === "__start__" ? "START" : from;
    const target = to === "__end__" ? "END" : to;
    lines.push(`${source} --> ${target}`);
  });

  return lines.join("\n");
}

// Generate Mermaid syntax
const mermaidCode = generateMermaidFromGraph(graphApp);

// Write to .mmd file
writeFileSync("graph.mmd", mermaidCode);

console.log("✅ Mermaid diagram saved to graph.mmd");
