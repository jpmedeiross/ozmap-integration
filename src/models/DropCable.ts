import { Schema, model, Document } from "mongoose";

export interface IDropCable extends Document {
  id: number;
  name: string;
  box_id: number;
  customer_id: number;
}

const DropCableSchema = new Schema<IDropCable>({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  box_id: { type: Number, required: true },
  customer_id: { type: Number, required: true },
});

export const DropCable = model<IDropCable>("DropCable", DropCableSchema);
