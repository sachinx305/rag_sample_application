import retrieverChain from "../chains/retrieverChain.js";
import { ToolMessage } from "@langchain/core/messages";
import { z } from "zod";


async function retriever(state) {
    console.log("---GET RETRIEVED DOCS---");
    const { messages } = state;
    const docs = await retrieverChain.invoke(messages[1].content);
  
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