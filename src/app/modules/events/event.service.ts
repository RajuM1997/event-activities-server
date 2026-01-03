import { Request } from "express";
import { fileUploader } from "../../../helpers/fileUpload";
import prisma from "../../../utils/prisma";
import { IJWTPayload } from "../../../types/common";

const createEvent = async (req: Request, user: IJWTPayload) => {
  const file = req.file;
  const eventData = req.body.eventData;

  if (file) {
    const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
    eventData.image = uploadToCloudinary?.secure_url;
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

export const EventService = {
  createEvent,
};
