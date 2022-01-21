import config from "config";
import connect from "./utils/connect";
import log from "./utils/logger";
import createServer from "./utils/createServer";


const port = config.get<number>("port")

const app = createServer()

app.listen(port, async ()=> { 
    await connect()
   
    log.info(`listening at ${port}`)
})