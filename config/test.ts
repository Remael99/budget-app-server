
import dotenv from "dotenv"

dotenv.config()

const DBPASSWORD = process.env.DBPASSWORD
const DBUSER = process.env.DBUSER


export default {
    port:5000,
    dbUri: `mongodb+srv://${DBUSER}:${DBPASSWORD}@budget-cluster.b3oxs.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
    saltWorkFactor:10,
    accessTokenTtl:"15m",
    refreshTokenTtl:"1y",
    privateKey:``,
    publicKey:``,
}