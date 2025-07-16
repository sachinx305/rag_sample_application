// Generate answer chain

import infraInitializer from "../../initializer.js";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { z } from "zod";

const infra = new infraInitializer();
const model = infra.initializeLLMModel();


const tool = {
    name: "generate_answer",
    description: "Generate an answer to the user question.",
    schema: z.object({
      answer: z.string().describe("Answer to the user question"),
    })
  }

  const userQueryPrompt = ChatPromptTemplate.fromMessages([
    [
      "system", "You are an helpful AI assistant and a big Harry Potter fan. You will be given the conversation history and a user’s latest question. Go through the conversation history and context, try to answer the user’s question based on the context provided. If you don't find the answer in the context, say 'I don't know'. If available in the context generate two intresting facts related to question only if you can find the answer to the original question",
    ],
    ["user", "Question: {question}\n\nContext: {context}\n\nHistory: {history}"],
  ]);

  model.bindTools([tool], {
    tool_choice: tool.name,
  });

  const answerChain = userQueryPrompt.pipe(model);

  export default answerChain;