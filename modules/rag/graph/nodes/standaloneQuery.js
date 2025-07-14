import standaloneQueryChain from "../chains/standaloneQueryChain.js";
import { HumanMessage } from "@langchain/core/messages";

async function standaloneQuery(state) {
    console.log("---GET STANDALONE QUERY---");
  
    const { messages } = state;
  
    const standaloneQuery = await standaloneQueryChain.invoke({
      question: messages[0].content ,
      history: messages.slice(1).map(m => `${m.role}: ${m.content}`).join("\n"),
    });
  
    return {
      messages: [new HumanMessage(standaloneQuery)]
    };
  }

  export default standaloneQuery;