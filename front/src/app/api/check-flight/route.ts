import { FlightFormData } from '@/types/flight';
import { getAccessToken } from '@/utils/amadeus/api';
import { computePremium } from '@/utils/insurance/premium';
import { signFlightData } from '@/utils/sign';
import { createSign } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

// TODO: Fetch access token based on credentials
// https://developers.amadeus.com/self-service/apis-docs/guides/developer-guides/API-Keys/authorization/

function convertToLocalTime(datetime: string): string {
    // Extract the time portion from the ISO 8601 string
    return datetime.split('T')[1].split("+")[0] + ":00";
}

function extractDateFromDatetime(datetime: string): string {
    return datetime.split('T')[0]; // Extracts the date portion "YYYY-MM-DD"
}

export const POST = async (req: NextRequest) => {
  
    let data: FlightFormData = await req.json();
    console.log(data);
  
    // Fetch the access token
    const accessToken = await getAccessToken();

    // Fetch On Demand Flight Status
    // https://developers.amadeus.com/self-service/category/flights/api-doc/on-demand-flight-status
    const params = new URLSearchParams({
        "carrierCode": data.carrierCode,
        "flightNumber": data.flightNumber,
        "scheduledDepartureDate": data.scheduledDepartureDate,
    });
    const url = "https://test.api.amadeus.com/v2/schedule/flights?" + params.toString();
    const res = await fetch(url, {
        method: "GET",
        headers: new Headers({
            "Authorization": `Bearer ${accessToken}`
        })
    });
    const flightData = (await res.json())["data"][0];


    console.log(flightData);

    // Fetch Flight Delay Prediction
    // https://developers.amadeus.com/self-service/category/flights/api-doc/flight-delay-prediction

    const departureDate = flightData["flightPoints"][0]["departure"]["timings"][0]["value"];
    const arrivalDate = flightData["flightPoints"][1]["arrival"]["timings"][0]["value"];

    const delayParams = new URLSearchParams({
        "originLocationCode": flightData["flightPoints"][0]["iataCode"],
        "destinationLocationCode": flightData["flightPoints"][1]["iataCode"],
        "departureDate": extractDateFromDatetime(departureDate),
        "departureTime": convertToLocalTime(departureDate),
        "arrivalDate": extractDateFromDatetime(arrivalDate),
        "arrivalTime": convertToLocalTime(arrivalDate),
        "aircraftCode": flightData["legs"][0]["aircraftEquipment"]["aircraftType"],
        "carrierCode": flightData["flightDesignator"]["carrierCode"],
        "flightNumber": flightData["flightDesignator"]["flightNumber"],
        "duration": flightData["legs"][0]["scheduledLegDuration"],
    });
    const flightDelayUrl = "https://test.api.amadeus.com/v1/travel/predictions/flight-delay?" + delayParams.toString();
    const flighDelayResponse = await fetch(flightDelayUrl, {
        method: "GET",
        headers: new Headers({
            "Authorization": `Bearer ${accessToken}`
        })
    });
    

    const fligthDelayJson = await flighDelayResponse.json();
    const flightDelayData = fligthDelayJson["data"];
    
    console.log(fligthDelayJson);

    let premium;
    if ("errors" in fligthDelayJson) {
        console.log("Fake premium generated!!")
        premium = 25;
    } else {
        premium = computePremium(flightDelayData)
        console.log("premium computed: ", premium)
    }

    const userData = {
        ...data,
        "price": premium,
        "planeValid": true,
        "insuranceValid": true,
    }

    const signedData = signFlightData(userData)
    
    return NextResponse.json(signedData);
};