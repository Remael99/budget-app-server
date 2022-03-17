import { omit } from "lodash";
import { DocumentDefinition, FilterQuery } from "mongoose";
import UserModel, { UserDocument, UserInput } from "../model/user.model";

export async function createUser(input: UserInput) {
  try {
    return await UserModel.create(input);
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function validatePassword({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const user = await UserModel.findOne({ email });

  if (!user) {
    return false;
  }

  const isValid = await user.comparePassword(password);

  if (!isValid) {
    return false;
  }

  return omit(user.toJSON(), "password");
}

export async function findUserById(id: String) {
  try {
    return await UserModel.findById(id);
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function findByEmail(email: String) {
  try {
    return await UserModel.findOne({ email });
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function findUser(query: FilterQuery<UserDocument>) {
  return UserModel.findOne(query);
}
