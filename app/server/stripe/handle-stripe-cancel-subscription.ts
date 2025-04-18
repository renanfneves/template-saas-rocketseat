import "server-only";
import { db } from "@/app/lib/firebase";
import type Stripe from "stripe";
import resend from "@/app/lib/resend";

export async function handleStripeCancelSubscription(
  event: Stripe.CustomerSubscriptionDeletedEvent
) {
  const customerId = event.data.object.customer;
  const userRef = await db
    .collection("users")
    .where("stripeCustomerId", "==", customerId)
    .get();
  if (!userRef) {
    console.error("User ID not found in metadata");
    return;
  }
  const userId = userRef.docs[0].id;
  const userEmail = userRef.docs[0].data().email;
  console.log("userId", userId);
  await db.collection("users").doc(userId).update({
    subscriptionStatus: "inactive",
  });
  const { data, error } = await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: [userEmail],
    subject: "Subscription Cancelled",
    text: `Your subscription has been cancelled. If you have any questions, please contact us.`,
  });
  if (error) {
    console.error("Error sending email:", error);
  }
  console.log("Subscription cancelled email sent:", data);
}
