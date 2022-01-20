import mongoose from "mongoose"
import { BudgetDocument, nanoid } from "./budget.model"

import { UserDocument } from "./user.model"


//use for all models


//instead ot type mongooose lib
export interface ExpenseDocument extends  mongoose.Document{
    user:UserDocument["_id"], 
    budgetId:BudgetDocument["_id"]
    amount:Number
    descriptions:String
    createdAt:Date
    updatedAt:Date
 
}

const expenseSchema = new mongoose.Schema({
    expenseId:{
        type:String,
        required:true,
        unique:true,
        default:() => `budget_${nanoid()}`
    },
     user:{
         type:mongoose.Schema.Types.ObjectId,
         ref:"User",
         
     },
     description:{
        type:String,
       
     },
     amount:{
        type:Number,
       required:true
     },    
    budgetId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Budget",
    },

    
},{timestamps:true})




const ExpenseModel = mongoose.model("Expense", expenseSchema)

export default ExpenseModel