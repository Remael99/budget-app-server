import { number, object, string, TypeOf } from "zod";

const payload = {
      body:object({
            name:string({
                required_error:"please provide a name for the budget "
            }),
            max:number({
                required_error:"maximum amount for budget is required"
            })
    
        })

}

const params = {
    params:object({
         budgetId:string({
             required_error:"budget id is required"
         })
    })
}

export const createBudgetSchema = object({
    ...payload
})

export const updateBudgetSchema = object({
    ...payload,
    ...params,


})

export const deleteBudgetSchema = object({
    ...params
})

export const getBudgetSchema = object({
    ...params
})


export type createBudgetInput = TypeOf<typeof createBudgetSchema>
export type updateBudgetInput = TypeOf<typeof updateBudgetSchema>
export type deleteBudgetInput = TypeOf<typeof deleteBudgetSchema>
export type getBudgetInput = TypeOf<typeof getBudgetSchema>