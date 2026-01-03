import bcrypt from "bcryptjs";
import { Request } from "express";
import prisma from "../../../utils/prisma";
import { UserRole } from "@prisma/client";

const createUser = async (req: Request) => {
  const hashPassword = await bcrypt.hash(
    req.body.password,
    Number(process.env.BCRYPT_SALT)
  );
  const { password, locationData, userData } = req.body;

  return prisma.$transaction(async (tnx) => {
    await tnx.user.create({
      data: {
        email: userData.email,
        password: hashPassword,
      },
    });

    const userProfile = await tnx.userProfile.create({
      data: userData,
    });
    await tnx.location.create({
      data: { userProfileId: userProfile.id, ...locationData },
    });
    return userProfile;
  });
};

const createHost = async (req: Request) => {
  const { password, hostData } = req.body;

  const hashPassword = await bcrypt.hash(
    password,
    Number(process.env.BCRYPT_SALT)
  );

  return prisma.$transaction(async (tnx) => {
    await tnx.user.create({
      data: {
        email: hostData.email,
        password: hashPassword,
        role: UserRole.HOST,
      },
    });

    return await tnx.host.create({
      data: hostData,
    });
  });
};

const getAllUser = async () => {
  const users = await prisma.user.findMany({
    include: {
      userProfile: {
        include: {
          location: {
            select: {
              city: true,
              area: true,
              country: true,
            },
          },
        },
      },
    },
  });
  return users;
};

export const UserService = {
  createUser,
  createHost,
  getAllUser,
};
