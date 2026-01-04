import httpStatus from "http-status";
import { Review } from "@prisma/client";
import ApiError from "../../errors/ApiError";
import { IJWTPayload } from "../../../types/common";
import prisma from "../../../utils/prisma";

const createReview = async (user: IJWTPayload, payload: Partial<Review>) => {
  const userData = await prisma.userProfile.findUniqueOrThrow({
    where: {
      email: user.email,
    },
  });

  const bookingData = await prisma.booking.findUniqueOrThrow({
    where: {
      userId: userData.id,
      eventId: payload.eventId,
    },
  });

  const eventData = await prisma.event.findUniqueOrThrow({
    where: {
      id: payload.eventId,
    },
  });

  if (userData.id !== bookingData.userId) {
    throw new ApiError(httpStatus.BAD_REQUEST, "This is not your appointment");
  }

  return await prisma.$transaction(async (tnx) => {
    const result = await tnx.review.create({
      data: {
        eventId: eventData.id,
        hostId: eventData.hostId,
        userId: bookingData.userId,
        rating: Number(payload.rating),
        comment: payload.comment as string,
      },
    });
    const avgRating = await tnx.review.aggregate({
      _avg: {
        rating: true,
      },
      where: {
        hostId: eventData.hostId,
      },
    });
    await tnx.host.update({
      where: { id: eventData.hostId },
      data: {
        averageRating: avgRating._avg.rating as number,
      },
    });
    return result;
  });
};

export const ReviewService = {
  createReview,
};
