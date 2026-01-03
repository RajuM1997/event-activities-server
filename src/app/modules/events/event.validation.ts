import { EventCategory, EventStatus } from "@prisma/client";
import z from "zod";

const createEventValidationSchema = z.object({
  eventData: z.object({
    eventName: z.string().nonempty("Name is required"),
    date: z.string(),
    category: z.enum([...Object.values(EventCategory)]),
    status: z.enum([...Object.values(EventStatus)]),
    location: z.string().nonempty("Location is required"),
    description: z.string().nonempty("description is required"),
    minParticipants: z.number(),
    maxParticipants: z.number(),
    joiningFee: z.number(),
  }),
});
export const EventValidation = {
  createEventValidationSchema,
};
