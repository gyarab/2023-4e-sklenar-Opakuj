import { Schema, model, Document } from "mongoose";
import { nanoid } from "nanoid";

interface IUserStatistics extends Document {
  userID: string;
  totalExercisesPlayed: number;
  totalAnswers: number;
  totalCorrectAnswers: number;
  totalIncorrectAnswers: number;
  totalAcedExercises: number;
  totalFailedExercises: number;
  exactFailedExercises: Array<string>; //array of exerciseIDs
  exactAcedExercises: Array<string>; //array of exerciseIDs

}

const userStatisticsSchema = new Schema<IUserStatistics>(
    {
        userID: {
            type: String,
            required: true,
        },
        totalExercisesPlayed: {
            type: Number,
            required: true,
        },
        totalAnswers: {
            type: Number,
            required: true,
        },
        totalCorrectAnswers: {
            type: Number,
            required: true,
        },
        totalIncorrectAnswers: {
            type: Number,
            required: true,
        },
        totalAcedExercises: {
            type: Number,
            required: true,
        },
        totalFailedExercises: {
            type: Number,
            required: true,
        },
        exactFailedExercises: [{
            type: String,
            required: false,
        }],
        exactAcedExercises: [{
            type: String,
            required: false,
        }],
    },
    { timestamps: { createdAt: true, updatedAt: true } });

const UserStatistics = model<IUserStatistics>("UserStatistics", userStatisticsSchema);

export default UserStatistics;