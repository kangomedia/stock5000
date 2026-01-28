import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import StockCard from './components/StockCard';
import { fetchStockData } from './services/alphaVantage';
import { fetchAnalystRating } from './services/claude';

// Initial Mock Data / Fallback
const INITIAL_DATA = [
  { id: 'SPY', symbol: 'S&P 500', name: 'SPDR S&P 500 ETF', price: '489.09', changePercent: 0.58, type: 'INDEX' },
  { id: 'QQQ', symbol: 'NASDAQ', name: 'Invesco QQQ', price: '425.12', changePercent: -0.22, type: 'INDEX' },
  { id: 'DIA', symbol: 'DOW', name: 'SPDR Dow Jones', price: '381.50', changePercent: 1.05, type: 'INDEX' },
  { id: 'AAPL', symbol: 'AAPL', name: 'Apple Inc.', price: '192.42', changePercent: -0.90, rating: 'HOLD', type: 'STOCK' },
  { id: 'NVDA', symbol: 'NVDA', name: 'NVIDIA Corp', price: '610.31', changePercent: 2.50, rating: 'BUY', type: 'STOCK' },
  { id: 'AMZN', symbol: 'AMZN', name: 'Amazon.com', price: '159.12', changePercent: 0.87, rating: 'BUY', type: 'STOCK' },
];

function App() {
  const [stocks, setStocks] = useState(INITIAL_DATA);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date().toLocaleTimeString());

  const handleRefresh = async () => {
    setLoading(true);

    // We clone the stocks to update them
    const newStocks = [...stocks];

    // Process sequentially to be gentle on rate limits or potential delays
    for (let i = 0; i < newStocks.length; i++) {
      const item = newStocks[i];

      // Fetch Price Data
      const stockData = await fetchStockData(item.id); // Using ID as symbol for AV (SPY, AAPL)
      if (stockData) {
        newStocks[i] = { ...newStocks[i], ...stockData };
      }

      // Fetch Rating (Only for Stocks)
      if (item.type === 'STOCK') {
        const rating = await fetchAnalystRating(item.symbol);
        if (rating) {
          newStocks[i].rating = rating;
        }
      }

      // Small delay to visualize progress and avoid some rate limits if rapid
      await new Promise(r => setTimeout(r, 500));
      setStocks([...newStocks]); // Real-time update effect
    }

    setLastUpdated(new Date().toLocaleTimeString());
    setLoading(false);
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
              Market Dashboard
            </h1>
            <p className="text-slate-400 mt-1">Real-time Watchlist • {lastUpdated}</p>
          </div>

          <button
            onClick={handleRefresh}
            className={`p-3 rounded-full bg-slate-800 border border-slate-700 hover:bg-slate-700 transition-all ${loading ? 'animate-spin' : ''}`}
            aria-label="Refresh Data"
            disabled={loading}
          >
            <RefreshCw size={20} className={`text-slate-300 ${loading ? 'opacity-50' : ''}`} />
          </button>
        </header>

        <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stocks.map(stock => (
            <StockCard key={stock.id} data={stock} />
          ))}
        </main>

        <footer className="mt-12 text-center text-slate-600 text-sm">
          Powered by Alpha Vantage & Claude • SPY/QQQ/DIA used as Index Proxies
        </footer>
      </div>
    </div>
  );
}

export default App;
