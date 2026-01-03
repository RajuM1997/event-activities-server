import httpStatus from "http-status";
import bcrypt from "bcryptjs";
import prisma from "../../../utils/prisma";
import ApiError from "../../errors/ApiError";
import config from "../../../config";
import { jwtHelper } from "../../../utils/jwt";
import { Secret } from "jsonwebtoken";

const loginWithCredential = async (payload: {
  email: string;
  password: string;
}) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
    },
  });
  const isPasswordMatch = await bcrypt.compare(payload.password, user.password);

  if (!isPasswordMatch) {
    throw new ApiError(httpStatus.FORBIDDEN, "Incorrect Password");
  }

  const accessToken = jwtHelper.generateToken(
    { email: user.email, role: user.role, id: user.id },
    config.jwt.access_secret as Secret,
    config.jwt.access_expire as string
  );

  const refreshToken = jwtHelper.generateToken(
    { email: user.email, role: user.role, id: user.id },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expire as string
  );
  return {
    accessToken,
    refreshToken,
  };
};

export const AuthService = {
  loginWithCredential,
};
