import {object ,string} from "zod";

export const createSessionSchema = object({
    body:object({
        email:string({
            required_error:"please provide an email "
        }),
        password:string({
            required_error:"password is required"
        })

    })
})
