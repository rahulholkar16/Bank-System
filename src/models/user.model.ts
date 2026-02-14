import mongoose from "mongoose";
import type { USER } from "../types/index.js";
import bcrypt from "bcrypt";
import jwt, { type SignOptions } from "jsonwebtoken";
import crypto from "crypto";

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
    return jwt.sign(
        {
            _id: this._id,
        }, 
        process.env.ACCESS_JWT_SECRET!,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY } as SignOptions
    )
};

userSchma.methods.generateRefreshToken = async function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
        },
        process.env.REFRESH_JWT_SECRET!,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY } as SignOptions
    )
};

userSchma.methods.generateTempToken = async function () {
    const unHashedToken = crypto.randomBytes(20).toString("hex");
    const hasedToken = crypto
        .createHash("sha256")
        .update(unHashedToken)
        .digest("hex");
    const tokenExpiry = Date.now() + (10 * 60 * 1000);
    return { unHashedToken, hasedToken, tokenExpiry };
};

export const UserModel = mongoose.models.USER as mongoose.Model<USER> || mongoose.model<USER>("USER", userSchma);