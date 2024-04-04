import { Schema, model, Document } from "mongoose";
import { nanoid } from "nanoid";

interface IUser extends Document {
  googleID: string;
  displayName: string;
  firstName: string;
  lastName: string;
  email: string;
  pfp: string;
  userID: string;
}

const userSchema = new Schema<IUser>(
  {
    googleID: {
      type: String,
      required: true,
    },
    displayName: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: false,
    },
    lastName: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: true,
    },
    pfp: {
      type: String,
      required: true,
    },
    userID: {
      type: String,
      default: () => nanoid(),
    },
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

const User = model<IUser>("User", userSchema);

export default User;
