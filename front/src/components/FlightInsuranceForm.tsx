"use client";
import { useState } from "react";
import { GiCalendar, GiCommercialAirplane, GiTicket } from "react-icons/gi";

interface FlightFormData {
  carrierCode: string;
  flightNumber: string;
  scheduledDepartureDate: string;
}

// Interface for API response (you can modify this based on your actual response structure)
interface FlightValidationResponse {
  isValid: boolean;
  message?: string;
}

export default function FlightInsuranceForm() {
  const [formData, setFormData] = useState<FlightFormData>({
    carrierCode: "",
    flightNumber: "",
    scheduledDepartureDate: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationResult, setValidationResult] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value.toUpperCase(), // Auto-uppercase carrier code
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setValidationResult(null);

    // Basic validation
    if (
      !formData.carrierCode ||
      !formData.flightNumber ||
      !formData.scheduledDepartureDate
    ) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      // TODO: Replace this with actual API call to your backend
      const isValid = await checkFlightValidity(formData);

      if (isValid) {
        setValidationResult(
          "Flight validated successfully! Proceed to insurance purchase.",
        );
      } else {
        setValidationResult(
          "Flight not found in our system. Please verify your flight details.",
        );
      }
    } catch (err) {
      setError("Error validating flight. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // TODO: Implement actual API call
  const checkFlightValidity = async (
    data: FlightFormData,
  ): Promise<boolean> => {
    // TODO: Replace this mock implementation with actual fetch call
    console.log("Submitting flight data:", data);

    // Example of how to implement the fetch:
    /*
    const response = await fetch('/api/validate-flight', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error('Validation failed');
    
    const result: FlightValidationResponse = await response.json();
    return result.isValid;
    */

    // Mock validation
    return data.carrierCode === "AF" && data.flightNumber === "0264";
  };

  return (
    <section className="max-w-4xl mx-auto">
      <div className="bg-white/20 backdrop-blur-sm rounded-2xl shadow-xl p-8 md:p-12">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">
          Flight Insurance Verification
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col md:flex-row gap-6 md:gap-4">
            {/* Airline Code */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-white/90 mb-2">
                Airline Code
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <GiCommercialAirplane className="h-5 w-5 text-white/70" />
                </div>
                <input
                  type="text"
                  name="carrierCode"
                  value={formData.carrierCode}
                  onChange={handleChange}
                  placeholder="AF"
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all"
                  maxLength={2}
                  required
                />
              </div>
              <p className="mt-1 text-sm text-white/60">
                2-letter airline code
              </p>
            </div>

            {/* Flight Number */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-white/90 mb-2">
                Flight Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <GiTicket className="h-5 w-5 text-white/70" />
                </div>
                <input
                  type="text"
                  name="flightNumber"
                  value={formData.flightNumber}
                  onChange={(e) => {
                    // Allow only numbers
                    const value = e.target.value.replace(/\D/g, "");
                    setFormData((prev) => ({ ...prev, flightNumber: value }));
                  }}
                  placeholder="0264"
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all"
                  required
                />
              </div>
              <p className="mt-1 text-sm text-white/60">
                Numeric flight number
              </p>
            </div>

            {/* Departure Date */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-white/90 mb-2">
                Departure Date
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <GiCalendar className="h-5 w-5 text-white/70" />
                </div>
                <input
                  type="date"
                  name="scheduledDepartureDate"
                  value={formData.scheduledDepartureDate}
                  onChange={handleChange}
                  min={new Date().toISOString().split("T")[0]} // Disable past dates
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent [&::-webkit-calendar-picker-indicator]:invert transition-all"
                  required
                />
              </div>
              <p className="mt-1 text-sm text-white/60">
                Select departure date
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 py-4 px-6 bg-indigo-500 hover:bg-indigo-400 focus:ring-2 focus:ring-white focus:ring-offset-2 rounded-lg font-semibold text-white transition-all duration-200 ease-out disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Spinner className="animate-spin h-5 w-5" />
                  <span>Validating Flight...</span>
                </>
              ) : (
                <>
                  <span className="text-lg">✈️</span>
                  <span>Verify Flight Details</span>
                </>
              )}
            </button>
          </div>

          {/* Validation Messages */}
          {error && (
            <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {validationResult && (
            <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
              {validationResult}
            </div>
          )}
        </form>
      </div>
    </section>
  );
}

// Add this spinner component
function Spinner({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );
}
