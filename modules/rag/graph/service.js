import { HumanMessage } from "@langchain/core/messages";
import { StringOutputParser } from "@langchain/core/output_parsers";
import * as dotenv from "dotenv";

import * as prompts from "./prompts.js";
import { LLM_TYPE, EMBEDDING_MODEL } from "../constants.js";
import infraInitializer from "../initializer.js";
import { consoleLog } from "../chains/utils.js";
import graphApp from "./graph.js";

// Load environment variables
dotenv.config();

class RagService {
  constructor() {
    
    this.outputParser = new StringOutputParser();
    this.debug = process.env.DEBUG;

    // Initialize components using the initializer
    const initializer = new infraInitializer();
    this.llmType = initializer.getLLMType();
    this.model = initializer.initializeLLMModel();
    this.vectorStore = initializer.getvectorStore();
    this.textSplitter = initializer.initializeTextSplitter();
  }

  async executeRagGraph(query) {
    // this.userContext.push(`User: ${query}`);
    const inputs = { messages: [new HumanMessage(query)] };
    let finalState;
    
    finalState = await graphApp.invoke(inputs);
    // for await (const output of await graphApp.stream(inputs)) {
    //   for (const [key, value] of Object.entries(output)) {
    //     const lastMsg = output[key].messages[output[key].messages.length - 1];
    //     consoleLog(`Output from node: '${key}'`, this.debug);
    //     console.dir({
    //       type: lastMsg._getType(),
    //       content: lastMsg.content,
    //       tool_calls: lastMsg.tool_calls,
    //     }, { depth: null });
    //     consoleLog("---\n", this.debug);
    //     finalState = value;
    //   }
    // }
    return finalState;
  }
}

export const RagGraphService = new RagService();
