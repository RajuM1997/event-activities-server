import { NextFunction, Request, Response, Router } from "express";
import { EventController } from "./event.controller";
import { EventValidation } from "./evemt.validation";

const router = Router();

router.post("/", (req: Request, res: Response, next: NextFunction) => {
  req.body = EventValidation.createEventValidationSchema.parse(
    JSON.parse(req.body.data)
  );
  return EventController.createEvent(req, res, next);
});

export const eventRoutes = router;
