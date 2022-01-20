import { Request, Response } from "express"
import { findAndUpdateBudget } from "../service/budget.service"
import { createExpense, deleteExpense, findAndUpdateExpense, findExpense } from "../service/expense.service"

export async function createExpenseHandler(req:Request,res:Response){
    try {  

        const userId = res.locals.user._id || res.locals.user._doc._id 
         const body = req.body

    
         const expense = await createExpense({...body, user:userId})

      return  res.send(expense.toJSON())
    } catch (error:any) {
        throw new Error(error)
    }
}

export async function getExpenseHandler(req:Request,res:Response){
    try {  
   
       const expenseId = req.params.expenseId

       const budget = await findExpense({expenseId})

       if(!budget){
           return res.status(404).send({
               message:"expense does  not exist"
           })
       }

       return  res.send(budget)
        
       
    } catch (error:any) {
        throw new Error(error)
    }
}

export async function updateExpenseHandler(req:Request,res:Response){
    try {  
        const userId = res.locals.user._id || res.locals.user._doc._id 
        console.log(userId)

        const expenseId = req.params.expenseId
       

        const update = req.body

        const expense = await findExpense({expenseId})

     

        if(!expense){
           return  res.send({
                message:"no such expense"
        })
        }
    console.log(String(expense) ,userId)
       if(String(expense.user) !== userId){
            return res.status(403).send({
                message:"cannot update not user"
            })
        }

        const updatedExpense = await findAndUpdateExpense({expense},update,{new:true})


   return res.send(updatedExpense)
    } catch (error:any) {
        throw new Error(error)
    }
}

export async function deleteExpenseHandler(req:Request,res:Response){
    try {  
        const userId = res.locals.user._id || res.locals.user._doc._id 

        const expenseId = req.params.expenseId

     

        const expense = await findExpense({expenseId})

        if(!expense){
           return  res.send({error:{
                message:"no such expense"
            }})
        }

        if(String(expense.user) !== userId){
            return res.status(403).send({
                message:"cannot delete not user"
            })
        }

         await deleteExpense({expenseId})


      return res.status(200).send({message:"deleted succesfully"})
      
    } catch (error:any) {
        throw new Error(error)
    }
}