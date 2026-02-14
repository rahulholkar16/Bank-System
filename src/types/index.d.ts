import type mongoose from "mongoose";

interface USER extends mongoose.Document {
    email: string;
    name: string;
    password: string;
    isVerified: boolean;
    verificationToken?: string | null;
    verificationTokenExpire?: Date | null;
    resetPasswordToken?: string;
    resetPasswordTokenExpire?: Date | null;
    refreshToken?: string;
    isPasswordCorrect: (password: string) => Promise<boolean>;
    generateAccessToken(): string;
    generateRefreshToken(): string;
    generateTempToken(): {
        unHashedToken: string;
        hasedToken: string;
        tokenExpiry: Date;
    };
};