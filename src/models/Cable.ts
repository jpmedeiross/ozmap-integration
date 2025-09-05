import { Schema, model, Document } from "mongoose";

export interface ICable extends Document {
  id: number;
  name: string;
  capacity: number;
  boxes_connected: number[];
  path: { lat: number; lng: number }[];
}

const CableSchema = new Schema<ICable>({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  capacity: { type: Number, required: true },
  boxes_connected: [{ type: Number, required: true }],
  path: [
    {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
  ],
});

export const Cable = model<ICable>("Cable", CableSchema);
