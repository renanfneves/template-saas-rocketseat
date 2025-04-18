import stripe from "@/app/lib/stripe";
import { handleStripeCancelSubscription } from "@/app/server/stripe/handle-stripe-cancel-subscription";
import { handleStripePayment } from "@/app/server/stripe/handle-stripe-payment";
import { handleStripeSubscription } from "@/app/server/stripe/handle-stripe-subscription";
import { headers } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

const secret = process.env.STRIPE_WEBHOOK_SECRET;

if (!secret) {
  console.error("Stripe webhook secret not found");
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get("stripe-signature");
    if (!signature || !secret) {
      return new Response("No signature or secret", { status: 400 });
    }
    const event = stripe.webhooks.constructEvent(body, signature, secret);
    console.log("Received event:", event.type);
    switch (event.type) {
      case "checkout.session.completed":
        const metadata = event.data.object.metadata;
        if (metadata?.price === process.env.STRIPE_PRODUCT_PRICE_ID) {
          await handleStripePayment(event);
        }
        if (metadata?.price === process.env.STRIPE_SUBSCRIPTION_PRICE_ID) {
          await handleStripeSubscription(event);
        }
        break;
      case "checkout.session.expired":
        break;
      case "checkout.session.async_payment_succeeded":
        break;
      case "checkout.session.async_payment_failed":
        break;
      case "customer.subscription.created":
        break;
      case "customer.subscription.deleted":
        await handleStripeCancelSubscription(event);
        break;
      default:
        console.warn(`Unhandled event type ${event.type}`);
    }
    return NextResponse.json({ message: "webhook received" }, { status: 200 });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json({ error: "Webhook error" }, { status: 500 });
  }
}
