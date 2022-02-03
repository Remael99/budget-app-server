import {
  DocumentDefinition,
  FilterQuery,
  QueryOptions,
  UpdateQuery,
} from "mongoose";
import BudgetModel, { BudgetDocument } from "../model/budget.model";

export async function createBudget(
  input: DocumentDefinition<
    Omit<BudgetDocument, "createdAt" | "updatedAt" | "budgetId">
  >
) {
  return await BudgetModel.create(input);
}

export async function findBudget(
  query: FilterQuery<BudgetDocument>,
  options: QueryOptions = { lean: true }
) {
  return BudgetModel.findOne(query, {}, options);
}

export async function findAndUpdateBudget(
  query: FilterQuery<BudgetDocument>,
  update: UpdateQuery<BudgetDocument>,
  options: QueryOptions = { lean: true }
) {
  return BudgetModel.findOneAndUpdate(query, update, options);
}

export async function deleteBudget(query: FilterQuery<BudgetDocument>) {
  return BudgetModel.deleteOne(query);
}

export async function findAllUserBudgets(query: FilterQuery<BudgetDocument>) {
  return BudgetModel.find(query);
}
