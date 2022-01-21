import supertest from "supertest"
import createServer from "../utils/createServer"
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose"

jest.useRealTimers();

const app = createServer()
describe("budget",()=>{
    beforeAll(async () => {
        const mongoServer = await MongoMemoryServer.create();
    
        await mongoose.connect(mongoServer.getUri());
      });

    afterAll(async ()=>{
        await mongoose.disconnect()
        await mongoose.connection.close()
    })

    describe("get budget route",()=>{
        describe("given budget does not exist", ()=>{
              it("should return a 404 and error message",async () => {
                   const budgetId = "budget_123"
                 await supertest(app).get(`/api/budgets/${budgetId}`).expect(404,{ message:"budget does  not exist"})
    })
        })
    })
})

