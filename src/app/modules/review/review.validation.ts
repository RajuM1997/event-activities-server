import z from "zod";

const createReviewValidationSchema = z.object({
  eventId: z.string().nonempty("event id is required"),
  rating: z.float32(),
  comment: z.string().nonempty("Comment is required"),
});

export const ReviewValidation = {
  createReviewValidationSchema,
};
