import type { Request, Response } from "express";
import { UserModel } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const register = asyncHandler(async (req: Request, res: Response) => {
    const { email, password, name } = req.validateData;
    const isExist = await UserModel.findOne({ email });
    if (isExist) throw new ApiError(409, "User already exists.");

    const newUser = await UserModel.create({
        name,
        email,
        password
    });

    const { unHashedToken, hasedToken, tokenExpiry } = newUser.generateTempToken();
    newUser.verificationToken = hasedToken;
    newUser.verificationTokenExpire = tokenExpiry;
    await newUser.save();

    const data = await UserModel.findById(newUser._id).select(
        "-password -verificationToken -resetPasswordToken -refreshToken"
    );

    if (!data) throw new ApiError(401, "Something went wrong while Register a User.");
    return res.status(201).json(
        new ApiResponse(201, data, "User added successfully.")
    );
});