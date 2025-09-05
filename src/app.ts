import express from "express";
import logger from "./logger";

const app = express();

app.use(express.json());

app.get("/health", (_req, res) => {
  logger.info("Verificacao de saude OK");
  res.json({ status: "ok" });
});

export default app;
