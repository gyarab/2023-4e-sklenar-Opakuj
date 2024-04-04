import {Schema, model, Document} from "mongoose";
import {nanoid} from "nanoid";

const exercisePublicSchema = new Schema({
    userID: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    questions: [{
        number: {
            type: Number,
            required: true,
        },
        question: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            required: true,
        },
        context:[{
            type: String,
            required: false,
        }],
        answer: {
            type: String,
            required: false,
        },
        answersRight: [[{
            type: String,
            required: false,
        }]],
        answersWrong: [[{
            type: String,
            required: false,
        }]],
    }],
    exerciseID: {
        type: String,
        default: () => nanoid(),
    },
    visibility: {
        type: String,
        required: true,
    },
    }, {timestamps: {createdAt: true, updatedAt: true}});
    
const ExercisePublic = model("ExercisePublic", exercisePublicSchema);
export default ExercisePublic;