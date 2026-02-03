import { Request, Response } from "express";
import config from "../../../config";
import { stripe } from "../../../helpers/stripe";
import { BookingService } from "./booking.service";

const handleStripeWebhookEvent = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"] as string;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body, // RAW BUFFER
      sig,
      config.stripe.stripe_web_hook_secret as string,
    );
  } catch (err: any) {
    console.error(
      "❌ Stripe webhook signature verification failed:",
      err.message,
    );
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  await BookingService.handleStripeWebhookEvent(event);

  // Stripe only needs 200 OK
  return res.status(200).json({ received: true });
};

export const BookingController = {
  handleStripeWebhookEvent,
};
