function check(exercise){
    if (exercise.name == undefined || exercise.name == "") {
        console.log("name");
        return false;
    }
    if (exercise.visibility == undefined || exercise.visibility == "") {
        console.log("visibility");
        return false;
    }
    if (exercise.questions == undefined || exercise.questions == "") {
        console.log("questions");
        return false;
    }
    return true;
}

function checkQuestions(question){
    if(question.number == undefined || question.number == "") {
        console.log("number");
        return false;
    }
    if (question.question == undefined || question.question == "") {
        console.log("question");
        return false;
    }
    if (question.type == undefined || question.type == "") {
        console.log("type");
        return false;
    }
    if (question.answer == undefined) {
        console.log("answer");
        return false;
    }
    if (question.answersRight == undefined ) {
        console.log("right");
        return false;
    }
    if (question.answersWrong == undefined) {
        console.log("wrong");
        return false;
    }
    return true;
}

function checkAnswerArray(answer){
    if(answer.length != 0){
    for(let i = 0; i < answer.length; i++){
        if(answer[i] == undefined){
            console.log("answerArray");
            return false;
        }
    }
    }
    return true;
}

async function komentarCheck(text) {
    let result = "";
    let count = 0;
    for (let char of text) {
      if (char === "{") {
        count++;
      } else if (char === "}" && count > 0) {
        count--;
      } else if (count === 0) {
        result += char;
      }
    }
    return result;
  }

  export {check, checkQuestions, checkAnswerArray, komentarCheck};