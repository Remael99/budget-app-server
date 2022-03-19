import mongoose from "mongoose";
import bcrypt from "bcrypt";
import config from "config";
import { nanoid } from "./budget.model";

//use for all models

export interface UserInput {
  email: string;
  name: string;
  password: string;
}

//instead ot type mongooose lib
export interface UserDocument extends UserInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    verified: {
      type: Boolean,
    },
    verificationCode: {
      type: String,
      default: () => `verification_${nanoid()}`,
    },
    passwordResetCode: {
      type: String,
    },
  },
  { timestamps: true }
);

//has users password on save
userSchema.pre("save", async function (next) {
  let user = this as UserDocument;

  if (!user.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(config.get<number>("saltWorkFactor"));

  const hash = await bcrypt.hashSync(user.password, salt);

  user.password = hash;

  return next();
});

//compare password input with password in db
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  const user = this as UserDocument;

  return bcrypt.compare(candidatePassword, user.password).catch(() => false);
};

const UserModel = mongoose.model("User", userSchema);

export default UserModel;
