import axios from "axios";
import logger from "../logger";
import { Box } from "../models/Box";
import { Cable } from "../models/Cable";
import { DropCable } from "../models/DropCable";
import { Customer } from "../models/Customer";

const MAX_REQUESTS_PER_MINUTE = 50;
const INTERVAL_MS = 60000 / MAX_REQUESTS_PER_MINUTE;

async function sendWithRateLimit(items: any[], type: string) {
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    let success = false;
    let attempt = 0;

    while (!success && attempt < 3) {
      try {
        attempt++;
        await mockSendToOzmap(type, item);
        logger.info(
          `${type} item ${i + 1}/${items.length} enviado com sucesso`
        );
        success = true;
      } catch (error: any) {
        logger.warn(
          `Tentativa ${attempt} falhou para ${type} item ${i + 1}: ${
            error.message
          }`
        );
        await new Promise((res) => setTimeout(res, 1000));
      }
    }

    await new Promise((res) => setTimeout(res, INTERVAL_MS));
  }
}

async function mockSendToOzmap(type: string, item: any) {
  if (Math.random() < 0.1) throw new Error("Erro simulado de rede");
  return Promise.resolve(true);
}

export async function fetchIspData() {
  try {
    const [
      cablesResponse,
      dropCablesResponse,
      boxesResponse,
      customersResponse,
    ] = await Promise.all([
      axios.get("http://localhost:4000/cables"),
      axios.get("http://localhost:4000/drop_cables"),
      axios.get("http://localhost:4000/boxes"),
      axios.get("http://localhost:4000/customers"),
    ]);

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
      await sendWithRateLimit(data.boxes, "Caixas");
      await sendWithRateLimit(data.cables, "Cabos");
      await sendWithRateLimit(data.drop_cables, "DropCables");
      await sendWithRateLimit(data.customers, "Clientes");
      logger.info("Transformacao e envio para OZmap concluidos");
    }

    return data;
  } catch (error: any) {
    logger.error("Erro ao buscar/salvar dados do ISP:", error.message || error);
    return null;
  }
}
