import bcrypt from "bcryptjs";
import { Request } from "express";
import prisma from "../../../utils/prisma";
import { UserRole } from "@prisma/client";

const createUser = async (req: Request) => {
  const hashPassword = await bcrypt.hash(
    req.body.password,
    Number(process.env.BCRYPT_SALT)
  );
  const userInfo = req.body;

  const user = await prisma.user.create({
    data: { ...userInfo, password: hashPassword },
  });
  return user;
};

const createAdmin = async (req: Request) => {
  const hashPassword = await bcrypt.hash(
    req.body.password,
    Number(process.env.BCRYPT_SALT)
  );
  const userInfo = req.body;
  return prisma.$transaction(async (tnx) => {
    await tnx.user.create({
      data: {
        email: userInfo.email,
        password: hashPassword,
        role: UserRole.ADMIN,
      },
    });
    const { password, ...rest } = userInfo;
    return await tnx.admin.create({
      data: rest,
    });
  });
};

const createHost = async (req: Request) => {
  const hashPassword = await bcrypt.hash(
    req.body.password,
    Number(process.env.BCRYPT_SALT)
  );
  const userInfo = req.body;
  return prisma.$transaction(async (tnx) => {
    await tnx.user.create({
      data: {
        email: userInfo.email,
        password: hashPassword,
        role: UserRole.HOST,
      },
    });
    const { password, ...rest } = userInfo;
    return await tnx.host.create({
      data: rest,
    });
  });
};

const getAllUser = async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      role: true,
      needPasswordChange: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      admin: true,
      host: true,
    },
  });
  return users;
};

export const UserService = {
  createUser,
  createAdmin,
  createHost,
  getAllUser,
};
