import duckduckgoSearchChain from "../chains/duckduckgoSearchChain.js";

async function webSearch(state) {
    console.log("---GET SEARCH RESULTS---");
    // console.log(state);
    const { messages } = state;
    const searchResults = await duckduckgoSearchChain.invoke({
      question: messages[1].content ,
    });
    // console.log(searchResults);
    return {
      messages: [searchResults]
    };
  }

  export default webSearch;