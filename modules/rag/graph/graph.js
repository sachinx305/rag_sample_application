import { StateGraph, START, END, Annotation } from "@langchain/langgraph";
import retriever from "./nodes/retriever.js";
import standaloneQuery from "./nodes/standaloneQuery.js";
import gradeDocuments from "./nodes/gradeDocuments.js";
import webSearch from "./nodes/duckduckgoSearch.js";
import generateAnswer from "./nodes/generateAnswer.js";

const GraphState = Annotation.Root({
  messages: Annotation({
    reducer: (x, y) => x.concat(y),
    default: () => [],
  }),
});

// Define the graph
const workflow = new StateGraph(GraphState)
  // Define the nodes which we'll cycle between.
  .addNode("retrieveDocsFromVectorDB", retriever)
  .addNode("UserQueryToStandaloneQuery", standaloneQuery)
  .addNode("webSearch", webSearch)
  .addNode("isDocRelevantToQuestion", gradeDocuments)
  .addNode("generateAnswer", generateAnswer);

// Call agent node to decide to retrieve or not
workflow.addEdge(START, "UserQueryToStandaloneQuery");

// // Decide whether to retrieve
// workflow.addConditionalEdges(
//   "agent",
//   // Assess agent decision
//   shouldRetrieve,
// );

workflow.addEdge("UserQueryToStandaloneQuery", "retrieveDocsFromVectorDB");
workflow.addEdge("retrieveDocsFromVectorDB", "isDocRelevantToQuestion");

// // Edges taken after the `action` node is called.
workflow.addConditionalEdges(
  "isDocRelevantToQuestion",
  (state) => {
    if (state["messages"][state["messages"].length - 1].content == "No") {
      console.log(
        "---DECISION: NOT ALL DOCUMENTS ARE NOT RELEVANT TO QUESTION, INCLUDE WEB SEARCH---"
      );
      return "no";
    } else {
      console.log("---DECISION: GENERATE---");
      return "yes";
    }
  },
  {
    // Call tool node
    yes: "generateAnswer",
    no: "webSearch", 
  }
);
workflow.addEdge("webSearch", "isDocRelevantToQuestion");
workflow.addEdge("isDocRelevantToQuestion", "generateAnswer");
workflow.addEdge("generateAnswer", END);
// workflow.addEdge("rewrite", "agent");

// Compile
const graphApp = workflow.compile();

export default graphApp;
