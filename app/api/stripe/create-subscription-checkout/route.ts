import { auth } from "@/app/lib/auth";
import stripe from "@/app/lib/stripe";
import { getOrCreateCustomerId } from "@/app/server/stripe/get-or-create-customer-id";
import { NextResponse, NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const { testId } = await request.json();
  const price = process.env.STRIPE_SUBSCRIPTION_PRICE_ID;
  if (!price) {
    return NextResponse.json({ error: "Price not found" }, { status: 500 });
  }
  const session = await auth();
  const userId = session?.user?.id;
  const userEmail = session?.user?.email;
  if (!userId || !userEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const customerId = await getOrCreateCustomerId(userId, userEmail);
  const metadata = {
    testId,
    price,
    userId,
  };
  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [{ price, quantity: 1 }],
      mode: "subscription",
      payment_method_types: ["card"],
      success_url: `${request.headers.get("origin")}/success`,
      cancel_url: `${request.headers.get("origin")}/`,
      metadata,
      customer: customerId,
    });
    if (!session.url) {
      return NextResponse.json(
        { error: "Session URL not found" },
        { status: 500 }
      );
    }
    return NextResponse.json({ sessionId: session.id }, { status: 200 });
  } catch (error) {
    console.error("Error creating checkout session:", error);
  }
}
