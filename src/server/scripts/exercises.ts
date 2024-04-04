import { check, checkQuestions, checkAnswerArray, komentarCheck } from "./exercisesCheck";
import ExercisePrivate from "../db/MongooseSchema/ExercisesPrivate";
import ExercisePublic from "../db/MongooseSchema/ExercisesPublic";
async function checkJSON(exercise) {
    let isItOk = true;
    if(check(exercise)){
        for(let i = 0; i < exercise.questions.length; i++){
            if(!checkQuestions(exercise.questions[i])){
                isItOk = false;
                break;
            }
            if(!checkAnswerArray(exercise.questions[i].answersRight)){
                isItOk = false;
                break;
            }
            if(!checkAnswerArray(exercise.questions[i].answersWrong)){
                isItOk = false;
                break;
            }
        }
    }

    return isItOk;
}

async function savePublic(exercise) {
    let newExercise = await ExercisePublic.create(exercise);
    //console.log(newExercise);
    return newExercise;
}

async function savePrivate(exercise) {
    let newExercise = await ExercisePrivate.create(exercise);
    //console.log(newExercise);
    return newExercise;
}

export { checkJSON, savePublic, savePrivate };