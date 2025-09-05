import mongoose from "mongoose";
import logger from "../logger";

export async function connectDB(): Promise<void> {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/ozmap";
    await mongoose.connect(mongoUri);

    logger.info("Conectado ao MongoDB com sucesso");
  } catch (error: any) {
    logger.error("Erro ao conectar no MongoDB", error);
    process.exit(1);
  }
}
