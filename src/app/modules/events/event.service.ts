import httpStatus from "http-status";
import { Request } from "express";
import { fileUploader } from "../../../helpers/fileUpload";
import prisma from "../../../utils/prisma";
import { IJWTPayload } from "../../../types/common";
import { BookingStatus, EventStatus, Prisma, UserRole } from "@prisma/client";
import ApiError from "../../errors/ApiError";
import { IOptions, paginationHelper } from "../../../helpers/pagination";
import { eventFilterableFields, eventSearchableFields } from "./event.constant";
import { v4 as uuidv4 } from "uuid";
import { stripe } from "../../../helpers/stripe";
import config from "../../../config";

const createEvent = async (req: Request, user: IJWTPayload) => {
  const file = req.file;
  const eventData = req.body.eventData;

  if (file) {
    const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
    eventData.image = uploadToCloudinary?.secure_url;
    eventData.publicId = uploadToCloudinary?.public_id;
    eventData.filename = file.filename;
  }
  if (eventData.date) {
    eventData.date = new Date(eventData.date);
  }

  const host = await prisma.host.findUniqueOrThrow({
    where: { email: user.email },
  });

  if (host) {
    eventData.hostId = host.id;
  }

  const event = await prisma.event.create({
    data: eventData,
  });

  return event;
};

const updateEvent = async (req: Request, user: IJWTPayload) => {
  const file = req.file;
  const eventData = req.body.eventData;
  const eventId = req.params.id;

  const previousEvent = await prisma.event.findUnique({
    where: {
      id: eventId,
    },
  });

  if (file) {
    const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
    eventData.image = uploadToCloudinary?.secure_url;
    eventData.publicId = uploadToCloudinary?.public_id;
    eventData.filename = file.filename;
    if (previousEvent?.publicId) {
      fileUploader.deleteImageEverywhere(
        previousEvent.publicId,
        previousEvent.filename,
      );
    }
  }
  const hostInfo = await prisma.host.findUnique({
    where: {
      email: user.email,
    },
  });
  const singleEvent = await prisma.event.findUnique({
    where: { id: eventId },
  });

  if (hostInfo?.id !== singleEvent?.hostId && user.role !== UserRole.ADMIN) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "You are able to update this event",
    );
  }

  const event = await prisma.event.update({
    where: {
      id: eventId,
    },
    data: eventData,
  });

  return event;
};

const deleteEvent = async (id: string, user: IJWTPayload) => {
  const hostInfo = await prisma.host.findUnique({
    where: {
      email: user.email,
    },
  });

  const singleEvent = await prisma.event.findUnique({
    where: { id },
  });

  if (hostInfo?.id !== singleEvent?.hostId && user.role !== UserRole.ADMIN) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "You are able to delete this event",
    );
  }
  await prisma.event.delete({ where: { id } });
};

