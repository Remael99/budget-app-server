import {
  DocumentDefinition,
  FilterQuery,
  QueryOptions,
  UpdateQuery,
} from "mongoose";
import BudgetModel, { BudgetDocument } from "../model/budget.model";
import { databaseResponseTimeHistogram } from "../utils/metrics";

export async function createBudget(
  input: DocumentDefinition<
    Omit<BudgetDocument, "createdAt" | "updatedAt" | "budgetId">
  >
) {
  const metricsLabel = {
    operation: "createBudget",
  };

  const timer = databaseResponseTimeHistogram.startTimer();

  try {
    const result = await BudgetModel.create(input);

    timer({
      ...metricsLabel,
      success: "true",
    });
    return result;
  } catch (error: any) {
    timer({
      ...metricsLabel,
      success: "false",
    });
    throw new Error(error);
  }
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
