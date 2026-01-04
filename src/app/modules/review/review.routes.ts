import { Router } from "express";
import { ReviewController } from "./review.controller";
import checkAuth from "../../middleware/checkAuth";
import { UserRole } from "@prisma/client";
import validateRequest from "../../middleware/validateRequest";
import { ReviewValidation } from "./review.validation";

const router = Router();

router.post(
  "/",
  checkAuth(UserRole.USER),
  validateRequest(ReviewValidation.createReviewValidationSchema),
  ReviewController.createReview
);

export const reviewRoutes = router;
