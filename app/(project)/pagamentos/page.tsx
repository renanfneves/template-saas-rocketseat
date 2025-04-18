"use client";

import { useStripe } from "@/app/hooks/useStripe";

export default function Pagamentos() {
  const {
    createPaymentStripeCheckout,
    createSubscriptionStripeCheckout,
    handleCreateStripePortal,
  } = useStripe();
  return (
    <div className="flex flex-col gap-10 items-center justify-center h-screen">
      <h1 className="text-4xl font-bold">Pagamentos</h1>
      <button
        onClick={() =>
          createPaymentStripeCheckout({
            testId: "123",
          })
        }
        className="border rounded-md px-1"
      >
        Criar Pagamento Stripe
      </button>
      <button
        onClick={() =>
          createSubscriptionStripeCheckout({
            testId: "123",
          })
        }
        className="border rounded-md px-1"
      >
        Criar Assinatura Stripe
      </button>
      <button
        onClick={handleCreateStripePortal}
        className="border rounded-md px-1"
      >
        Criar Portal de Pagamentos
      </button>
    </div>
  );
}
