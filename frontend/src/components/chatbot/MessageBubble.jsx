import React from 'react';
import { Bot, User, Sparkles, ArrowRight } from 'lucide-react';

export default function MessageBubble({ message, onActionClick = null }) {
  const isAi = message.sender === 'ai';

  return (
    <div className={`flex items-start gap-3 ${isAi ? 'justify-start' : 'justify-end'}`}>
      {isAi && (
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white shrink-0 mt-0.5 shadow-sm">
          <Bot className="w-4 h-4" />
        </div>
      )}

      <div
        className={`max-w-xl rounded-2xl p-4 text-xs sm:text-sm leading-relaxed space-y-3 shadow-md ${
          isAi
            ? 'bg-slate-900/90 text-slate-100 border border-slate-800 rounded-tl-none'
            : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-none shadow-blue-500/20'
        }`}
      >
        {/* Message Text with bold chunks */}
        <div className="whitespace-pre-line space-y-2">
          {message.text.split('\n\n').map((paragraph, pIdx) => (
            <p key={pIdx}>
              {paragraph.split('**').map((chunk, cIdx) =>
                cIdx % 2 === 1 ? (
                  <strong key={cIdx} className={isAi ? 'font-bold text-white' : 'font-bold text-white'}>
                    {chunk}
                  </strong>
                ) : (
                  chunk
                )
              )}
            </p>
          ))}
        </div>

        {/* Structured Prediction Card (if returned) */}
        {message.predictionCard && (
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
              <span className="font-extrabold text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                Forecast Summary
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/15 text-cyan-400 border border-blue-500/30">
                {message.predictionCard.crowd_level} DEMAND
              </span>
            </div>

            <div className="grid grid-cols-3 gap-1.5 text-center text-[11px]">
              <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Demand</span>
                <strong className="text-rose-400 font-bold">{message.predictionCard.demand_score}%</strong>
              </div>
              <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Delay Risk</span>
                <strong className="text-amber-400 font-bold">{message.predictionCard.delay_risk}</strong>
              </div>
              <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Price Risk</span>
                <strong className="text-cyan-400 font-bold">{message.predictionCard.price_risk}</strong>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {message.actionButtons && message.actionButtons.length > 0 && (
          <div className="pt-2 flex flex-wrap gap-2">
            {message.actionButtons.map((btnText, bIdx) => (
              <button
                key={bIdx}
                onClick={() => onActionClick && onActionClick(btnText)}
                className="text-[11px] font-bold px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-blue-600 hover:text-white text-cyan-400 border border-blue-500/30 transition-all flex items-center gap-1 cursor-pointer shadow-sm active:scale-95"
              >
                <span>{btnText}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            ))}
          </div>
        )}
      </div>

      {!isAi && (
        <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 text-white flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs shadow-sm">
          <User className="w-4 h-4 text-slate-300" />
        </div>
      )}
    </div>
  );
}
