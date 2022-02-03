//test user
//test user regiestration
//test username and password validation
//verify passwords
//verify handler

import * as UserService from "../service/user.service";
import mongoose from "mongoose";
import supertest from "supertest";
import createServer from "../utils/createServer";

const app = createServer();

const userId = new mongoose.Types.ObjectId().toString();

export const userPayload = {
  _id: userId,
  email: "mikeTest2@email.com",
};

const createUserInput = {
  email: "mikeTest2@email.com",
  name: "Mambo Michael Mwaura",
  password: "MichaelMambo69",
  confirmPassword: "MichaelMambo69",
};

describe("user module", () => {
  describe("create user", () => {
    describe("given username and password are valid", () => {
      it("should return  a user data", async () => {
        const createUserServiceMock = jest
          .spyOn(UserService, "createUser")
          //@ts-ignore
          .mockReturnValueOnce(userPayload);

        const { body, statusCode } = await supertest(app)
          .post(`/api/users`)
          .send(createUserInput);

        expect(statusCode).toBe(200);

        expect(body).toEqual(userPayload);

        expect(createUserServiceMock).toHaveBeenCalledWith(createUserInput);
      });
    });

    describe("given passwords do not match", () => {
      it("should return  a 400 and an error message", async () => {
        const createUserServiceMock = jest
          .spyOn(UserService, "createUser")
          //@ts-ignore
          .mockReturnValueOnce(userPayload);

        const { statusCode, body } = await supertest(app)
          .post("/api/users")
          .send({ ...createUserInput, confirmPassword: "doesnotMatch" });

        expect(statusCode).toBe(400);

        expect(createUserServiceMock).not.toHaveBeenCalled();
      });
    });

    describe("given the user service throws ", () => {
      it("should return a 409 error and message", () => {
        expect(true).toBe(true);
      });
    });
  });

  describe("create user session", () => {});
});
