import type { CookieOptions, Request, Response } from "express";
import { UserModel } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import type { Types } from "mongoose";

const generateAccessAndRefreshToken = async (userId: string | Types.ObjectId) => {
    try {
        const user = await UserModel.findById(userId);
        if (!user) throw new ApiError(404, "User not found");
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });
        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(
            500,
            "Something went wrong while generating access token."
        );
    }
};

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

export const login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password)
        throw new ApiError(401, "Email and Password required.");

    const user = await UserModel.findOne({ email });
    if (!user) throw new ApiError(404, "User not found!");

    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) throw new ApiError(401, "Invalid Password!");

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
        user._id
    );

    const loggedUser = await UserModel.findById(user._id).select(
        "-password -verificationToken -resetPasswordToken -refreshToken"
    );

    const accessCookieOptions: CookieOptions = {
        httpOnly: true,
        secure: false,
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: "none"
    };

    const refreshCookieOptions: CookieOptions = {
        httpOnly: true,
        secure: false,
        maxAge: 10 * 24 * 60 * 60 * 1000,
        sameSite: "none"
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, accessCookieOptions)
        .cookie("refreshToken", refreshToken, refreshCookieOptions)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedUser,
                    accessToken,
                    refreshToken,
                },
                "User logged in successfully."
            )
        );
});

