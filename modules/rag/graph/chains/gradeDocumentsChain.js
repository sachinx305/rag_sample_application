import infraInitializer from "../../initializer.js";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { z } from "zod";

const infra = new infraInitializer();
const model = infra.initializeLLMModel();


const tool = {
    name: "give_relevance_score",
    description: "Give a relevance score to the retrieved documents.",
    schema: z.object({
      binaryScore: z.string().describe("Relevance score 'yes' or 'no'"),
    })
  }

const prompt = ChatPromptTemplate.fromTemplate(
    `You are a grader assessing relevance of retrieved docs to a user question.
  Here are the retrieved docs:
  \n ------- \n
  {context} 
  \n ------- \n
  Here is the user question: {question}
  If the content of the docs are relevant to the users question, score them as relevant.
  Give a binary score 'yes' or 'no' score to indicate whether the docs are relevant to the question.
  Yes: The docs are relevant to the question.
  No: The docs are not relevant to the question.`,
  );

  model.bindTools([tool], {
    tool_choice: tool.name,
  });

  const relevanceChain = prompt.pipe(model);

  export default relevanceChain;