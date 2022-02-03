import config from "config";
import connect from "./utils/connect";
import log from "./utils/logger";
import createServer from "./utils/createServer";
import { startPromServer } from "./utils/metrics";

const port = config.get<number>("port");

const app = createServer();

app.listen(port, async () => {
  await connect();

  startPromServer();
  log.info(`listening at ${port}`);
});
