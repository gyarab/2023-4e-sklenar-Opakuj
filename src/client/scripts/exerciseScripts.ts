function checkFile(file) {
  const validExtensions = ["txt"];
  const fileExtension = file.name.split(".").pop();
  if (!validExtensions.includes(fileExtension)) {
    return false;
  }
  return true;
}
async function exerciseCreator(text) {
  try {
    text = await komentarCheck(text);
    text = text.replace(/\r/g, "");
    var exercise = {
      name: "",
      questions: [] as Object[],
    };
    var tmpLine: string[] = [];
    if (text !== null || text !== undefined || text !== "") {
      var lines = typeof text === "string" ? text.split("\n") : [];
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].charAt(0) === "#") {
          exercise.name = lines[i].substring(1);
        }
        if (/^\d$/.test(lines[i].charAt(0))) {
          tmpLine.push(lines[i]);
        }
        if (lines[i].charAt(3) === "-") {
          tmpLine.push(lines[i]);
        }
        if (lines[i].charAt(0) === "/") {
          tmpLine.push(lines[i]);
        }
        if (lines[i].charAt(0) === "[") {
          tmpLine.push(lines[i]);
        }
        if (lines[i].charAt(0) === "!") {
          tmpLine.push(lines[i]);
        }
        if (lines[i].charAt(0) === "" || i === lines.length - 1) {
          exercise.questions.push(await createQuestion(tmpLine));
          tmpLine = [];
        }
      }
    }
  } catch (error) {
    console.log(error);
    return null;
  }
  return exercise;
}

async function createExercise(file) {
  const exerciseContent = await new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async () => {
      try {
        const content = await exerciseCreator(reader.result);
        resolve(content);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = (err) => {
      reject(err);
    };

    reader.readAsText(file, "UTF-8");
  });

  return exerciseContent;
}

async function createExerciseFinal(file, visibility) {
  var exerciseCB: any = await createExercise(file);
  exerciseCB["visibility"] = visibility;
  return exerciseCB;
}

async function createQuestion(lines) {
  var question = {
    number: 0,
    question: "",
    type: "",
    context: [] as string[],
    answer: "",
    answersRight: [] as string[][],
    answersWrong: [] as string[][],
  };
  //prvni se najde jmeno otazky a tema
  for (let i = 0; i < lines.length; i++) {
    if (/^\d$/.test(lines[i].charAt(0))) {
      let line = lines[i].toString().split(".");
      question.number = parseInt(line[0]);
      question.question = line[1];
    }
    if (lines[i].charAt(3) === "-") {
      question.type = lines[i].substring(4);
    }
  }
  //druhe se najde kontext a odpoved(pokud je)
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].charAt(0) === "/") {
      switch (question.type) {
        case "$":
          let context = lines[i].substring(1, lines[i].length);
          let contextArr = context.split(" ");
          let arrTmp = [] as any[];
          let questionArr = [] as any[];
          //prohledavam pole dokud nenanarazim na !, to je znameni pro doplnovacku
          //a tak vytvorim z arrTMP jednu polozku a tu pushnu do questionArr
          for (let i = 0; i < contextArr.length; i++) {
            if (contextArr[i].charAt(0) == "!") {
              arrTmp[0] = arrTmp.join(" ");
              questionArr.push(arrTmp[0]);
              arrTmp = [];
            } else {
              arrTmp.push(contextArr[i]);
            }

            //chybi podminka pro posledni polozku
            if (i == contextArr.length - 1) {
              arrTmp[0] = arrTmp.join(" ");
              questionArr.push(arrTmp[0]);
            }
          }
          for (let item of questionArr) {
            question.context.push(item);
          }
          break;
        case "%":
          question.answer = lines[i].substring(1);
          break;
        case "&":
          break;
        case "#":
          break;
      }
    }
    if (lines[i].charAt(0) === "[") {
      let answ = lines[i].substring(1, lines[i].length - 1);
      let answSplit = answ.split(";");
      if (question.type == "*") {
        for (let item of answSplit) {
          question.answersRight.push([item]);
        }
      } else {
        question.answersRight.push(answSplit);
      }
    }
    if (lines[i].charAt(0) === "!") {
      let answWrong = lines[i].substring(1, lines[i].length - 1);
      let answWrongSplit = answWrong.split(";");
      for (let item of answWrongSplit) {
        question.answersWrong.push([item]);
      }
    }
  }
  console.log(question);
  return question;
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

export {
  checkFile,
  createExercise,
  createQuestion,
  komentarCheck,
  createExerciseFinal,
};
