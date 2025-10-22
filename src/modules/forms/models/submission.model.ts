import mongoose, { Schema, Types } from "mongoose";


export interface SubmissionDoc extends mongoose.Document {
    formId: Types.ObjectId;
    formVersionId: Types.ObjectId;
    answers: any;
    createdAt: Date;
    updatedAt: Date;
}

const SubmissionSchema = new Schema<SubmissionDoc>(
    {
        formId: { type: Schema.Types.ObjectId, ref: "Form", required: true, index: true },
        formVersionId: { type: Schema.Types.ObjectId, ref: "FormVersion", required: true, index: true },
        answers: { type: Schema.Types.Mixed, required: true },

    },
    { timestamps: true }
);

export const Submission = mongoose.model<SubmissionDoc>("Submission", SubmissionSchema);
