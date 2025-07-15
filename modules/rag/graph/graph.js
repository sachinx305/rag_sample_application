import { StateGraph, START, END, Annotation } from "@langchain/langgraph";
import retriever from "./nodes/retriever.js";
import standaloneQuery from "./nodes/standaloneQuery.js";
import gradeDocuments from "./nodes/gradeDocuments.js";
import webSearch from "./nodes/duckduckgoSearch.js";

const GraphState = Annotation.Root({
  messages: Annotation({
    reducer: (x, y) => x.concat(y),
    default: () => [],
  })
})

// Define the graph
const workflow = new StateGraph(GraphState)
  // Define the nodes which we'll cycle between.
  .addNode("retrieve", retriever)
  .addNode("standaloneQuery", standaloneQuery)
  .addNode("webSearch", webSearch)
  // .addNode("answer", answer);

  // Call agent node to decide to retrieve or not
workflow.addEdge(START, "standaloneQuery");

// // Decide whether to retrieve
// workflow.addConditionalEdges(
//   "agent",
//   // Assess agent decision
//   shouldRetrieve,
// );

workflow.addEdge("standaloneQuery", "retrieve");
workflow.addEdge("retrieve", "gradeDocuments");

// // Edges taken after the `action` node is called.
workflow.addConditionalEdges(
  "gradeDocuments",
  // Assess agent decision
  gradeDocuments,
  {
    // Call tool node
    yes: END,
    no: "webSearch", // placeholder
  },
);

workflow.addEdge("gradeDocuments", END);
// workflow.addEdge("rewrite", "agent");

// Compile
const graphApp = workflow.compile();

export default graphApp;