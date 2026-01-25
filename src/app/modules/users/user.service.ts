import bcrypt from "bcryptjs";
import { Request } from "express";
import prisma from "../../../utils/prisma";
import { HostStatus, UserRole, UserStatus } from "@prisma/client";
import { fileUploader } from "../../../helpers/fileUpload";
import { IJWTPayload } from "../../../types/common";

const createUser = async (req: Request) => {
  const file = req.file;
  const { locationData, userData } = req.body;

  if (file) {
    const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
    userData.profilePhoto = uploadToCloudinary?.secure_url;
    userData.publicId = uploadToCloudinary?.public_id;
    userData.filename = file.filename;
  }

  const hashPassword = await bcrypt.hash(
    req.body.password,
    Number(process.env.BCRYPT_SALT),
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
    hostData.publicId = uploadToCloudinary?.public_id;
    hostData.filename = file.filename;
  }

  const hashPassword = await bcrypt.hash(
    password,
    Number(process.env.BCRYPT_SALT),
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

const getAllUser = async (role: UserRole) => {
  const users = await prisma.user.findMany({
    where: { role },
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
      host: {
        select: {
          id: true,
          name: true,
          email: true,
          profilePhoto: true,
          phoneNumber: true,
          address: true,
          status: true,
        },
      },
    },
  });

  return users;
};

const getMe = async (user: IJWTPayload) => {
  if (user.role === UserRole.HOST) {
    return await prisma.user.findUniqueOrThrow({
      where: {
        email: user.email,
      },
      select: {
        role: true,
        email: true,
        host: {
          select: {
            id: true,
            email: true,
            name: true,
            address: true,
            averageRating: true,
            status: true,
            phoneNumber: true,
            profilePhoto: true,
            bio: true,
          },
        },
      },
    });
  }
  return await prisma.userProfile.findUniqueOrThrow({
    where: {
      email: user.email,
    },
    include: {
      location: {
        select: {
          city: true,
          country: true,
          area: true,
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

const updateProfile = async (user: IJWTPayload, req: Request) => {
  const file = req.file;
  const { _email, _password, role, userData } = req.body;

  if (file) {
    const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
    userData.profilePhoto = uploadToCloudinary?.secure_url;
    userData.publicId = uploadToCloudinary?.public_id;
    userData.filename = file.filename;

    if (user.role === "HOST") {
      const host = await prisma.host.findUnique({
        where: {
          email: user.email,
        },
      });
      if (host?.publicId && host.filename) {
        fileUploader.deleteImageEverywhere(host.publicId, host.filename);
      }
    }
    if (user.role === "USER") {
      const userProfile = await prisma.userProfile.findUnique({
        where: {
          email: user.email,
        },
      });
      if (userProfile?.publicId && userProfile.filename) {
        fileUploader.deleteImageEverywhere(
          userProfile.publicId,
          userProfile.filename,
        );
      }
    }
  }

  if (user.role === UserRole.USER) {
    return await prisma.userProfile.update({
      where: {
        email: user.email,
      },
      data: userData,
    });
  } else {
    return await prisma.host.update({
      where: {
        email: user.email,
      },
      data: userData,
    });
  }
};

const updateUserStatus = async (id: string, status: UserStatus) => {
  const user = await prisma.user.update({
    where: {
      id,
    },
    data: {
      status,
    },
  });
  return user;
};

const updateHostStatus = async (id: string, status: HostStatus) => {
  const host = await prisma.host.update({
    where: {
      id,
    },
    data: {
      status,
    },
  });
  return host;
};

export const UserService = {
  createUser,
  createHost,
  getAllUser,
  getMe,
  updateProfile,
  softDeleteUser,
  updateUserStatus,
  updateHostStatus,
};
