import mongoose from "mongoose";
import { customAlphabet } from "nanoid";

import { UserDocument } from "./user.model";

export const nanoid = customAlphabet(
  "abcdefghijklmnopqrstuvwxyz0123456789",
  10
);

//use for all models

//instead ot type mongooose lib
export interface BudgetDocument extends mongoose.Document {
  user: UserDocument["_id"];
  budgetId: string;
  name: string;
  max: Number;
  createdAt: Date;
  updatedAt: Date;
}

const budgetSchema = new mongoose.Schema(
  {
    budgetId: {
      type: String,
      required: true,
      unique: true,
      default: () => `budget_${nanoid()}`,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    name: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
    },
    max: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const BudgetModel = mongoose.model("Budget", budgetSchema);

export default BudgetModel;
