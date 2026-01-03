import httpStatus from "http-status";
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../../utils/catchAsync";
import { EventService } from "./event.service";
import sendResponse from "../../../utils/sendResponse";
import { IJWTPayload } from "../../../types/common";

const createEvent = catchAsync(
  async (
    req: Request & { user?: IJWTPayload },
    res: Response,
    next: NextFunction
  ) => {
    const user = req.user;
    const result = await EventService.createEvent(req, user as IJWTPayload);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Event created successfully",
      data: result,
    });
  }
);

export const EventController = {
  createEvent,
};
