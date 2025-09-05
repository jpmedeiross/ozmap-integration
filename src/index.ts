import "dotenv/config";
import app from "./app";
import logger from "./logger";
import { connectDB } from "./database/connection";
import { fetchIspData } from "./jobs/fetchIspData";

const PORT = process.env.PORT || 3000;

async function startServer() {
  await connectDB();

  app.listen(PORT, () => {
    logger.info(`Servidor rodando em http://localhost:${PORT}`);
  });

  await runIspJob();

  const INTERVAL = 2 * 60 * 1000;
  setInterval(runIspJob, INTERVAL);
}

async function runIspJob() {
  try {
    logger.info("Iniciando job de sincronizacao do ISP...");
    await fetchIspData();
  } catch (error: any) {
    logger.error(
      "Erro no job de sincronizacao do ISP:",
      error.message || error
    );
  }
}

startServer();
