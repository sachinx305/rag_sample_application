import { ChatPromptTemplate } from "@langchain/core/prompts";

const standaloneQueryPrompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    "You are an expert at rewriting conversational questions into standalone queries. You will be given the conversation history and a user’s latest question. Your job is to produce a single, self-contained question that includes all necessary context, so it can be understood without the prior dialogue.",
  ],
  ["user", "Question: {question}\n\nHistory: {history}"],
]);

const userQueryPrompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    "You are an helpful AI assistant and a big Harry Potter fan. You will be given the conversation history and a user’s latest question. Go through the conversation history and answer the user’s question based on the context provided. If you don't find the answer in the context, say 'I don't know'",
  ],
  ["user", "Question: {question}\n\nContext: {context}\n\nHistory: {history}"],
]);

export { standaloneQueryPrompt, userQueryPrompt };
