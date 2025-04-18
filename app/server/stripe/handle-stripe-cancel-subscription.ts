import "server-only";
import { db } from "@/app/lib/firebase";
import type Stripe from "stripe";

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
  console.log("userRef", userRef);
  const userId = userRef.docs[0].id;
  console.log("userId", userId);
  await db.collection("users").doc(userId).update({
    subscriptionStatus: "inactive",
  });
}
