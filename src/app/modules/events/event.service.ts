import { Event } from "@prisma/client";

const createEvent = async (payload: Partial<Event>) => {
  console.log(payload);
};

export const EventService = {
  createEvent,
};
