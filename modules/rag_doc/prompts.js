import { ChatPromptTemplate } from "@langchain/core/prompts";

const standaloneQueryPrompt = ChatPromptTemplate.fromMessages([
  ["system", "You are an expert at rewriting conversational questions into standalone queries. You will be given the conversation history and a user’s latest question. Your job is to produce a single, self-contained question that includes all necessary context, so it can be understood without the prior dialogue."],
  ["user", "Question: {question}\nContext: {context}"],
]);

export default standaloneQueryPrompt;