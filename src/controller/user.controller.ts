import { Request, Response } from "express";
import sendEmail from "../utils/mailer";
import { omit } from "lodash";
import {
  CreateUserInput,
  VerifyUserInput,
  forgotPasswordInput,
  ResetPasswordInput,
} from "../schema/user.schema";
import {
  createUser,
  findUserById,
  findByEmail,
  findUser,
} from "../service/user.service";
import log from "../utils/logger";
import { nanoid } from "nanoid";

export async function createUserHandler(
  req: Request<{}, {}, CreateUserInput["body"]>,
  res: Response
) {
  try {
    //create user
    const user = await createUser(req.body);

    await sendEmail({
      from: "remael99@gmail.com",
      to: user.email,
      subject: "verify account",
      html: `<html> <head> <meta name="viewport" content="width=device-width, initial-scale=1"> <style> .card { box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2); transition: 0.3s; width: 50%; height:fit-content; margin:auto; margin-top:50px; } .card:hover { box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2); } .container { padding: 2px 16px; } </style> </head> <body> <div class="card" style=" box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2); transition: 0.3s; width: 50%; height:fit-content; margin:auto; margin-top:50px;" > <div class="container"> <h4><b>verify your email adress</b></h4> <p> Hello ${user.name}, Thank you for taking interest in our app your verification code is <strong>${user.verificationCode}</strong> user id is <strong>${user.id}</strong> <a href="google.com" >this random link </a> </p> </div> </div> </body> </html> `,
    });

    return res.status(200).send(omit(user.toJSON(), "password"));
  } catch (error: any) {
    return res.status(409).send(error.message);
  }
}

export async function verifyUserHandler(
  req: Request<VerifyUserInput>,
  res: Response
) {
  try {
    //create user
    const id = req.params.id;
    const verificationCode = req.params.verificationCode;

    const user = await findUserById(id);

    if (!user) {
      return res.send("could not verify user");
    }

    if (user.verified) {
      return res.send("user verified! you all good");
    }

    if (user.verificationCode === verificationCode) {
      user.verified = true;
      await user.save();

      return res.send("user has been succesfully verified");
    }

    return res.status(404).send("could not verify user");
  } catch (error: any) {
    return res.status(409).send(error.message);
  }
}

export async function forgotPasswordHandler(
  req: Request<forgotPasswordInput>,
  res: Response
) {
  try {
    const { email } = req.body;

    const message = "if user exists you will receive an email";

    const user = await findByEmail(email);

    if (!user) {
      log.debug(`user with emal ${email} does not exit`);
      return res.send({ message });
    }

    if (!user.verified) {
      return res.send({ error: "user is not verified cannot reset" });
    }

    const passwordResetCode = nanoid();

    user.passwordResetCode = passwordResetCode;

    await user.save();

    await sendEmail({
      from: "remael99@gmail.com",
      to: user.email,
      subject: "reset password code",
      html: `<html> <head> <meta name="viewport" content="width=device-width, initial-scale=1"> <style> .card { box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2); transition: 0.3s; width: 50%; height:fit-content; margin:auto; margin-top:50px; } .card:hover { box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2); } .container { padding: 2px 16px; } </style> </head> <body> <div style="box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);transition: 0.3s;width: 50%;height:fit-content;margin:auto;margin-top:50px;" > <div class="container"> <h4><b>reset code</b></h4> <p> Hello ${user.name}, your password reset code <strong>${user.passwordResetCode}</strong> for user id ${user.id}, have a wonderful day! </p> </div> </div> </body> </html> `,
    });
    log.debug(`rest code sent to ${user.email}`);
    return res.send({ message });
  } catch (error: any) {
    return res.status(409).send(error.message);
  }
}

export async function resetPasswordHandler(
  req: Request<ResetPasswordInput["params"], {}, ResetPasswordInput["body"]>,
  res: Response
) {
  try {
    const { id, passwordResetCode } = req.params;
    const { password } = req.body;

    const user = await findUserById(id);

    if (
      !user ||
      !user.passwordResetCode ||
      user.passwordResetCode !== passwordResetCode
    ) {
      return res.status(400).send({ message: "could not reset password" });
    }

    user.passwordResetCode = null;

    user.password = password;
    await user.save();

    res.send({ message: "succesfully updated" });
  } catch (error: any) {
    return res.status(409).send(error.message);
  }
}
