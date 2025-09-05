import cron from "node-cron";
import axios from "axios";
import logger from "../logger";
import { Box } from "../models/Box";
import { Cable } from "../models/Cable";
import { DropCable } from "../models/DropCable";
import { Customer } from "../models/Customer";

async function fetchIspData() {
  try {
    const response = await axios.get("http://localhost:4000");
    const data = response.data;

    logger.info("Dados do ISP buscados com sucesso");

    await Promise.all(
      data.boxes.map((b: any) =>
        Box.updateOne({ id: b.id }, b, { upsert: true })
      )
    );
    await Promise.all(
      data.cables.map((c: any) =>
        Cable.updateOne({ id: c.id }, c, { upsert: true })
      )
    );
    await Promise.all(
      data.drop_cables.map((d: any) =>
        DropCable.updateOne({ id: d.id }, d, { upsert: true })
      )
    );
    await Promise.all(
      data.customers.map((c: any) =>
        Customer.updateOne({ id: c.id }, c, { upsert: true })
      )
    );

    logger.info("Dados do ISP salvos no MongoDB com sucesso");

    return data;
  } catch (error: any) {
    logger.error("Erro ao buscar/salvar dados do ISP:", error.message || error);
    return null;
  }
}

export function startIspSyncJob() {
  cron.schedule("* * * * *", async () => {
    logger.info("Iniciando job de sincronização do ISP...");
    await fetchIspData();
  });
}
