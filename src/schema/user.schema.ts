import { object, string, TypeOf } from "zod";

export const createUserSchema = object({
  body: object({
    name: string({
      required_error: "username is required",
    }),
    password: string({
      required_error: "password is required",
    }).min(6, "password is too short - only six or more allowed"),
    confirmPassword: string({
      required_error: "please confirm password ",
    }),
    email: string({
      required_error: "please provide an email ",
    }).email("please provide a valid email"),
  }).refine((data: any) => data.password === data.confirmPassword, {
    message: "passwords do not match please try again",
    path: ["confirmPassword"],
  }),
});

export const verifyUserSchema = object({
  params: object({
    id: string(),
    verificationCode: string(),
  }),
});

export const forgotPassWordSchema = object({
  body: object({
    email: string({
      required_error: "please provide an email ",
    }).email("please provide a valid email"),
  }),
});

export type CreateUserInput = Omit<
  TypeOf<typeof createUserSchema>,
  "body.confirmPassword"
>;

export type VerifyUserInput = TypeOf<typeof verifyUserSchema>["params"];
// omit compare password from input

export type forgotPasswordInput = TypeOf<typeof forgotPassWordSchema>["body"];
