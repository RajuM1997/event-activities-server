import { EventCategory, EventStatus } from "@prisma/client";
import z from "zod";

const createEventValidationSchema = z.object({
  eventData: z.object({
    eventName: z.string().nonempty("Name is required"),
    date: z.string(),
    category: z.enum([...Object.values(EventCategory)]),
    status: z.enum([...Object.values(EventStatus)]).optional(),
    location: z.string().nonempty("Location is required"),
    description: z.string().nonempty("description is required"),
    minParticipants: z.number(),
    maxParticipants: z.number(),
    joiningFee: z.number(),
  }),
});

const updateEventValidationSchema = z.object({
  eventData: z.object({
    eventName: z.string().optional(),
    date: z.string().optional(),
    category: z.enum([...Object.values(EventCategory)]).optional(),
    status: z.enum([...Object.values(EventStatus)]).optional(),
    location: z.string().optional(),
    description: z.string().optional(),
    minParticipants: z.number().optional(),
    maxParticipants: z.number().optional(),
    joiningFee: z.number().optional(),
  }),
});

export const EventValidation = {
  createEventValidationSchema,
  updateEventValidationSchema,
};
