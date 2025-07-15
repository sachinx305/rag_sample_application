import infraInitializer from "../../initializer.js";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { DuckDuckGoSearch } from "@langchain/community/tools/duckduckgo_search";
import { z } from "zod";
import { combineDocuments } from "../../chains/utils.js";

const infra = new infraInitializer();
const model = infra.initializeLLMModel();


const tool = new DuckDuckGoSearch({maxResults: 4});

  const prompt = ChatPromptTemplate.fromTemplate(
    `You are a search engine. You are given a user question and you need to search the web for the most relevant information.
  Here is the user question: {question}
  Search the web for the most relevant information.
  Return the search results in a list of documents.`,
  );

  model.bindTools([tool], {
    tool_choice: tool.name,
  });

  const duckduckgoSearchChain = prompt.pipe(model);
  export default duckduckgoSearchChain;