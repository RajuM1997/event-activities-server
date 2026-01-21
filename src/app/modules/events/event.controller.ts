import httpStatus from "http-status";
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../../utils/catchAsync";
import { EventService } from "./event.service";
import sendResponse from "../../../utils/sendResponse";
import { IJWTPayload } from "../../../types/common";
import pick from "../../../helpers/pick";
import { eventFilterableFields } from "./event.constant";
import { sortAndPaginationFields } from "../../../utils/common.constant";

const createEvent = catchAsync(
  async (
    req: Request & { user?: IJWTPayload },
    res: Response,
    next: NextFunction,
  ) => {
    const user = req.user;
    const result = await EventService.createEvent(req, user as IJWTPayload);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Event created successfully",
      data: result,
    });
  },
);

const updateEvent = catchAsync(
  async (
    req: Request & { user?: IJWTPayload },
    res: Response,
    next: NextFunction,
  ) => {
    const user = req.user;
    const result = await EventService.updateEvent(req, user as IJWTPayload);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Event updating successfully",
      data: result,
    });
  },
);

const deleteEvent = catchAsync(
  async (
    req: Request & { user?: IJWTPayload },
    res: Response,
    next: NextFunction,
  ) => {
    const user = req.user;
    await EventService.deleteEvent(req.params.id, user as IJWTPayload);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Event delete successfully",
      data: null,
    });
  },
);

const getAllEvent = catchAsync(
  async (
    req: Request & { user?: IJWTPayload },
    res: Response,
    next: NextFunction,
  ) => {
    const isDeleted = req.query.isDelete === "true";
    const option = pick(req.query, sortAndPaginationFields);
    const filters = pick(req.query, eventFilterableFields);

    const result = await EventService.getAllEvent(option, {
      ...filters,
      isDeleted,
    });
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Event get successfully",
      meta: result.meta,
      data: result.data,
    });
  },
);

const getMyEvents = catchAsync(
  async (
    req: Request & { user?: IJWTPayload },
    res: Response,
    next: NextFunction,
  ) => {
    const user = req.user as IJWTPayload;

    const isDeleted = req.query.isDelete === "true";
    const option = pick(req.query, sortAndPaginationFields);
    const filters = pick(req.query, eventFilterableFields);

    const result = await EventService.getHostEvents(
      option,
      {
        ...filters,
        isDeleted,
      },
      user,
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Event get successfully",
      meta: result.meta,
      data: result.data,
    });
  },
);

const getEventById = catchAsync(
  async (
    req: Request & { user?: IJWTPayload },
    res: Response,
    next: NextFunction,
  ) => {
    const result = await EventService.getEventById(req.params.id);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Event get successfully",
      data: result,
    });
  },
);

const joinEvent = catchAsync(
  async (
    req: Request & { user?: IJWTPayload },
    res: Response,
    next: NextFunction,
  ) => {
    const user = req.user;
    const result = await EventService.joinEvent(
      req.params.id,
      user as IJWTPayload,
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Event get successfully",
      data: result,
    });
  },
);

const cancelJoinEvent = catchAsync(
  async (
    req: Request & { user?: IJWTPayload },
    res: Response,
    next: NextFunction,
  ) => {
    const user = req.user;
    const bookingId = req.query.bookingId;
    const result = await EventService.cancelJoinEvent(
      req.params.id,
      bookingId as string,
      user as IJWTPayload,
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Event booking cancel successfully",
      data: result,
    });
  },
);

const softEventDelete = catchAsync(
  async (
    req: Request & { user?: IJWTPayload },
    res: Response,
    next: NextFunction,
  ) => {
    const user = req.user;

    await EventService.softEventDelete(req.params.id, user as IJWTPayload);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Event delete successfully",
      data: null,
    });
  },
);

export const EventController = {
  createEvent,
  updateEvent,
  getAllEvent,
  deleteEvent,
  getEventById,
  joinEvent,
  softEventDelete,
  cancelJoinEvent,
  getMyEvents,
};
