import type { NextFunction, Request, Response } from 'express';
import { z } from 'zod';

const validtionSchema = z.object({
    name: z
        .string({ message: "Invalid name!" })
        .trim()
        .min(3, { message: "Name must be at least 3 characters long!" })
        .max(15, { message: "Name must be at most 15 characters long!" })
        .optional(),
    
    email: z.preprocess(
        (val) => (typeof val === "string" ? val.trim().toLowerCase() : val),
        z.email({ message: "Invalid email address" })
    ).optional(),

    password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters long" })
        .max(64, { message: "Password must be at most 64 characters long" })
        .regex(/[A-Z]/, {
            message: "Password must contain at least one uppercase letter",
        })
        .regex(/[a-z]/, {
            message: "Password must contain at least one lowercase letter",
        })
        .regex(/[0-9]/, { message: "Password must contain at least one number" })
        .regex(/[@$!%*?&#]/, {
            message:
                "Password must contain at least one special character (@, $, !, %, *, ?, &, #)",
        })
        .optional(),
});

export const validationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password } = req.body;
    const result = validtionSchema.safeParse({ name, email, password });
    if (!result.success) return res.status(400).json({ errors: z.flattenError(result.error) });
    req.validateData = result?.data;
    next();
};
