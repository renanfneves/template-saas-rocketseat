import stripe from "@/app/lib/stripe";
import { NextResponse, NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const { testId, userEmail } = await request.json();
  const price = process.env.STRIPE_PRODUCT_PRICE_ID;
  if (!price) {
    return NextResponse.json({ error: "Price ID not found" }, { status: 500 });
  }
  const metadata = {
    testId,
  };
  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [{ price, quantity: 1 }],
      mode: "payment",
      payment_method_types: ["card"],
      success_url: `${request.headers.get("origin")}/success`,
      cancel_url: `${request.headers.get("origin")}/`,
      ...(userEmail && { customer_email: userEmail }),
      metadata,
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
