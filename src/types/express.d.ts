import type z from "zod";
import type { validtionSchema } from "../middlewares/validation.middlewares.ts";
import type { USER } from "./index.js";

declare global {
    namespace Express {
        interface Request {
            validateData?: z.infer<typeof validtionSchema>;
            user?: USER;
        }
    }
}