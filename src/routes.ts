import {  Express, Request,Response } from "express";
import { createBudgetHandler, deleteBudgetHandler, getBudgetHandler, updateBudgetHandler } from "./controller/budget.controller";
import { createSessionHandler, deleteSessionHandler, getUserSessionHandler } from "./controller/session.controller";
import { createUserHandler } from "./controller/user.controller";
import requireUser from "./middleware/requireUser";
import validate from "./middleware/validateResource";
import { createBudgetSchema, deleteBudgetSchema, getBudgetSchema, updateBudgetSchema } from "./schema/budget.schema";
import { createSessionSchema } from "./schema/session.schema";
import { createUserSchema } from "./schema/user.schema";


export default function routes(app:Express){
    app.get("/healthcheck",(req:Request,res:Response)=>{
           res.sendStatus(200)
    })

    app.post("/api/users", validate(createUserSchema), createUserHandler)

    app.post("/api/sessions",  validate(createSessionSchema), createSessionHandler)

    app.get("/api/sessions", requireUser, getUserSessionHandler)

    app.delete("/api/sessions", requireUser, deleteSessionHandler)

    app.post("/api/budgets",[requireUser, validate(createBudgetSchema)], createBudgetHandler)

    app.get("/api/budgets/:budgetId",validate(getBudgetSchema), getBudgetHandler)

    app.put("/api/budgets/:budgetId", [requireUser,validate(updateBudgetSchema)], updateBudgetHandler)

    app.delete("/api/budgets/:budgetId", [requireUser,validate(deleteBudgetSchema)], deleteBudgetHandler)
} 

