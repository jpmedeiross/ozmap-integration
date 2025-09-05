import express from "express";
import logger from "./logger";

const app = express();

app.use(express.json());

// rota de teste
app.get("/health", (_req, res) => {
  logger.info("Verificação de saúde OK");
  res.json({ status: "ok" });
});

export default app;
