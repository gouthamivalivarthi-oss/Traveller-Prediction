import React from 'react';
import { Bot, User, Sparkles, ArrowRight, TrendingUp } from 'lucide-react';

export default function MessageBubble({ message, onActionClick = null }) {
  const isAi = message.sender === 'ai';

  return (
    <div className={`flex items-start gap-3 ${isAi ? 'justify-start' : 'justify-end'}`}>
      {isAi && (
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#FF7657] to-[#FF9F43] flex items-center justify-center text-white shrink-0 mt-0.5 shadow-sm">
          <Bot className="w-4 h-4" />
        </div>
      )}

      <div
        className={`max-w-xl rounded-2xl p-4 text-xs sm:text-sm leading-relaxed space-y-3 shadow-md ${
          isAi
            ? 'glass-panel-cream text-[#34261F] border border-[#FF9F43]/30 rounded-tl-none'
            : 'bg-gradient-to-r from-[#FF7657] to-[#FF9F43] text-white rounded-tr-none shadow-[#FF7657]/20'
        }`}
      >
        {/* Message Text with bold chunks */}
        <div className="whitespace-pre-line space-y-2">
          {message.text.split('\n\n').map((paragraph, pIdx) => (
            <p key={pIdx}>
              {paragraph.split('**').map((chunk, cIdx) =>
                cIdx % 2 === 1 ? (
                  <strong key={cIdx} className={isAi ? 'font-bold text-[#34261F]' : 'font-bold text-white'}>
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
          <div className="p-3.5 rounded-xl bg-[#FFFDF8] border border-[#FF7657]/30 space-y-2 text-xs">
            <div className="flex items-center justify-between border-b border-[#FF9F43]/20 pb-1.5">
              <span className="font-extrabold text-[#34261F] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#FF7657]" />
                Forecast Summary
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FF7657]/15 text-[#FF7657] border border-[#FF7657]/30">
                {message.predictionCard.crowd_level} DEMAND
              </span>
            </div>

            <div className="grid grid-cols-3 gap-1.5 text-center text-[11px]">
              <div className="p-1.5 rounded-lg bg-[#FFF8ED]">
                <span className="text-[#8C7162] block text-[10px]">Demand</span>
                <strong className="text-[#FF7657] font-bold">{message.predictionCard.demand_score}%</strong>
              </div>
              <div className="p-1.5 rounded-lg bg-[#FFF8ED]">
                <span className="text-[#8C7162] block text-[10px]">Delay Risk</span>
                <strong className="text-[#FF9F43] font-bold">{message.predictionCard.delay_risk}</strong>
              </div>
              <div className="p-1.5 rounded-lg bg-[#FFF8ED]">
                <span className="text-[#8C7162] block text-[10px]">Price Risk</span>
                <strong className="text-[#FFC857] font-bold">{message.predictionCard.price_risk}</strong>
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
                className="text-[11px] font-bold px-3 py-1.5 rounded-xl bg-[#FFFDF8] hover:bg-[#FF7657] hover:text-white text-[#FF7657] border border-[#FF7657]/30 transition-all flex items-center gap-1 cursor-pointer shadow-sm active:scale-95"
              >
                <span>{btnText}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            ))}
          </div>
        )}
      </div>

      {!isAi && (
        <div className="w-8 h-8 rounded-xl bg-[#34261F] text-white flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs shadow-sm">
          <User className="w-4 h-4 text-white" />
        </div>
      )}
    </div>
  );
}
