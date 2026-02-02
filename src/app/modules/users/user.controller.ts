import { NextFunction, Request, Response } from "express";
import { UserService } from "./user.service";
import sendResponse from "../../../utils/sendResponse";
import { catchAsync } from "../../../utils/catchAsync";
import { IJWTPayload } from "../../../types/common";
import { UserRole } from "@prisma/client";
import pick from "../../../helpers/pick";
import { sortAndPaginationFields } from "../../../utils/common.constant";
import { userFilterableFields } from "./user.constant";

const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await UserService.createUser(req);

    sendResponse(res, {
      success: true,
      statusCode: 201,
      message: "User created successfully",
      data: result,
    });
  },
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
  },
);

const getAllUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.query.role as UserRole;
    const option = pick(req.query, sortAndPaginationFields);
    const filters = pick(req.query, userFilterableFields);
    const result = await UserService.getAllUser(userRole, option, filters);

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "User fetched successfully",
      meta: result.meta,
      data: result.data,
    });
  },
);

const getMe = catchAsync(
  async (
    req: Request & { user?: IJWTPayload },
    res: Response,
    next: NextFunction,
  ) => {
    const user = req.user;
    const result = await UserService.getMe(user as IJWTPayload);

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "User fetched successfully",
      data: result,
    });
  },
);

const updateUserProfile = catchAsync(
  async (
    req: Request & { user?: IJWTPayload },
    res: Response,
    next: NextFunction,
  ) => {
    const user = req.user;
    const result = await UserService.updateUserProfile(
      user as IJWTPayload,
      req,
    );

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "User profile updated successfully",
      data: result,
    });
  },
);

const updateHostProfile = catchAsync(
  async (
    req: Request & { user?: IJWTPayload },
    res: Response,
    next: NextFunction,
  ) => {
    const user = req.user;
    const result = await UserService.updateHostProfile(
      user as IJWTPayload,
      req,
    );

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Host profile updated successfully",
      data: result,
    });
  },
);

const updateUserStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { status } = req.body;
    const result = await UserService.updateUserStatus(id, status);

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "User status updated successfully",
      data: result,
    });
  },
);

const updateHostStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { status } = req.body;

    const result = await UserService.updateHostStatus(id, status);

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Host status updated successfully",
      data: result,
    });
  },
);

const softDeleteUser = catchAsync(
  async (
    req: Request & { user?: IJWTPayload },
    res: Response,
    next: NextFunction,
  ) => {
    const user = req.user;
    const result = await UserService.softDeleteUser(user as IJWTPayload);

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "User profile deleted successfully",
      data: result,
    });
  },
);

export const UserController = {
  createUser,
  createHost,
  getAllUser,
  getMe,
  updateUserProfile,
  softDeleteUser,
  updateHostStatus,
  updateUserStatus,
  updateHostProfile,
};
