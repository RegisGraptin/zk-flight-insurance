export interface FlightFormData {
  carrierCode: string;
  flightNumber: string;
  scheduledDepartureDate: string;
}

export interface FlightApiResponse {
  data: {
    carrierCode: string;
    flightNumber: string;
    scheduledDepartureDate: string;
    price: number;
    planeValid: boolean;
    insuranceValid: boolean;
  };
  hash: {
    type: string;
    data: number[];
  };
  signature: string;
}