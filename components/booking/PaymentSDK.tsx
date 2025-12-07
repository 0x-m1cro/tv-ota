"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";

interface PaymentSDKProps {
  secretKey: string;
  returnUrl: string;
  onPaymentComplete?: () => void;
  onPaymentError?: (error: string) => void;
}

export default function PaymentSDK({
  secretKey,
  returnUrl,
  onPaymentComplete,
  onPaymentError,
}: PaymentSDKProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const paymentRef = useRef<HTMLDivElement>(null);
  const [sdkLoaded, setSdkLoaded] = useState(false);

  useEffect(() => {
    // Load LiteAPI Payment SDK script
    const script = document.createElement("script");
    script.src = "https://payment-wrapper.liteapi.travel/dist/liteAPIPayment.js?v=a1";
    script.async = true;
    
    script.onload = () => {
      setSdkLoaded(true);
    };

    script.onerror = () => {
      setError("Failed to load payment SDK");
      setLoading(false);
      if (onPaymentError) {
        onPaymentError("Failed to load payment SDK");
      }
    };

    document.body.appendChild(script);

    return () => {
      // Cleanup script on unmount
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [onPaymentError]);

  useEffect(() => {
    if (!sdkLoaded || !secretKey || !paymentRef.current) return;

    let mounted = true;

    const initPayment = () => {
      if (!mounted) return;
      
      try {
        setLoading(true);
      
        // Initialize LiteAPI Payment SDK
        // @ts-expect-error - LiteAPI SDK is loaded dynamically
        if (typeof window !== "undefined" && window.LiteAPIPayment) {
          const liteAPIConfig = {
          publicKey: "sandbox", // Use 'live' for production
          appearance: {
            theme: "flat",
          },
          options: {
            business: {
              name: "Maldives Only",
            },
          },
          targetElement: "#payment-container",
          secretKey: secretKey,
          returnUrl: returnUrl,
        };

          // @ts-expect-error
          const liteAPIPayment = new window.LiteAPIPayment(liteAPIConfig);
          liteAPIPayment.handlePayment();

          setLoading(false);

          // Listen for payment completion events
          window.addEventListener("message", (event) => {
            if (!mounted) return;
            if (event.data && event.data.type === "payment-success") {
              if (onPaymentComplete) {
                onPaymentComplete();
              }
            } else if (event.data && event.data.type === "payment-error") {
              if (onPaymentError) {
                onPaymentError(event.data.message || "Payment failed");
              }
            }
          });
        } else {
          setError("Payment SDK not available");
          setLoading(false);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to initialize payment");
        setLoading(false);
        if (onPaymentError) {
          onPaymentError(err instanceof Error ? err.message : "Failed to initialize payment");
        }
      }
    };

    initPayment();

    return () => {
      mounted = false;
    };
  }, [sdkLoaded, secretKey, returnUrl, onPaymentComplete, onPaymentError]);

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-6 text-center">
        <p className="text-red-800">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="ml-3 text-gray-600">Loading payment form...</p>
        </div>
      )}

      {/* Payment SDK Container */}
      <div
        id="payment-container"
        ref={paymentRef}
        className={loading ? "hidden" : "min-h-[400px]"}
      />

      {/* Test Card Info for Sandbox */}
      <div className="rounded-lg bg-yellow-50 p-4">
        <h4 className="mb-2 font-semibold text-yellow-900">Test Card Information (Sandbox)</h4>
        <div className="space-y-1 text-sm text-yellow-800">
          <p>Card Number: 4111 1111 1111 1111</p>
          <p>Expiry: Any future date</p>
          <p>CVV: Any 3 digits</p>
          <p>Name: Any name</p>
        </div>
      </div>
    </div>
  );
}
