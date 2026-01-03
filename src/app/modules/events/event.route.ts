import { NextFunction, Request, Response, Router } from "express";
import { EventController } from "./event.controller";
import { EventValidation } from "./event.validation";
import { fileUploader } from "../../../helpers/fileUpload";
import checkAuth from "../../middleware/checkAuth";
import { UserRole } from "@prisma/client";

const router = Router();

router.post(
  "/",
  checkAuth(UserRole.HOST),
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = EventValidation.createEventValidationSchema.parse(
      JSON.parse(req.body.data)
    );
    return EventController.createEvent(req, res, next);
  }
);

export const eventRoutes = router;
