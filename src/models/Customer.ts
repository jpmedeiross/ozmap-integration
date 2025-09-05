import { Schema, model, Document } from "mongoose";

export interface ICustomer extends Document {
  id: number;
  code: string;
  name: string;
  address: string;
  box_id: number;
}

const CustomerSchema = new Schema<ICustomer>({
  id: { type: Number, required: true, unique: true },
  code: { type: String, required: true },
  name: { type: String, required: true },
  address: { type: String, required: true },
  box_id: { type: Number, required: true },
});

export const Customer = model<ICustomer>("Customer", CustomerSchema);
