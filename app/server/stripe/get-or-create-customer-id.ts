import "server-only";
import { db } from "@/app/lib/firebase";
import stripe from "@/app/lib/stripe";

export async function getOrCreateCustomerId(userId: string, userEmail: string) {
  try {
    const userRef = db.collection("users").doc(userId);
    const userDoc = await userRef.get();
    if (!userDoc.exists) {
      throw new Error("User not found");
    }
    const stripCustomerId = userDoc.data()?.stripeCustomerId;
    if (stripCustomerId) {
      return stripCustomerId;
    }
    const userName = userDoc.data()?.name;
    const stripeCustomer = await stripe.customers.create({
      email: userEmail,
      ...(userName && { name: userName }),
      metadata: {
        userId,
      },
    });
    await userRef.update({
      stripeCustomerId: stripeCustomer.id,
    });
    return stripeCustomer.id;
  } catch (error) {
    console.error("Error creating Stripe customer:", error);
    throw new Error("Failed to create Stripe customer");
  }
}
