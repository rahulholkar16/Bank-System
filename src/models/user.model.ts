import mongoose from "mongoose";
import type { USER } from "../types/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchma = new mongoose.Schema<USER>({
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    password: { type: String, required: true, select: false }
}, { timestamps: true });

userSchma.pre("save", async function () {
    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 10);
    return;
});

userSchma.methods.isPasswordCorrect = async function (password: string) {
    return await bcrypt.compare(password, this.password);
};

userSchma.methods.generateAccessToken = async function () {
    return jwt.sing(
        {
            _id: this._id,
        }, 
        process.env.ACCESS_JWT_SECRET,
        
    )
};

export const UserModel = mongoose.models.USER as mongoose.Model<USER> || mongoose.model<USER>("USER", userSchma);