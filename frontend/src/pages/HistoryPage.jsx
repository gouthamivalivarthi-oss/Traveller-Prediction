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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">
          <History className="w-3.5 h-3.5 text-cyan-400" />
          3D Activity Stream
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Travel Audit Trail</h1>
        <p className="text-sm text-slate-400 mt-1 max-w-xl">
          Historical log of executed predictions, chatbot conversations, and route planning sessions.
        </p>
      </div>

      <GlassCard className="p-6 sm:p-8 border border-slate-800 bg-slate-900/60 space-y-4">
        {sampleHistory.map((item, idx) => (
          <div
            key={idx}
            className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 hover:border-cyan-500/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                {item.type === 'prediction' ? (
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                ) : item.type === 'chatbot' ? (
                  <Bot className="w-4 h-4 text-blue-400" />
                ) : (
                  <MapPin className="w-4 h-4 text-emerald-400" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-white text-sm">{item.title}</h4>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                    {item.badge}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">{item.result}</p>
              </div>
            </div>

            <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1 shrink-0">
              <Clock className="w-3 h-3 text-cyan-400" />
              {item.date}
            </span>
          </div>
        ))}
      </GlassCard>
    </div>
  );
}
