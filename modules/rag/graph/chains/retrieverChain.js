import infraInitializer from "../../initializer.js";
import { combineDocuments } from "../../chains/utils.js";

const infra = new infraInitializer();
const vectorStore = infra.getvectorStore();
const retriever = vectorStore.asRetriever();

const retrieverChain = retriever.pipe(combineDocuments);

export default retrieverChain;