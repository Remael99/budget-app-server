import { Express, Request, Response } from "express";
import {
  createBudgetHandler,
  deleteBudgetHandler,
  getBudgetHandler,
  getBudgetsHandler,
  updateBudgetHandler,
} from "./controller/budget.controller";
import {
  createExpenseHandler,
  deleteExpenseHandler,
  getExpenseHandler,
  getExpenseUnderBudget,
  updateExpenseHandler,
} from "./controller/expense.controller";
import {
  createSessionHandler,
  deleteSessionHandler,
  getUserSessionHandler,
} from "./controller/session.controller";
import {
  createUserHandler,
  verifyUserHandler,
  forgotPasswordHandler,
  resetPasswordHandler,
} from "./controller/user.controller";
import requireUser from "./middleware/requireUser";
import validate from "./middleware/validateResource";
import {
  createBudgetSchema,
  deleteBudgetSchema,
  getBudgetSchema,
  updateBudgetSchema,
} from "./schema/budget.schema";
import {
  createExpenseSchema,
  deleteExpenseSchema,
  getExpenseSchema,
  updateExpenseSchema,
} from "./schema/expense.schema";
import { createSessionSchema } from "./schema/session.schema";
import {
  createUserSchema,
  verifyUserSchema,
  forgotPassWordSchema,
  resetPassWordSchema,
} from "./schema/user.schema";

export default function routes(app: Express) {
  app.get("/healthcheck", (req: Request, res: Response) => {
    res.sendStatus(200);
  });

  app.post("/api/users", validate(createUserSchema), createUserHandler);

  app.post(
    "/api/users/verify/:id/:verificationCode",
    validate(verifyUserSchema),
    verifyUserHandler
  );

  app.post(
    "/api/users/forgot_password",
    validate(forgotPassWordSchema),
    forgotPasswordHandler
  );

  app.post(
    "/api/users/resetPasword/:id/:passwordResetCode",
    validate(resetPassWordSchema),
    resetPasswordHandler
  );

  app.post(
    "/api/sessions",
    validate(createSessionSchema),
    createSessionHandler
  );

  app.get("/api/sessions", requireUser, getUserSessionHandler);

  app.delete("/api/sessions", requireUser, deleteSessionHandler);

  app.get("/api/budgets", requireUser, getBudgetsHandler);

  app.post(
    "/api/budgets",
    [requireUser, validate(createBudgetSchema)],
    createBudgetHandler
  );

  app.get(
    "/api/budgets/:budgetId",
    validate(getBudgetSchema),
    getBudgetHandler
  );

  app.put(
    "/api/budgets/:budgetId",
    [requireUser, validate(updateBudgetSchema)],
    updateBudgetHandler
  );

  app.delete(
    "/api/budgets/:budgetId",
    [requireUser, validate(deleteBudgetSchema)],
    deleteBudgetHandler
  );

  app.post(
    "/api/expenses",
    [requireUser, validate(createExpenseSchema)],
    createExpenseHandler
  );

  app.get(
    "/api/expenses/:expenseId",
    validate(getExpenseSchema),
    getExpenseHandler
  );

  app.get(
    "/api/expenses/:budgetId",
    validate(getExpenseSchema),
    getExpenseUnderBudget
  );

  app.put(
    "/api/expenses/:expenseId",
    [requireUser, validate(updateExpenseSchema)],
    updateExpenseHandler
  );

  app.delete(
    "/api/expenses/:expenseId",
    [requireUser, validate(deleteExpenseSchema)],
    deleteExpenseHandler
  );
}
