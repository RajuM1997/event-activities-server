import httpStatus from "http-status";
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../../utils/catchAsync";
import { EventService } from "./event.service";
import sendResponse from "../../../utils/sendResponse";

const createEvent = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body);

    // const result = await EventService.createEvent(req.body);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Event created successfully",
      data: "result",
    });
  }
);

export const EventController = {
  createEvent,
};
