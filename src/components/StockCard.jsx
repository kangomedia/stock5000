import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

const StockCard = ({ data, onClick, isSelected }) => {
    const { symbol, name, price, changePercent, rating } = data;
    const isPositive = changePercent >= 0;

    return (
        <div
            onClick={onClick}
            className={`
                relative p-6 rounded-2xl cursor-pointer transition-all duration-300
                ${isSelected
                    ? 'bg-slate-800/80 border-cyan-400 shadow-[0_0_30px_rgba(34,211,238,0.2)] md:transform md:scale-105'
                    : 'bg-slate-800/40 border-slate-700 hover:bg-slate-800/60 hover:border-slate-600'
                }
                border backdrop-blur-md
            `}
        >
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

            {/* Active Indicator Line */}
            {isSelected && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/3 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-t-full" />
            )}
        </div>
    );
};

export default StockCard;
