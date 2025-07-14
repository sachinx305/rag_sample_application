import { END } from "@langchain/langgraph";

/**
 * Decides whether the agent should retrieve more information or end the process.
 * This function checks the last message in the state for a function call. If a tool call is
 * present, the process continues to retrieve information. Otherwise, it ends the process.
 * @param {typeof GraphState.State} state - The current state of the agent, including all messages.
 * @returns {string} - A decision to either "continue" the retrieval process or "end" it.
 */
function shouldRetrieve(state) {
    const { messages } = state;
    console.log("---DECIDE TO RETRIEVE---");
    const lastMessage = messages[messages.length - 1];

    if ("tool_calls" in lastMessage && Array.isArray(lastMessage.tool_calls) && lastMessage.tool_calls.length) {
        console.log("---DECISION: RETRIEVE---");
        return "retrieve";
    }
    // If there are no tool calls then we finish.
    return END;
}

export default { shouldRetrieve };