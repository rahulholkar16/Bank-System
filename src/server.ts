import dotenv from "dotenv";
import "dotenv/config"; 
import { connectDb } from "./config/db.js";
import app from "./app.js";

dotenv.config();
connectDb()
    .then(() => {
        const PORT = process.env.PORT;
        app.listen(PORT, () => {
            console.log("Server start at: ", PORT);
        });
    })
    .catch((err) => {
        console.error("MongoDB connection error: ", err);
        process.exit(1);
    });