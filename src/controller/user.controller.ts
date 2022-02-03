import { Request, Response } from "express";
import { omit } from "lodash";
import { CreateUserInput } from "../schema/user.schema";
import { createUser } from "../service/user.service";
import log from "../utils/logger";

export async function createUserHandler(
  req: Request<{}, {}, CreateUserInput["body"]>,
  res: Response
) {
  try {
    //create user
    const user = await createUser(req.body);

    return res.status(200).send(omit(user.toJSON(), "password"));
  } catch (error: any) {
    return res.status(409).send(error.message);
  }
}
