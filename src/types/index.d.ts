import type mongoose from "mongoose";

interface USER extends mongoose.Document {
    email: string;
    name: string;
    password: string;
};