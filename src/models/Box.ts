import { Schema, model, Document } from "mongoose";

export interface IBox extends Document {
  id: number;
  name: string;
  type: string;
  lat: number;
  lng: number;
}

const BoxSchema = new Schema<IBox>({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  type: { type: String, required: true },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
});

export const Box = model<IBox>("Box", BoxSchema);
