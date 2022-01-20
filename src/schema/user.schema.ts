import {object, string, TypeOf, } from "zod"


export const createUserSchema = object({
    body:object({
        name:string({
            required_error:"username is required"
        }),
        password:string({
            required_error:"password is required"
        }).min(6,"password is too short - only six or more allowed"),
        confirmPassword:string({
            required_error:"please confirm password "
        }),
        email:string({
            required_error:"please provide an email "
        }).email("please provide a valid email"),
    }).refine((data)=>data.password === data.confirmPassword, {
        message:"passwords do not match please try again",
        path:["confirmPassword"]
    })
})


export type CreateUserInput = Omit<TypeOf<typeof createUserSchema>, "body.confirmPassword">
// omit compare password from input