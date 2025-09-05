import cron from "node-cron";
import axios from "axios";
import logger from "../logger";
import { Box } from "../models/Box";
import { Cable } from "../models/Cable";
import { DropCable } from "../models/DropCable";
import { Customer } from "../models/Customer";
import { transformAndSendToOzmap } from "../services/ozmapService";

export async function fetchIspData() {
  try {
    const cablesResponse = await axios.get("http://localhost:4000/cables");
    const dropCablesResponse = await axios.get(
      "http://localhost:4000/drop_cables"
    );
    const boxesResponse = await axios.get("http://localhost:4000/boxes");
    const customersResponse = await axios.get(
      "http://localhost:4000/customers"
    );

    const data = {
      cables: cablesResponse.data,
      drop_cables: dropCablesResponse.data,
      boxes: boxesResponse.data,
      customers: customersResponse.data,
    };

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

    if (data) {
      await transformAndSendToOzmap(data);
      logger.info("Transformação e envio para OZmap concluídos");
    }

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
