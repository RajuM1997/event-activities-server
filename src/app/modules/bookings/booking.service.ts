import Stripe from "stripe";
import { PaymentStatus } from "@prisma/client";
import prisma from "../../../utils/prisma";

const handleStripeWebhookEvent = async (event: Stripe.Event) => {
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as any;
      const bookingId = session.metadata?.bookingId;

      await prisma.booking.update({
        where: {
          id: bookingId,
        },
        data: {
          status:
            session.payment_status === "paid"
              ? PaymentStatus.PAID
              : PaymentStatus.UNPAID,
          paymentGatewayData: session,
        },
      });

      break;
    }

    default:
      console.log("Unhandled event type");
  }
};

export const BookingService = {
  handleStripeWebhookEvent,
};
