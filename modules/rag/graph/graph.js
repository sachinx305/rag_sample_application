import { StateGraph, START, END, Annotation } from "@langchain/langgraph";
import { Annotation } from "@langchain/langgraph";
import { BaseMessage } from "@langchain/core/messages";

const GraphState = Annotation.Root({
  messages: Annotation({
    reducer: (x, y) => x.concat(y),
    default: () => [],
  })
})

// Define the graph
const workflow = new StateGraph(GraphState)
  // Define the nodes which we'll cycle between.
  .addNode("agent", agent)
  .addNode("retrieve", toolNode)
  .addNode("gradeDocuments", gradeDocuments)
  .addNode("rewrite", rewrite)
  .addNode("generate", generate);

  // Call agent node to decide to retrieve or not
workflow.addEdge(START, "agent");

// Decide whether to retrieve
workflow.addConditionalEdges(
  "agent",
  // Assess agent decision
  shouldRetrieve,
);

workflow.addEdge("retrieve", "gradeDocuments");

// Edges taken after the `action` node is called.
workflow.addConditionalEdges(
  "gradeDocuments",
  // Assess agent decision
  checkRelevance,
  {
    // Call tool node
    yes: "generate",
    no: "rewrite", // placeholder
  },
);

workflow.addEdge("generate", END);
workflow.addEdge("rewrite", "agent");

// Compile
const graphApp = workflow.compile();

export default graphApp;