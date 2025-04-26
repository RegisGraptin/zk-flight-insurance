type Prediction = {
    result: string;
    probability: string;
};

type Payouts = {
    [key: string]: number;
};

const payouts: Payouts = {
    "LESS_THAN_30_MINUTES": 0,
    "BETWEEN_30_AND_60_MINUTES": 30,
    "BETWEEN_60_AND_120_MINUTES": 50,
    "OVER_120_MINUTES_OR_CANCELLED": 100
};

// FIXME: Need to take into consideration the risk
export function computePremium(
    predictions: Prediction[], 
    margin: number = 0.3, 
    minPrice: number = 5.0, 
    maxPrice: number = 25.0
): number {

    let expectedCost = 0.0;

    // Calculate expected cost (probability-weighted payout)
    for (const pred of predictions) {
        const result = pred.result;
        const prob = parseFloat(pred.probability);
        const payout = payouts[result] || 0;
        expectedCost += prob * payout;
    }

    if (expectedCost === 0) {
        return -1; // Not worth insuring
    }

    // Calculate premium with margin
    let premium = expectedCost / (1 - margin);
    premium = Math.max(minPrice, Math.min(premium, maxPrice));

    return parseFloat(premium.toFixed(2)); // Round to 2 decimals
}
