import { Request, Response } from "express";
import { createSession, getUserSessions, updateSession,  } from "../service/session.service";
import { validatePassword } from "../service/user.service";
import { signJwt } from "../utils/jwt";
import config from "config";


export async function createSessionHandler(req:Request,res:Response){
    try {
      
     //validate password
     const user = await validatePassword(req.body)
     if(!user){
        return res.status(401).send("invalid email or password")
     } 

     //create session
      const session = await createSession(user._id)
     
    
      //access token
  
      const accessToken = signJwt(
       { ...user,session:session._id},
       { expiresIn:config.get<string>("accessTokenTtl") }//15 minutes
      )

     //refresh token
     const refreshToken = signJwt(
        { ...user,session:session._id},
        { expiresIn:config.get<string>("refreshTokenTtl") }//1y depending on use case
       )
     //return tokens

     return res.send({accessToken,refreshToken})

    } catch (error:any) {
      
       throw new Error(error)
    }
} 

export async function getUserSessionHandler(req:Request,res:Response){
    try {
       const userId = res.locals.user._doc._id

       const sessions = await getUserSessions({user:userId, valid:true}) //return valid sessions
   
   
       return res.send(sessions)
    } catch (error:any) {
        throw new Error(error)
    }
}


export async function deleteSessionHandler(req:Request, res:Response){
     try {
        const sessionId = res.locals.user.session

        await updateSession({_id:sessionId},{valid:false})

        return res.send({
           accessToken:null,
           refreshToken:null
        })
     }catch (error:any) {
      throw new Error(error)
  }
}