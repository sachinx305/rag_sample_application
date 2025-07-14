import relevanceChain from "../chains/gradeDocumentsChain.js";

/**
 * Determines whether the Agent should continue based on the relevance of retrieved documents.
 * This function checks if the last message in the conversation is of type FunctionMessage, indicating
 * that document retrieval has been performed. It then evaluates the relevance of these documents to the user's
 * initial question using a predefined model and output parser. If the documents are relevant, the conversation
 * is considered complete. Otherwise, the retrieval process is continued.
 * @param {typeof GraphState.State} state - The current state of the agent, including all messages.
 * @returns {Promise<Partial<typeof GraphState.State>>} - The updated state with the new message added to the list of messages.
 */
async function gradeDocuments(state) {
    console.log("---GET RELEVANCE---");
  
    const { messages } = state;
    const chain = relevanceChain();
  
    const lastMessage = messages[messages.length - 1];
  
    const score = await chain.invoke({
      question: messages[0].content ,
      context: lastMessage.content ,
    });
  
    return {
      messages: [score]
    };
  }

  export default gradeDocuments;