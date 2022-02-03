/* eslint-disable  @typescript-eslint/no-non-null-assertion */

import * as BudgetService from "../service/budget.service";
import supertest from "supertest";
import createServer from "../utils/createServer";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { createBudget, findBudget } from "../service/budget.service";
import { signJwt } from "../utils/jwt";

jest.useRealTimers();

const userId = new mongoose.Types.ObjectId().toString();
const budgetId = new mongoose.Types.ObjectId().toString();

export const budgetPayload = {
  user: userId,
  name: "clothes and perfumes pluss",
  max: 20000,
};

const budgetMockPayload = {
  _id: expect.any(String),
  name: "clothes and perfumes plus",
  max: 20000,
  user: expect.any(String),
  createdAt: expect.any(String),
  updatedAt: expect.any(String),
};

export const userPayload = {
  _id: userId,
  email: "jane.doe@example.com",
  name: "Jane Doe",
};

const app = createServer();
const mongoServer = new MongoMemoryServer();
describe("budget module", () => {
  beforeAll(async () => {
    await mongoServer.ensureInstance();

    await mongoose.connect(mongoServer.getUri());
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
    await mongoServer.stop();
  });

  describe("get budget route", () => {
    describe("given budget does not exist", () => {
      it("should return a 404 and error message", async () => {
        const budgetId = "budget_123";
        const response = await supertest(app).get(`/api/budgets/${budgetId}`);

        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe("budget does  not exist");
      });
    });

    describe("given budget does exist", () => {
      it("should return a 200 and the budget", async () => {
        const budget = await createBudget(budgetPayload);

        const { body, statusCode } = await supertest(app).get(
          `/api/budgets/${budget.budgetId}`
        );

        expect(statusCode).toBe(200);

        expect(body.budgetId).toBe(budget.budgetId);
      });
    });
  });

  describe("create budget route", () => {
    describe("given the user is not logged in", () => {
      it("should return a 403", async () => {
        const { statusCode } = await supertest(app).post("/api/budgets");

        expect(statusCode).toBe(403);
      });
    });

    describe("given the user is logged in", () => {
      it("should return 200 and create a budget", async () => {
        const jwt = signJwt(userPayload);

        const createBudgetServiceMock = jest
          .spyOn(BudgetService, "createBudget")
          //@ts-ignore
          .mockReturnValueOnce(budgetMockPayload);

        const { body, statusCode } = await supertest(app)
          .post(`/api/budgets`)
          .set(`Authorization`, `Bearer ${jwt}`)
          .send(budgetPayload);

        expect(statusCode).toBe(200);

        expect(body).toEqual(budgetMockPayload);

        expect(createBudgetServiceMock).toHaveBeenCalledWith(budgetPayload);
      });

      // it("should return a 405 and an error message",async()=>{
      //   const jwt = signJwt(userPayload);
      //   const budget = await findBudget({name:budgetPayload.name})

      //   const createBudgetServiceMock = jest
      //     .spyOn(BudgetService, "createBudget")
      //     //@ts-ignore
      //     .mockReturnValueOnce(budgetMockPayload);

      //   const { body, statusCode } = await supertest(app)
      //     .post(`/api/budgets`)
      //     .set(`Authorization`, `Bearer ${jwt}`)
      //     .send(budgetPayload);

      //   expect(statusCode).toBe(405);

      //   expect(body).toEqual({message: 'you already have this budget cannot create twice' });

      //   expect(createBudgetServiceMock).toHaveBeenCalledWith(budgetPayload);
      // })
    });
  });
});
