import config from "../../../config";
import { catchAsync } from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { stripe } from "../../../helpers/stripe";
import { BookingService } from "./booking.service";
import { NextFunction, Request, Response } from "express";

const handleStripeWebhookEvent = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const sig = req.headers["stripe-signature"] as string;
    const webhookSecret = config.stripe.stripe_web_hook_secret;

    let event;
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        webhookSecret as string,
      );
    } catch (error) {
      return res.status(400).send(`Webhook Error: ${error}`);
    }
    const result = await BookingService.handleStripeWebhookEvent(event);

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Payment send successfully",
      data: result,
    });
  },
);

export const BookingController = {
  handleStripeWebhookEvent,
};
