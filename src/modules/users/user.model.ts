import mongoose, { Schema } from "mongoose";

export type UserRole = "admin" | "editor";

export interface UserDoc extends mongoose.Document {
  email: string;
  name?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<UserDoc>(
  {
    email: { type: String, required: true, unique: true, index: true },
    name: { type: String },
    role: { type: String, enum: ["admin", "editor"], default: "editor" }
  },
  { timestamps: true }
);

export const User = mongoose.model<UserDoc>("User", UserSchema);
