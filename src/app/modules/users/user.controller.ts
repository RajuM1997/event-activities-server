import { NextFunction, Request, Response } from "express";
import { UserService } from "./user.service";
import sendResponse from "../../../utils/sendResponse";
import { catchAsync } from "../../../utils/catchAsync";
import { IJWTPayload } from "../../../types/common";

const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await UserService.createUser(req);

    sendResponse(res, {
      success: true,
      statusCode: 201,
      message: "User created successfully",
      data: result,
    });
  }
);

const createHost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await UserService.createHost(req);

    sendResponse(res, {
      success: true,
      statusCode: 201,
      message: "Host created successfully",
      data: result,
    });
  }
);

const getAllUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await UserService.getAllUser();

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "User fetched successfully",
      data: result,
    });
  }
);

const getMe = catchAsync(
  async (
    req: Request & { user?: IJWTPayload },
    res: Response,
    next: NextFunction
  ) => {
    const user = req.user;
    const result = await UserService.getMe(user as IJWTPayload);

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "User fetched successfully",
      data: result,
    });
  }
);

export const UserController = {
  createUser,
  createHost,
  getAllUser,
  getMe,
};
