import React from 'react';
import { History, Sparkles, Bot, MapPin, Calendar, Clock, Compass } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import GlassCard from '../components/common/GlassCard';

const sampleHistory = [
  {
    type: 'prediction',
    title: 'Predicted: Hyderabad → Vijayawada',
    date: 'Today at 04:15 PM',
    result: 'Demand 84% (VERY HIGH) • Delay Risk: MEDIUM • 6-Factor Model',
    badge: '3D Prediction'
  },
  {
    type: 'chatbot',
    title: 'Travel AI: "Will Vijayawada be crowded on October 20?"',
    date: 'Today at 03:50 PM',
    result: 'Identified Dussehra Festival period; recommended October 18 or 22 departure.',
    badge: 'AI Assistant'
  },
  {
    type: 'route',
    title: 'Route Search: Hyderabad to Vijayawada via NH65',
    date: 'Today at 02:20 PM',
    result: 'Evaluated Route A (NH65 Express) vs Route B (SH2 Scenic Bypass).',
    badge: 'Route Planner'
  },
  {
    type: 'prediction',
    title: 'Predicted: Bangalore → Goa',
    date: 'Yesterday at 07:10 PM',
    result: 'Demand 52% (MEDIUM) • Flight vs Sleeper Coach evaluated.',
    badge: '3D Prediction'
  },
  {
    type: 'chatbot',
    title: 'Travel AI: "Is tomorrow a good day to travel?"',
    date: 'Yesterday at 05:40 PM',
    result: 'Normal weekday traffic conditions confirmed across South corridors.',
    badge: 'AI Assistant'
  }
];

export default function HistoryPage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8 pb-16">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF7657]/10 border border-[#FF7657]/25 text-[#FF7657] text-xs font-bold uppercase tracking-wider mb-2">
          <History className="w-3.5 h-3.5 text-[#FF7657]" />
          3D Activity Stream
        </div>
        <h1 className="text-3xl font-extrabold text-[#34261F] tracking-tight">Travel Audit Trail</h1>
        <p className="text-sm text-[#7A5843] mt-1 max-w-xl">
          Historical log of executed predictions, chatbot conversations, and route planning sessions.
        </p>
      </div>

      <GlassCard className="p-6 sm:p-8 border border-[#F2DECC] space-y-4">
        {sampleHistory.map((item, idx) => (
          <div
            key={idx}
            className="p-4 rounded-2xl bg-[#FFFDF8] border border-[#F2DECC] hover:border-[#FF9F43] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#FFF8ED] border border-[#F2DECC] flex items-center justify-center shrink-0 mt-0.5 text-[#FF7657]">
                {item.type === 'prediction' ? (
                  <Sparkles className="w-4 h-4 text-[#FF7657]" />
                ) : item.type === 'chatbot' ? (
                  <Bot className="w-4 h-4 text-[#FF9F43]" />
                ) : (
                  <MapPin className="w-4 h-4 text-[#7BC67B]" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-[#34261F] text-sm">{item.title}</h4>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#FF7657]/10 text-[#FF7657] border border-[#FF7657]/20">
                    {item.badge}
                  </span>
                </div>
                <p className="text-xs text-[#7A5843] mt-1">{item.result}</p>
              </div>
            </div>

            <span className="text-[11px] text-[#A08573] font-medium flex items-center gap-1 shrink-0">
              <Clock className="w-3 h-3 text-[#FF9F43]" />
              {item.date}
            </span>
          </div>
        ))}
      </GlassCard>
    </div>
  );
}

