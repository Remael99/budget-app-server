import { boolean, number, object, string, TypeOf } from "zod";


const payload = {
      body:object({
            description:string({
                required_error:"please provide description "
            }),
            amount:number({
                required_error:"provide amount for expense"
            }),
       
        })

}

const params = {
    params:object({
         expenseId:string({
             required_error:"expense is required"
         })
    })
}

export const createExpenseSchema = object({
    ...payload
})

export const updateExpenseSchema = object({
    ...payload,
    ...params,


})

export const deleteExpenseSchema = object({
    ...params
})

export const getExpenseSchema = object({
    ...params
})


export type createExpenseInput = TypeOf<typeof createExpenseSchema>  
export type updateExpenseInput = TypeOf<typeof updateExpenseSchema>
export type deleteExpenseInput = TypeOf<typeof deleteExpenseSchema>
export type getExpenseInput = TypeOf<typeof getExpenseSchema>