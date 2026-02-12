import mongoose from "mongoose";
import type { USER } from "../types/index.js";

const userSchma = new mongoose.Schema<USER>({
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    password: { type: String, required: true }
});

export const UserModel = mongoose.models.USER as mongoose.Model<USER> || mongoose.model<USER>("USER", userSchma);