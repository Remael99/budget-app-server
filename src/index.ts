import config from "config";
import connect from "./utils/connect";
import log from "./utils/logger";
import createServer from "./utils/createServer";
import { restResponseTimeHistogram, startPromServer } from "./utils/metrics";
import responseTime from "response-time";
import { Request, Response } from "express";

const port = config.get<number>("port");

const app = createServer();

app.use(
  responseTime((req: Request, res: Response, time: number) => {
    if (req.route.path) {
      console.log(req.method, req.route.path);
      restResponseTimeHistogram.observe(
        {
          method: req.method,
          route: req.route.path,
          status_code: res.statusCode,
        },
        time * 1000
      );
    }
  })
);

app.listen(port, async () => {
  await connect();

  startPromServer();
  log.info(`listening at ${port}`);
});
