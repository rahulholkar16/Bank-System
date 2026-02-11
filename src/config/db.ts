import mongooes from "mongoose";

let isConnecte = false;

export const connectDb = async () => {
    if (isConnecte) return;
    try {
        const db = await mongooes.connect(process.env.MONGO_URI as string);
        isConnecte = db.connection.readyState === 1;
        console.log("✅ MongoDB connected");
    } catch (error) {
        if (error instanceof Error) {
            console.error("❌ MongoDB error:", error.message);
        } else {
            console.error("❌ MongoDB error:", error);
        }
        process.exit(1);
    }
};