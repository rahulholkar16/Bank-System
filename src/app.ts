import express from "express";
import cors from "cors";

const app = express();
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cors({
    origin: "*",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.get('/', (req, res) => {
    res.json({
        msg: "Welcome!!"
    })
});

export default app;