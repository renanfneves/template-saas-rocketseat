import { db } from "@/app/lib/firebase";
import resend from "@/app/lib/resend";
import "server-only";
import type Stripe from "stripe";

export async function handleStripePayment(
  event: Stripe.CheckoutSessionCompletedEvent
) {
  if (event.data.object.payment_status === "paid") {
    console.log("Payment completed");
    const metadata = event.data.object.metadata;
    const userEmail =
      event.data.object.customer_email ||
      event.data.object.customer_details?.email;
    const userId = metadata?.userId;
    if (!userId || !userEmail) {
      console.error("User ID or Email not found");
      return;
    }
    await db.collection("users").doc(userId).update({
      stripeSubscriptionId: event.data.object.subscription,
      subscriptionStatus: "active",
    });
    const { data, error } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: [userEmail],
      subject: "Payment Confirmation",
      text: `Your payment was successful. Your subscription is now active.`,
    });
    if (error) {
      console.error("Error sending email:", error);
    }
    console.log("Payment confirmation email sent:", data);
  }
}
