import type z from "zod";
import type { validtionSchema } from "../middlewares/validation.middlewares.ts";

declare global {
    namespace Express {
        interface Request {
            validateData?: z.infer<typeof validtionSchema>;
        }
    }
}