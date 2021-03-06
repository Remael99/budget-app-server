import { Request, Response } from "express";
import {
  createBudget,
  findBudget,
  findAndUpdateBudget,
  deleteBudget,
  findAllUserBudgets,
} from "../service/budget.service";

export async function createBudgetHandler(req: Request, res: Response) {
  try {
    const userId = res.locals.user._id || res.locals.user._doc._id;

    const body = req.body;

    const { name } = body;

    const checkBudgetExists = await findBudget({ name });

    if (
      checkBudgetExists &&
      userId === String(checkBudgetExists.user) &&
      checkBudgetExists.name.toLowerCase() === name.toLowerCase()
    ) {
      return res
        .status(405)
        .send({ message: "you already have this budget cannot create twice" });
    }

    const budget = await createBudget({ ...body, user: userId });

    return res.status(200).send(budget.toJSON());
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function getBudgetHandler(req: Request, res: Response) {
  try {
    const budgetId = req.params.budgetId;

    const budget = await findBudget({ budgetId });

    if (!budget) {
      return res.status(404).send({
        message: "budget does  not exist",
      });
    }

    return res.status(200).send(budget);
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function updateBudgetHandler(req: Request, res: Response) {
  try {
    const userId = res.locals.user._id || res.locals.user._doc._id;

    const budgetId = req.params.budgetId;

    const update = req.body;

    const budget = await findBudget({ budgetId });

    if (!budget) {
      return res.status(404).send({
        message: "no such budget",
      });
    }

    if (String(budget.user) !== userId) {
      return res.status(403).send({
        message: "cannot update not user",
      });
    }

    const updatedBudget = await findAndUpdateBudget({ budgetId }, update, {
      new: true,
    });

    return res.send(updatedBudget);
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function deleteBudgetHandler(req: Request, res: Response) {
  try {
    const userId = res.locals.user._id || res.locals.user._doc._id;

    const budgetId = req.params.budgetId;

    const budget = await findBudget({ budgetId });

    if (!budget) {
      return res.send({
        error: {
          message: "no such budget",
        },
      });
    }

    if (budget.user !== userId) {
      return res.status(403).send({
        message: "cannot update not user",
      });
    }

    await deleteBudget({ budgetId });

    return res.status(200).send({ message: "deleted succesfully" });
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function getBudgetsHandler(req: Request, res: Response) {
  try {
    const userId = res.locals.user._id || res.locals.user._doc._id;

    const allBudgets = await findAllUserBudgets({ user: userId });

    return res.status(200).send(allBudgets);
  } catch (error: any) {
    throw new Error(error);
  }
}
