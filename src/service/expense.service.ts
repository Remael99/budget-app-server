import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import ExpenseModel, { ExpenseDocument } from "../model/expense.model";
import { createExpenseInput } from "../schema/expense.schema";


export async function createExpense(input:createExpenseInput|ExpenseDocument ){
     return await ExpenseModel.create(input)
}


export async function findExpense(query:FilterQuery<ExpenseDocument>, options:QueryOptions = {lean:true}){
     return ExpenseModel.findOne(query,{},options)
      
}


export async function findAndUpdateExpense(query:FilterQuery<ExpenseDocument>, update:UpdateQuery<ExpenseDocument>,options:QueryOptions = {lean:true}){
    return ExpenseModel.findOneAndUpdate(query,update,options)
}


export async function deleteExpense(query:FilterQuery<ExpenseDocument>){
       return ExpenseModel.deleteOne(query)
}
