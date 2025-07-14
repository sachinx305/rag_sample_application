import infraInitializer from "../../initializer.js";
import { standaloneQueryPrompt } from "../prompts.js";
import { StringOutputParser } from "@langchain/core/output_parsers";

const infra = new infraInitializer();
const model = infra.initializeLLMModel();

const standaloneQueryChain = standaloneQueryPrompt.pipe(model).pipe(new StringOutputParser());

export default standaloneQueryChain;