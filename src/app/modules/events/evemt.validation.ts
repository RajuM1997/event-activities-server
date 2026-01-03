import z from "zod";

const createEventValidationSchema = z.object({
  eventData: z.object({
    eventName: z.string().nonempty("Name is required"),
  }),
});
export const EventValidation = {
  createEventValidationSchema,
};
