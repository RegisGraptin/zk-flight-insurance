import { FlightApiResponse } from '@/types/flight';
import { IoShieldCheckmarkOutline } from 'react-icons/io5';
import { LuBadgeCheck } from 'react-icons/lu';

interface Payouts {
  [key: string]: number;
}

const payouts: Payouts = {
  "LESS_THAN_30_MINUTES": 0,
  "BETWEEN_30_AND_60_MINUTES": 30,
  "BETWEEN_60_AND_120_MINUTES": 50,
  "OVER_120_MINUTES_OR_CANCELLED": 100
};

export default function FlightInsuranceBuy({
  insuranceData
}: { insuranceData: FlightApiResponse }) {

  const isValid = insuranceData.data.planeValid && insuranceData.data.insuranceValid;

    function subscribeInsurance() {
        console.log("Test")
    }

  return (
    <div className="mt-8 bg-white/20 backdrop-blur-sm rounded-2xl shadow-xl p-8 md:p-12">
      <div className="flex items-center gap-3 mb-6">
        <IoShieldCheckmarkOutline className="w-8 h-8 text-white" />
        <h2 className="text-2xl font-bold text-white">Flight Insurance Details</h2>
      </div>

      {/* Flight Summary */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <div>
          <p className="text-sm text-white/80">Flight Number</p>
          <p className="text-lg font-semibold text-white">
            {insuranceData.data.carrierCode}-{insuranceData.data.flightNumber}
          </p>
        </div>
        <div>
          <p className="text-sm text-white/80">Departure Date</p>
          <p className="text-lg font-semibold text-white">
            {new Date(insuranceData.data.scheduledDepartureDate).toLocaleDateString()}
          </p>
        </div>
        <div>
          <p className="text-sm text-white/80">Ticket Price</p>
          <p className="text-lg font-semibold text-white">
            €-
          </p>
        </div>
      </div>

      {/* Payout Schedule */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-white mb-4">Coverage Details</h3>
        <div className="border border-white/20 rounded-lg overflow-hidden">
          {Object.entries(payouts).map(([delay, priceCovered]) => (
            <div 
              key={delay}
              className="flex justify-between items-center p-4 even:bg-white/5 border-b border-white/10 last:border-0"
            >
              <span className="text-white/80">
                {delay.replace(/_/g, ' ').replace('BETWEEN', 'BETWEEN ')}
              </span>
              <span className="font-semibold text-white">
                {priceCovered}€
              </span>
            </div>
          ))}
        </div>
        <p className="mt-2 text-sm text-white/60">
          * Compensation based on verified delay times from flight tracking services
        </p>
      </div>

      {/* Insurance Action Card */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white mb-2">Insurance Premium</h3>
            <p className="text-white/80 text-sm">
              {isValid ? 
                "Your flight is eligible for coverage" : 
                "This flight is not eligible for coverage"}
            </p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-white">
              €{(insuranceData.data.price).toFixed(2)}
            </p>
          </div>
        </div>

        <button
          className={`w-full mt-6 py-4 rounded-lg font-semibold text-white transition-all
            ${isValid ? 
              'bg-green-400 hover:bg-green-500' : 
              'bg-gray-400 cursor-not-allowed'}`
          }
          disabled={!isValid}
          onClick={() => subscribeInsurance()}
        >
          {isValid ? (
            <div className="flex items-center justify-center gap-2">
              <LuBadgeCheck className="w-5 h-5" />
              Purchase Insurance Protection
            </div>
          ) : (
            "Flight Not Eligible"
          )}
        </button>

        {!isValid && (
          <p className="mt-3 text-sm text-red-200 text-center">
            {!insuranceData.data.planeValid && 'Flight details could not be verified • '}
            {!insuranceData.data.insuranceValid && 'Insurance not available for this route'}
          </p>
        )}
      </div>
    </div>
  );
}