import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import StockCard from './components/StockCard';
import StockChart from './components/StockChart';
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

// Helper to generate mock chart data based on stock movement
const generateMockChartData = (basePrice, trend = 'neutral') => {
  const data = [];
  let price = parseFloat(basePrice);
  for (let i = 0; i < 50; i++) {
    const volatility = price * 0.005; // 0.5% volatility
    const change = (Math.random() - 0.5) * volatility;

    // Add trend bias
    if (trend === 'up') price += Math.abs(change) * 0.5;
    if (trend === 'down') price -= Math.abs(change) * 0.5;

    price += change;
    data.push({
      time: `10:${i < 10 ? '0' + i : i} AM`,
      price: parseFloat(price.toFixed(2))
    });
  }
  return data;
};

function App() {
  const [stocks, setStocks] = useState(INITIAL_DATA);
  const [selectedStockId, setSelectedStockId] = useState(INITIAL_DATA[0].id);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date().toLocaleTimeString());

  // Derive selected stock object
  const selectedStock = stocks.find(s => s.id === selectedStockId) || stocks[0];

  // Update chart data when selected stock changes
  useEffect(() => {
    const trend = selectedStock.changePercent > 0 ? 'up' : selectedStock.changePercent < 0 ? 'down' : 'neutral';
    setChartData(generateMockChartData(selectedStock.price, trend));
  }, [selectedStockId, selectedStock.price, selectedStock.changePercent]);

  const handleRefresh = async () => {
    setLoading(true);

    const newStocks = [...stocks];

    for (let i = 0; i < newStocks.length; i++) {
      const item = newStocks[i];

      // Fetch Price Data
      const stockData = await fetchStockData(item.id);
      if (stockData) {
        newStocks[i] = { ...newStocks[i], ...stockData };
      }

      // Fetch Rating
      if (item.type === 'STOCK') {
        const rating = await fetchAnalystRating(item.symbol);
        if (rating) {
          newStocks[i].rating = rating;
        }
      }

      await new Promise(r => setTimeout(r, 500));
      setStocks([...newStocks]);
    }

    setLastUpdated(new Date().toLocaleTimeString());
    setLoading(false);
  };

  return (
    <div className="min-h-screen p-4 md:p-8 bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-slate-900 to-slate-800">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent filter drop-shadow-lg">
              Stock5000
            </h1>
            <p className="text-slate-400 mt-2 font-medium tracking-wide">
              LIVE MARKET DASHBOARD • <span className="text-cyan-400">{lastUpdated}</span>
            </p>
          </div>

          <button
            onClick={handleRefresh}
            className={`
                group relative px-6 py-3 rounded-xl bg-slate-800 border border-slate-700 
                hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] 
                transition-all duration-300
            `}
            disabled={loading}
          >
            <div className="flex items-center gap-3">
              <span className="text-slate-300 font-bold group-hover:text-white transition-colors">Refresh</span>
              <RefreshCw
                size={20}
                className={`text-cyan-400 ${loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`}
              />
            </div>

          </button>
        </header>

        {/* Main Grid */}
        <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stocks.map(stock => (
            <StockCard
              key={stock.id}
              data={stock}
              isSelected={selectedStockId === stock.id}
              onClick={() => setSelectedStockId(stock.id)}
            />
          ))}
        </main>

        {/* Dynamic Chart Section */}
        <section className="mt-8 transform transition-all duration-500 ease-out">
          <StockChart
            data={chartData}
            symbol={selectedStock.symbol}
            color={selectedStock.changePercent >= 0 ? '#10b981' : '#f43f5e'}
          />
        </section>

        <footer className="pt-12 pb-6 text-center text-slate-500 text-sm font-medium">
          Powered by Alpha Vantage & Claude • SPY/QQQ/DIA used as Index Proxies
        </footer>
      </div>
    </div>
  );
}

export default App;
