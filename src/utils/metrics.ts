import express, { Request, Response } from "express";

import client from "prom-client";
import log from "./logger";

const app = express();

export function startPromServer() {
  const collectDefaultMetrics = client.collectDefaultMetrics;

  collectDefaultMetrics();

  app.get("/metrics", async (req: Request, res: Response) => {
    res.set("Content-Type", client.register.contentType);

    return res.send(await client.register.metrics());
  });

  app.listen(9100, () => {
    log.info("metrics server connected");
  });
}
