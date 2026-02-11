import dotenv from "dotenv";
import "dotenv/config"; 
import app from "./app.js";

dotenv.config();
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log("Server start at: ", PORT);
});