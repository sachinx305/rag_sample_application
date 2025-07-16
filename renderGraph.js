// renderGraph.js
import { writeFileSync } from "fs";
import graphApp from "./modules/rag/graph/graph.js";

graphApp.getGraphAsync().then((graph) => {
  graph.drawMermaidPng().then(async (blob) => {
    // Convert Blob to Buffer
    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    writeFileSync("graph.png", buffer);
    console.log("✅ Mermaid diagram saved to graph.png");
  });
});
