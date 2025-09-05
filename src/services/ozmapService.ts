import logger from "../logger";

export async function sendToOzmap(entity: string, data: any) {
  try {
    await new Promise((resolve) => setTimeout(resolve, 300));
    logger.info(`${entity} enviado para OZmap com sucesso (mock)`);
  } catch (error: any) {
    logger.error(
      `Falha ao enviar ${entity} para OZmap:`,
      error.message || error
    );
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
}
