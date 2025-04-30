
# Check plane 

carrierCode  = AF
flightNumber = 0264
scheduledDepartureDate = 2025-04-29


https://test.api.amadeus.com/v2/schedule/flights?carrierCode=AF&flightNumber=0264&scheduledDepartureDate=2025-04-29



```json
{
  "meta": {
    "count": 1,
    "links": {
      "self": "https://test.api.amadeus.com/v2/schedule/flights?carrierCode=AF&flightNumber=0264&scheduledDepartureDate=2025-04-29"
    }
  },
  "data": [
    {
      "type": "DatedFlight",
      "scheduledDepartureDate": "2025-04-29",
      "flightDesignator": {
        "carrierCode": "AF",
        "flightNumber": 264
      },
      "flightPoints": [
        {
          "iataCode": "CDG",
          "departure": {
            "timings": [
              {
                "qualifier": "STD",
                "value": "2025-04-29T11:30+02:00"
              }
            ]
          }
        },
        {
          "iataCode": "ICN",
          "arrival": {
            "timings": [
              {
                "qualifier": "STA",
                "value": "2025-04-30T06:30+09:00"
              }
            ]
          }
        }
      ],
      "segments": [
        {
          "boardPointIataCode": "CDG",
          "offPointIataCode": "ICN",
          "scheduledSegmentDuration": "PT12H",
          "partnership": {
            "operatingFlight": {
              "carrierCode": "KE",
              "flightNumber": 5902
            }
          }
        }
      ],
      "legs": [
        {
          "boardPointIataCode": "CDG",
          "offPointIataCode": "ICN",
          "aircraftEquipment": {
            "aircraftType": "359"
          },
          "scheduledLegDuration": "PT12H"
        }
      ]
    }
  ]
}
```



## Compute probabilities

URLSearchParams {
  'originLocationCode' => 'CDG',
  'destinationLocationCode' => 'ICN',
  'departureDate' => '2025-04-29',
  'departureTime' => '11:30:00',
  'arrivalDate' => '2025-04-30',
  'arrivalTime' => '06:30:00',
  'aircraftCode' => '359',
  'carrierCode' => 'KE',
  'flightNumber' => '5902',
  'duration' => 'PT12H' }

https://test.api.amadeus.com/v1/travel/predictions/flight-delay?originLocationCode=CDG&destinationLocationCode=ICN&departureDate=2025-04-29&departureTime=11%3A30%3A00&arrivalDate=2025-04-30&arrivalTime=06%3A30%3A00&aircraftCode=359&carrierCode=AF&flightNumber=264&duration=PT12H


```json
{
  "data": [
    {
      "id": "AF264CDGICN20250429",
      "probability": "0.17724386",
      "result": "LESS_THAN_30_MINUTES",
      "subType": "flight-delay",
      "type": "prediction"
    },
    {
      "id": "AF264CDGICN20250429",
      "probability": "0.23365594",
      "result": "BETWEEN_30_AND_60_MINUTES",
      "subType": "flight-delay",
      "type": "prediction"
    },
    {
      "id": "AF264CDGICN20250429",
      "probability": "0.18361978",
      "result": "BETWEEN_60_AND_120_MINUTES",
      "subType": "flight-delay",
      "type": "prediction"
    },
    {
      "id": "AF264CDGICN20250429",
      "probability": "0.4054804",
      "result": "OVER_120_MINUTES_OR_CANCELLED",
      "subType": "flight-delay",
      "type": "prediction"
    }
  ],
  "meta": {
    "count": 4,
    "links": {
      "self": "https://test.api.amadeus.com/v1/travel/predictions/flight-delay?originLocationCode=CDG&destinationLocationCode=ICN&departureDate=2025-04-29&departureTime=11:30:00&arrivalDate=2025-04-30&arrivalTime=06:30:00&aircraftCode=359&carrierCode=AF&flightNumber=264&duration=PT12H"
    }
  }
}
```