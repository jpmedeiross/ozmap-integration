import dotenv from "dotenv";
import app from "./app";
import logger from "./logger";
import { connectDB } from "./database/connection";

dotenv.config();

const PORT = process.env.PORT || 3000;

async function bootstrap() {
  await connectDB();

  app.listen(PORT, () => {
    logger.info(`Servidor rodando em http://localhost:${PORT}`);
  });
}

bootstrap();
