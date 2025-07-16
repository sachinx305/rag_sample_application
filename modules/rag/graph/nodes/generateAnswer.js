import answerChain from "../chains/generateAnswerChain.js";

async function generateAnswer(state) {
    console.log("---GENERATE ANSWER---");

    const { messages } = state;
    let history = "";
    for (let i = 0; i < messages.length; i++) {
        history += `${messages[i]._getType()} : ${messages[i].content}` + "\n";
    }
    const answer = await answerChain.invoke({
      question: messages[1].content,
      context: messages[2].content,
      history,
    });
    return { messages: [answer] };
  }

  export default generateAnswer;