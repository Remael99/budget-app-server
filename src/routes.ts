import { application, Express, Request,Response } from "express";
import { ZodEffects } from "zod";
import { createSessionHandler, deleteSessionHandler, getUserSessionHandler } from "./controller/session.controller";
import { createUserHandler } from "./controller/user.controller";

import requireUser from "./middleware/requireUser";
import validate from "./middleware/validateResource";
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
} 

