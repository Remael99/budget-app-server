import mongoose from "mongoose";
import config from "config";
import log from "./logger";

export default async function connect(){
   try {
        const dbUri = config.get<string>("dbUri")
        
        await mongoose.connect(dbUri)
        log.info("db connected succesful")
    } catch (error) {
        log.error(error)
        
        process.exit(1)
}
}