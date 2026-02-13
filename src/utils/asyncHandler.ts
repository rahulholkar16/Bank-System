import type { NextFunction, Request, Response } from "express";

export const asyncHandler = (requestHandler: (req: Request, res: Response, next: NextFunction) => Promise<void>): ((req: Request, res: Response, next: NextFunction) => void) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch(next);
    }
};