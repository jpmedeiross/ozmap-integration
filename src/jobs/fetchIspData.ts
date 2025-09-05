import cron from "node-cron";
import axios from "axios";
import logger from "../logger";

async function fetchIspData() {
  try {
    const response = await axios.get("http://localhost:4000");
    const data = response.data;

    logger.info("Dados do ISP buscados com sucesso");

    return data;
  } catch (error: any) {
    logger.error("Erro ao buscar dados do ISP:", error.message || error);
    return null;
  }
}

export function startIspSyncJob() {
  cron.schedule("* * * * *", async () => {
    logger.info("Iniciando job de sincronização do ISP...");
    const data = await fetchIspData();
    if (data) {
      logger.info(
        `Dados recebidos: cabos: ${data.cables.length}, caixas: ${data.boxes.length}`
      );
    }
  });
}
