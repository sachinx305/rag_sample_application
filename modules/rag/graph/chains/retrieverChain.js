import infraInitializer from "../../initializer.js";
// import { retrieverPrompt } from "../prompts.js";
// import { z } from "zod";

const infra = new infraInitializer();
const model = infra.initializeLLMModel();
const vectorStore = infra.getvectorStore();

// const tool = {
//     name: "retrieve_docs",
//     description: "Retrieve documents from the vector store.",
//     schema: z.object({
//       docs: z.array(z.string()).describe("The retrieved documents."),
//     })
//   }

// const retrieverChain = retrieverPrompt.pipe(model).bindTools([tool], {
//     tool_choice: tool.name,
//   });

export { vectorStore };