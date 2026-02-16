import jwt, { type JwtPayload } from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { UserModel } from "../models/user.model.js";

export const auth = asyncHandler(async (req, res, next) => {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
    if (!token) throw new ApiError(401, "Unauthorized request");
    try {
        const decode = jwt.verify(token, process.env.ACCESS_JWT_SECRET!) as JwtPayload;
        const user = await UserModel.findById(decode?._id);
        if (!user) throw new ApiError(401, "Invalid access token");
        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, "Invalid access token", error);
    }
});