import mongoose, { Schema, Types } from "mongoose";
import { FormStatus } from "./../enums/formStatus";


export interface FormVersionDoc extends mongoose.Document {
  formId: Types.ObjectId;             
  version: number;                     
  status: FormStatus;                  
  dsl: any;                            
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const FormVersionSchema = new Schema<FormVersionDoc>(
  {
    formId: { type: Schema.Types.ObjectId, ref: "Form", required: true, index: true },
    version: { type: Number, required: true },
    status: { type: String, enum: Object.values(FormStatus), default: FormStatus.Draft, index: true },
    dsl: { type: Schema.Types.Mixed, required: true },
    publishedAt: { type: Date }
  },
  { timestamps: true }
);

// unique version per form
FormVersionSchema.index({ formId: 1, version: 1 }, { unique: true });

// at most one published per form (Mongo partial unique index)
FormVersionSchema.index(
  { formId: 1, status: 1 },
  { unique: true, partialFilterExpression: { status: "published" } }
);

export const FormVersion = mongoose.model<FormVersionDoc>("FormVersion", FormVersionSchema);
