const API_KEY = import.meta.env.VITE_ALPHA_VANTAGE_KEY;
const BASE_URL = 'https://www.alphavantage.co/query';

// Rate limit: 5 calls per minute.
// We use a simple delay if we were to fetch effectively, but for this demo 
// we might rely on the user having a premium key or just hitting the limit.
// We will implement a queue with simple delay if needed, or just fetch and catch errors.
// Note: Indexes like ^GSPC might not be available on free tier global quote.
// We will use ETF proxies: SPY (S&P 500), QQQ (Nasdaq), DIA (Dow) for reliability.

export const fetchStockData = async (symbol) => {
    if (!API_KEY) {
        console.warn('No Alpha Vantage Key found, returning mock data');
        return null;
    }

    try {
        const response = await fetch(`${BASE_URL}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`);
        const data = await response.json();

        if (data['Global Quote']) {
            const q = data['Global Quote'];
            return {
                price: parseFloat(q['05. price']).toFixed(2),
                changePercent: parseFloat(q['10. change percent'].replace('%', '')),
            };
        } else if (data['Note']) {
            console.warn('Alpha Vantage Rate Limit Hit', data['Note']);
            throw new Error('Rate Limit Hit');
        }
        return null;
    } catch (error) {
        console.error('Error fetching stock data:', error);
        return null;
    }
};
