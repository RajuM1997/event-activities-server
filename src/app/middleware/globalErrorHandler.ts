import { Prisma } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import ApiError from "../errors/ApiError";

const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let statusCode: number = err.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
  let success = false;
  let message = err.message || "Something went wrong!";
  let error = err;

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      const fields = (err.meta?.target as string[]) || [];
      const fieldName = fields.join(", ");
      console.log(err?.meta);

      message = fieldName
        ? `${fieldName} already exists`
        : "Duplicate value already exists";

      statusCode = httpStatus.CONFLICT;
      error = {
        code: err.code,
        fields,
      };
      if (err?.meta?.modelName === "Review") {
        message = "You have already submitted a review for this event.";
      }
    }
    if (err.code === "P1001") {
      message = "Authentication failed against database server";
      error = err.meta;
      statusCode = httpStatus.BAD_GATEWAY;
    }
    if (err.code === "P2003") {
      message = "Foreign key constraint failed";
      error = err.meta;
      statusCode = httpStatus.BAD_REQUEST;
    }
    if (err.code === "P2025") {
      message = "Data not found";
      statusCode = httpStatus.NOT_FOUND;
      error = err.meta;
    }
  } else if (err instanceof Prisma.PrismaClientValidationError) {
    message = "Validation err";
    error = err.message;
    statusCode = httpStatus.BAD_REQUEST;
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    message = "Unknown Prisma error occured!";
    statusCode = httpStatus.BAD_REQUEST;
    error = err.message;
  } else if (err instanceof Prisma.PrismaClientInitializationError) {
    message = "Prisma client failed to initialize!";
    error = err.message;
    statusCode = httpStatus.BAD_REQUEST;
  } else if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    error = err.message;
  } else if (err instanceof Error) {
    statusCode = 500;
    message = err.message;
  }

  res.status(statusCode).json({
    success,
    message,
    error,
  });
};

export default globalErrorHandler;
