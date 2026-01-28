import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

const StockCard = ({ data }) => {
    const { symbol, name, price, changePercent, rating } = data;
    const isPositive = changePercent >= 0;

    return (
        <div className="bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-700 hover:border-slate-600 transition-colors">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-2xl font-bold text-white tracking-tight">{symbol}</h3>
                    <p className="text-slate-400 text-sm font-medium">{name}</p>
                </div>
                {rating && (
                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${rating === 'BUY' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                            rating === 'SELL' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                                'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                        }`}>
                        {rating}
                    </span>
                )}
            </div>

            <div className="flex items-baseline gap-2 mt-auto">
                <span className="text-4xl font-bold text-white">
                    {price}
                </span>
            </div>

            <div className={`flex items-center gap-1 mt-2 text-sm font-semibold ${isPositive ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                {isPositive ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                <span>{Math.abs(changePercent).toFixed(2)}%</span>
            </div>
        </div>
    );
};

export default StockCard;