const getAllEvent = async (options: IOptions, filters: any) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);
  const { location, date, ...filterData } = filters;

  const andConditions: Prisma.EventWhereInput[] = [];

  if (location) {
    andConditions.push({
      OR: eventSearchableFields.map((field) => ({
        [field]: {
          contains: location.trim(),
          mode: "insensitive",
        },
      })),
    });
  }
  if (date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    andConditions.push({
      date: {
        gte: startOfDay,
        lte: endOfDay,
      },
    });
  }

  if (Object.keys(filterData).length > 0) {
    const filterCondition = Object.keys(filterData).map((key) => ({
      [key]: {
        equals: (filterData as any)[key],
      },
    }));
    andConditions.push(...filterCondition);
  }
  const whereCondition: Prisma.EventWhereInput =
    andConditions.length > 0
      ? {
          AND: andConditions,
        }
      : {};
  const result = await prisma.event.findMany({
    where: whereCondition,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const total = await prisma.event.count({ where: whereCondition });
  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getHostEvents = async (
  options: IOptions,
  filters: any,
  user: IJWTPayload,
) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  const andConditions: Prisma.EventWhereInput[] = [];
  const host = await prisma.host.findFirstOrThrow({
    where: {
      email: user.email,
    },
  });

  if (searchTerm) {
    andConditions.push({
      OR: eventFilterableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    const filterCondition = Object.keys(filterData).map((key) => ({
      [key]: {
        equals: (filterData as any)[key],
      },
    }));
    andConditions.push(...filterCondition);
  }
  const whereCondition: Prisma.EventWhereInput =
    andConditions.length > 0
      ? {
          AND: andConditions,
        }
      : {};
  const result = await prisma.event.findMany({
    where: { ...whereCondition, hostId: host.id },
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const total = await prisma.event.count({
    where: { ...whereCondition, hostId: host.id },
  });
  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getEventById = async (id: string) => {
  const event = await prisma.event.findUniqueOrThrow({
    where: {
      id,
    },
    include: {
      host: true,
      review: true,
      booking: true,
    },
  });
  return event;
};

const joinEvent = async (id: string, user: IJWTPayload) => {
  const event = await prisma.event.findUniqueOrThrow({
    where: {
      id,
    },
  });
  const userInfo = await prisma.userProfile.findUniqueOrThrow({
    where: { email: user.email },
  });
  if (event.joinCount >= event.maxParticipants) {
    await prisma.event.update({
      where: {
        id,
      },
      data: {
        status: EventStatus.FULL,
      },
    });
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Event participants full you can not join this event",
    );
  }
  const transactionId = uuidv4();
  return await prisma.$transaction(async (tnx) => {
    await tnx.event.update({
      where: {
        id,
      },
      data: {
        joinCount: {
          increment: 1,
        },
      },
    });
    const bookingData = await tnx.booking.create({
      data: {
        eventId: event.id,
        amount: event.joiningFee,
        userId: userInfo.id,
        transactionId,
      },
    });
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "bdt",
            product_data: {
              name: `Event joining with ${event.eventName}`,
            },
            unit_amount: event.joiningFee * 100,
          },
          quantity: 1,
        },
      ],
      metadata: {
        eventId: event.id,
        bookingId: bookingData.id,
      },
      mode: "payment",
      success_url: `${config.client_url}/events/my-events?success=true`,
      cancel_url: `${config.client_url}?cancel=false`,
    });

    return { paymentUrl: session.url };
  });
};

const cancelJoinEvent = async (
  id: string,
  bookingId: string,
  user: IJWTPayload,
) => {
  const userInfo = await prisma.userProfile.findUniqueOrThrow({
    where: {
      email: user.email,
    },
  });

  await prisma.booking.findUniqueOrThrow({
    where: {
      userId: userInfo.id,
      eventId: id,
    },
  });
  const event = await prisma.event.findFirstOrThrow({
    where: {
      id,
    },
  });

  const currentDate = new Date();

  if (!(new Date(event.date) < currentDate)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "You can not cancel this event");
  }

  return await prisma.$transaction(async (tnx) => {
    await tnx.event.update({
      where: {
        id,
      },
      data: {
        joinCount: {
          decrement: 1,
        },
      },
    });
    return tnx.booking.update({
      where: {
        id: bookingId,
      },
      data: {
        bookingStatus: BookingStatus.CANCELLED,
      },
    });
  });
};

const softEventDelete = async (id: string, user: IJWTPayload) => {
  const hostInfo = await prisma.host.findUniqueOrThrow({
    where: {
      email: user.email,
    },
  });

  const updatedEvent = await prisma.event.findUniqueOrThrow({
    where: {
      id,
    },
  });
  if (hostInfo.id !== updatedEvent.hostId && user.role !== UserRole.ADMIN) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "You are not able to delete this event",
    );
  }
  await prisma.event.update({
    where: {
      id,
    },
    data: {
      isDeleted: true,
    },
  });
};

const getMyJoiningEvents = async (user: IJWTPayload) => {
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
          eventId: true,
          event: {
            select: {
              eventName: true,
              category: true,
              date: true,
            },
          },
        },
      },
    },
  });
};

export const EventService = {
  createEvent,
  updateEvent,
  deleteEvent,
  getAllEvent,
  getEventById,
  joinEvent,
  cancelJoinEvent,
  softEventDelete,
  getHostEvents,
  getMyJoiningEvents,
};
