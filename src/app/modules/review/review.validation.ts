import z from "zod";

const createReviewValidationSchema = z.object({
  body: z.object({
    eventId: z.string(),
    rating: z.number(),
    comment: z.string().min(10),
  }),
});

export const ReviewValidation = {
  createReviewValidationSchema,
};
