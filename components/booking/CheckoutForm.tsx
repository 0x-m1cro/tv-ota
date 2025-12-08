"use client";

import { useForm } from "react-hook-form";
import Button from "@/components/ui/Button";

export interface GuestFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  specialRequests?: string;
}

interface CheckoutFormProps {
  onSubmit: (data: GuestFormData) => void;
  loading?: boolean;
}

export default function CheckoutForm({ onSubmit, loading }: CheckoutFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GuestFormData>();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h2 className="mb-4 text-2xl font-bold text-gray-900">Guest Information</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                First Name *
              </label>
              <input
                {...register("firstName", { required: "First name is required" })}
                type="text"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="John"
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Last Name *
              </label>
              <input
                {...register("lastName", { required: "Last name is required" })}
                type="text"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Doe"
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Email Address *
            </label>
            <input
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              type="email"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="john.doe@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Phone Number (Optional)
            </label>
            <input
              {...register("phone")}
              type="tel"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="+1 (555) 123-4567"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Special Requests (Optional)
            </label>
            <textarea
              {...register("specialRequests")}
              rows={4}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Any special requests or preferences?"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 rounded-lg bg-blue-50 p-4">
        <input type="checkbox" required className="h-4 w-4 rounded border-gray-300 text-blue-600" />
        <label className="text-sm text-gray-700">
          I agree to the{" "}
          <a href="#" className="text-blue-600 hover:underline">
            terms and conditions
          </a>{" "}
          and{" "}
          <a href="#" className="text-blue-600 hover:underline">
            privacy policy
          </a>
        </label>
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={loading}>
        {loading ? "Processing..." : "Continue to Payment →"}
      </Button>
    </form>
  );
}
