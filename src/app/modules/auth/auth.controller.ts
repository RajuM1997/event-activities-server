import httpStatus from "http-status";
import { NextFunction, Request, Response } from "express";
import { AuthService } from "./auth.service";
import sendResponse from "../../../utils/sendResponse";
import { catchAsync } from "../../../utils/catchAsync";
import { setAuthCookies } from "../../../utils/setCookies";

const loginWithCredential = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await AuthService.loginWithCredential(req.body);
    setAuthCookies(res, {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Login successful",
      data: result,
    });
  }
);

const logout = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24 * 90,
    });
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Logout Successful",
      data: null,
    });
  }
);
export const AuthController = {
  loginWithCredential,
  logout,
};
