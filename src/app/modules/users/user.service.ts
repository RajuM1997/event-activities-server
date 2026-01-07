import bcrypt from "bcryptjs";
import { Request } from "express";
import prisma from "../../../utils/prisma";
import { UserRole } from "@prisma/client";
import { fileUploader } from "../../../helpers/fileUpload";
import { IJWTPayload } from "../../../types/common";

const createUser = async (req: Request) => {
  console.log(req.body);

  const file = req.file;
  const { locationData, userData } = req.body;

  if (file) {
    const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
    userData.profilePhoto = uploadToCloudinary?.secure_url;
  }

  const hashPassword = await bcrypt.hash(
    req.body.password,
    Number(process.env.BCRYPT_SALT)
  );

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
  const file = req.file;
  const { password, hostData } = req.body;

  if (file) {
    const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
    hostData.profilePhoto = uploadToCloudinary?.secure_url;
  }

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

const getMe = async (user: IJWTPayload) => {
  if (user.role === UserRole.HOST) {
    return await prisma.host.findUniqueOrThrow({
      where: {
        email: user.email,
      },
    });
  }
  return await prisma.userProfile.findUniqueOrThrow({
    where: {
      email: user.email,
    },
    include: {
      booking: {
        select: {
          id: true,
          amount: true,
          bookingStatus: true,
          status: true,
          transactionId: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    },
  });
};

const softDeleteUser = async (user: IJWTPayload) => {
  if (user.role === UserRole.USER) {
    return prisma.userProfile.update({
      where: {
        email: user.email,
      },
      data: {
        isDeleted: true,
      },
    });
  } else {
    return prisma.host.update({
      where: {
        email: user.email,
      },
      data: {
        isDeleted: true,
      },
    });
  }
};

const updateProfile = async (user: IJWTPayload, payload: any) => {
  if (user.role === UserRole.USER) {
    return await prisma.userProfile.update({
      where: {
        email: user.email,
      },
      data: payload,
    });
  } else {
    return await prisma.host.update({
      where: {
        email: user.email,
      },
      data: payload,
    });
  }
};

export const UserService = {
  createUser,
  createHost,
  getAllUser,
  getMe,
  updateProfile,
  softDeleteUser,
};
