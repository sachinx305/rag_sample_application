import infraInitializer from "../../initializer.js";
import { standaloneQueryPrompt } from "../prompts.js";

const infra = new infraInitializer();
const model = infra.initializeLLMModel();

const standaloneQueryChain = standaloneQueryPrompt.pipe(model);

export default standaloneQueryChain;