import logger from "../logger";
import { delay } from "../utils/delay";

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;
const BATCH_SIZE = 10;

async function sendBatch(entity: string, batch: any[]) {
  for (let i = 0; i < batch.length; i++) {
    let attempt = 0;
    let success = false;

    while (!success && attempt < MAX_RETRIES) {
      try {
        if (Math.random() < 0.1) throw new Error("Erro simulado de rede");

        await delay(100);
        logger.info(
          `${entity} item ${i + 1}/${batch.length} enviado com sucesso`
        );
        success = true;
      } catch (error: any) {
        attempt++;
        logger.warn(
          `Tentativa ${attempt} falhou para ${entity} item ${i + 1}: ${
            error.message
          }`
        );
        if (attempt < MAX_RETRIES) await delay(RETRY_DELAY_MS);
      }
    }

    if (!success) {
      logger.error(
        `Falha ao enviar ${entity} item ${i + 1} após ${MAX_RETRIES} tentativas`
      );
    }
  }
}

export async function sendToOzmap(entity: string, data: any) {
  for (let i = 0; i < data.length; i += BATCH_SIZE) {
    const batch = data.slice(i, i + BATCH_SIZE);
    await sendBatch(entity, batch);
    await delay(500);
  }
}

export async function transformAndSendToOzmap(data: any) {
  if (!data) return;

  const boxes = data.boxes.map((b: any) => ({
    boxId: b.id,
    nome: b.name,
    tipo: b.type,
    coordenadas: { lat: b.lat, lng: b.lng },
  }));

  const cables = data.cables.map((c: any) => ({
    cableId: c.id,
    nome: c.name,
    capacidade: c.capacity,
    boxesConectadas: c.boxes_connected,
    path: c.path,
  }));

  await sendToOzmap("Caixas", boxes);
  await sendToOzmap("Cabos", cables);
  await sendToOzmap("DropCables", data.drop_cables);
  await sendToOzmap("Clientes", data.customers);

  logger.info("Transformação e envio para OZmap concluídos");
}
