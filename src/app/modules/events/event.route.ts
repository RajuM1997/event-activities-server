import { NextFunction, Request, Response, Router } from "express";
import { EventController } from "./event.controller";
import { EventValidation } from "./event.validation";
import { fileUploader } from "../../../helpers/fileUpload";
import checkAuth from "../../middleware/checkAuth";
import { UserRole } from "@prisma/client";

const router = Router();

router.get("/", EventController.getAllEvent);
router.get("/:id", EventController.getEventById);

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

router.patch(
  "/:id",
  checkAuth(UserRole.HOST, UserRole.ADMIN),
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = EventValidation.updateEventValidationSchema.parse(
      JSON.parse(req.body.data)
    );
    return EventController.updateEvent(req, res, next);
  }
);
router.patch(
  "/join-event/:id",
  checkAuth(UserRole.USER),
  EventController.joinEvent
);

router.delete(
  "/:id",
  checkAuth(UserRole.HOST, UserRole.ADMIN),
  EventController.deleteEvent
);

export const eventRoutes = router;
