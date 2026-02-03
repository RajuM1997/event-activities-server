import Stripe from "stripe";
import { PaymentStatus } from "@prisma/client";
import prisma from "../../../utils/prisma";

const handleStripeWebhookEvent = async (event: Stripe.Event) => {
  console.log("Stripe event type:", event.type);

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as any;
      const bookingId = session.metadata?.bookingId;

      if (!bookingId) return;

      console.log(session);

      await prisma.booking.updateMany({
        where: {
          id: bookingId,
          status: PaymentStatus.UNPAID,
        },
        data: {
          status:
            session.payment_status === "paid"
              ? PaymentStatus.PAID
              : PaymentStatus.UNPAID,
          paymentGatewayData: JSON.parse(JSON.stringify(session)),
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
