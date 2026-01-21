import httpStatus from "http-status";
import { NextFunction, Request, Response } from "express";
import config from "../../config";
import ApiError from "../errors/ApiError";
import { jwtHelper } from "../../utils/jwt";
import prisma from "../../utils/prisma";
import { UserRole } from "@prisma/client";

const checkAuth = (...roles: string[]) => {
  return async (
    req: Request & { user?: any },
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const token = req.headers.authorization || req.cookies.accessToken;

      if (!token) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "You are not authorized");
      }
      const verifyUser = jwtHelper.verifyToken(
        token,
        config.jwt.access_secret as string,
      );

      let isDelete;
      if (verifyUser.role === UserRole.USER) {
        const userInfo = await prisma.userProfile.findUniqueOrThrow({
          where: {
            email: verifyUser.email,
          },
        });
        isDelete = userInfo.isDeleted;
      } else {
        const userInfo = await prisma.host.findUniqueOrThrow({
          where: {
            email: verifyUser.email,
          },
        });

        isDelete = userInfo.isDeleted;
      }

      if (isDelete) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          "Your profile already deleted you can not access this route",
        );
      }

      req.user = verifyUser;
      if (roles.length && !roles.includes(verifyUser.role)) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "You are not authorized");
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default checkAuth;
