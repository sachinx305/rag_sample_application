import { vectorStore } from "../chains/retrieverChain.js";
import { ToolMessage } from "@langchain/core/messages";


async function retriever(state) {
    console.log("---GET RETRIEVED DOCS---");
    const { messages } = state;
    
    const retriever = vectorStore.asRetriever();
    const docs = await retriever.invoke(messages[0].content);
    
  
    return {
      messages: [new ToolMessage(docs, {
        name: "retrieve_docs",
        description: "Retrieve documents from the vector store.",
        schema: z.object({
          docs: z.array(z.string()).describe("The retrieved documents."),
        })
      })]
    };
  }

  export default retriever;