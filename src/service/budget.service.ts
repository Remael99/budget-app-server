import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import BudgetModel, { BudgetDocument } from "../model/budget.model";
import { createBudgetInput } from "../schema/budget.schema";

export async function createBudget(input:createBudgetInput){
     return await BudgetModel.create(input)
}


export async function findBudget(query:FilterQuery<BudgetDocument>, options:QueryOptions = {lean:true}){
     return BudgetModel.findOne(query,{},options)
      
}


export async function findAndUpdateBudget(query:FilterQuery<BudgetDocument>, update:UpdateQuery<BudgetDocument>,options:QueryOptions = {lean:true}){
    return BudgetModel.findOneAndUpdate(query,update,options)
}


export async function deleteBudget(query:FilterQuery<BudgetDocument>){
       return BudgetModel.deleteOne(query)
}