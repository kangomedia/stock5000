// Direct calls to Anthropic from browser are generally blocked by CORS
// and exposing the API key in the client is not recommended.
// This is a simulation or a client-side implementation if a proxy were available.

const API_KEY = import.meta.env.VITE_ANTHROPIC_KEY;

export const fetchAnalystRating = async (symbol) => {
    if (!API_KEY) {
        return getMockRating(symbol);
    }

    // Real implementation would go here (likely via a proxy)
    // For this artifact, we will simulate the "Analysis"

    return getMockRating(symbol);
};

const getMockRating = (symbol) => {
    // Static robust analysis for the demo
    const ratings = {
        'NVDA': 'BUY',
        'AAPL': 'HOLD',
        'AMZN': 'BUY',
        'GOOGL': 'BUY',
        'MSFT': 'BUY',
        'TSLA': 'HOLD'
    };
    return ratings[symbol] || 'HOLD';
};
