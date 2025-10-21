import mongoose, { Schema, Types } from "mongoose";

export interface FormDoc extends mongoose.Document {
  code: string;
  title: string;
  createdBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const FormSchema = new Schema<FormDoc>(
  {
    code: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export const Form = mongoose.model<FormDoc>("Form", FormSchema);
