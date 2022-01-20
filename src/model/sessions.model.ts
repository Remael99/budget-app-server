import mongoose from "mongoose"

import { UserDocument } from "./user.model"


//use for all models


//instead ot type mongooose lib
export interface SessionDocument extends  mongoose.Document{
    user:UserDocument["_id"], 
    valid:boolean
    createdAt:Date
    updatedAt:Date
 
}

const sessionSchema = new mongoose.Schema({
     user:{
         type:mongoose.Schema.Types.ObjectId,
         ref:"User",
         
     },
     valid:{
        type:Boolean,
        default:true,
        
    },
    
},{timestamps:true})




const SessionModel = mongoose.model("Session", sessionSchema)

export default SessionModel