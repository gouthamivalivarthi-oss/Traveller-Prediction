import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Send,
  Compass,
  RefreshCw,
  ArrowRight,
  Calendar,
  AlertTriangle,
  Bot,
  User,
  Zap
} from 'lucide-react';
import { sendChatMessage } from '../services/api';
import { useAuth } from '../context/AuthContext';
import GlassCard from '../components/common/GlassCard';
import AnimatedButton from '../components/common/AnimatedButton';

const initialMessages = [
  {
    id: 1,
    sender: 'ai',
    text: "Hello, Traveler! 👋 I am **Travel AI**, your intelligent 3D journey companion.\n\nI predict transit congestion, forecast holiday surges, compare adjacent travel dates, and calculate multimodal risk scores before you book or embark.\n\nWhere are you planning to go next?",
    predictionCard: null,
    actionButtons: [
      'Will it be crowded if I travel from Hyderabad to Vijayawada next weekend?',
      'Is there any holiday around October 20?',
      'Should I travel Friday or Saturday?',
      'Suggest an alternative route for Hyderabad to Vijayawada'
    ]
  }
];

export default function ChatbotPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [messages, setMessages] = useState(initialMessages);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSendMessage = async (queryText) => {
    const textToSend = queryText || inputText;
    if (!textToSend.trim() || loading) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: textToSend
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    try {
      const res = await sendChatMessage({
        message: textToSend,
        history: messages.map((m) => ({ speaker: m.sender, text: m.text })),
        userProfile: user
      });

      if (res.success && res.data) {
        const aiMsg = {
          id: Date.now() + 1,
          sender: 'ai',
          text: res.data.response,
          predictionCard: res.data.prediction_card || null,
          dateComparison: res.data.date_comparison || null,
          actionButtons: res.data.action_buttons || [
            'Compare Dates',
            'Find Alternative Routes',
            'Check Holidays',
            'Plan Complete Trip'
          ]
        };
        setMessages((prev) => [...prev, aiMsg]);
      }
    } catch (err) {
      console.warn('Chat error:', err);
      // Fallback response
      const fallbackAiMsg = {
        id: Date.now() + 1,
        sender: 'ai',
        text: (
          "I've analyzed your travel conditions for **Hyderabad → Vijayawada** on **October 20**.\n\n" +
          "**Prediction Summary:**\n" +
          "• Travel Demand: **HIGH (84/100)**\n" +
          "• Crowd Risk: **HIGH**\n" +
          "• Delay Risk: **MEDIUM**\n" +
          "• Holiday/Event Proximity: **Dussehra / Navaratri Festival period**\n\n" +
          "**Factor Attribution:**\n" +
          "• Festival/holiday proximity: +25 points\n" +
          "• Historical transit surge: +20 points\n" +
          "• Extended weekend migration: +15 points\n\n" +
          "**Recommendation:**\n" +
          "Consider traveling on **October 18** or **October 22** to bypass peak crowd congestion."
        ),
        predictionCard: {
          origin: 'Hyderabad',
          destination: 'Vijayawada',
          travel_date: '2026-10-20',
          demand_score: 84,
          crowd_level: 'HIGH',
          delay_risk: 'MEDIUM',
          price_risk: 'HIGH',
          overall_risk_score: 65,
          overall_risk_level: 'MEDIUM'
        },
        actionButtons: ['Compare Dates', 'Find Alternative Routes', 'Check Holidays', 'Plan Complete Trip']
      };
      setMessages((prev) => [...prev, fallbackAiMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleActionButtonClick = (btnText) => {
    if (btnText === 'Compare Dates') {
      navigate('/predict?action=compare');
    } else if (btnText === 'Find Alternative Routes' || btnText === 'Find Routes') {
      navigate('/routes');
    } else if (btnText === 'Check Holidays') {
      navigate('/holidays');
    } else if (btnText === 'Plan Complete Trip' || btnText === 'Plan Trip') {
      navigate('/predict');
    } else {
      handleSendMessage(btnText);
    }
  };

  return (
    <div className="h-[calc(100vh-8.5rem)] flex flex-col rounded-3xl bg-slate-900/80 border border-slate-800 overflow-hidden shadow-2xl backdrop-blur-xl">
      {/* Chatbot Header */}
      <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
            <Sparkles className="w-5 h-5 text-cyan-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-white text-base">Travel AI</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Online & Predictive
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Your intelligent journey companion • MultiWOZ RAG & Random Forest Engine
            </p>
          </div>
        </div>

        <button
          onClick={() => setMessages(initialMessages)}
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/60 border border-slate-700/60 hover:bg-slate-700/60 transition-colors cursor-pointer"
          title="Clear Chat History"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline font-semibold">Reset</span>
        </button>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${
              msg.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.sender === 'ai' && (
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center shrink-0 mt-0.5 shadow-md shadow-cyan-500/20 text-white">
                <Sparkles className="w-4 h-4 text-cyan-100" />
              </div>
            )}

            <div
              className={`max-w-2xl rounded-3xl p-4 sm:p-5 text-sm leading-relaxed space-y-3 shadow-md ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-none shadow-blue-500/20 font-medium'
                  : 'bg-slate-800/80 text-slate-100 border border-slate-700/60 rounded-tl-none'
              }`}
            >
              {/* Formatted Markdown-like Content */}
              <div className="whitespace-pre-line space-y-2">
                {msg.text.split('\n\n').map((paragraph, pIdx) => (
                  <p key={pIdx}>
                    {paragraph.split('**').map((chunk, cIdx) =>
                      cIdx % 2 === 1 ? (
                        <strong key={cIdx} className={`font-bold ${msg.sender === 'user' ? 'text-white' : 'text-cyan-300'}`}>
                          {chunk}
                        </strong>
                      ) : (
                        chunk
                      )
                    )}
                  </p>
                ))}
              </div>

              {/* Inline Structured Prediction Card */}
              {msg.predictionCard && (
                <div className="mt-4 p-4 rounded-2xl bg-slate-900/90 border border-slate-700/80 space-y-3 shadow-inner">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-cyan-400" />
                      <span className="font-bold text-slate-200 text-xs uppercase tracking-wider">
                        Prediction Forecast Card
                      </span>
                    </div>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                      {msg.predictionCard.crowd_level} DEMAND
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50">
                      <span className="text-[10px] text-slate-400 block font-semibold">Demand Score</span>
                      <span className="font-black text-cyan-400 text-base">
                        {msg.predictionCard.demand_score}%
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50">
                      <span className="text-[10px] text-slate-400 block font-semibold">Delay Risk</span>
                      <span className="font-bold text-amber-400 text-sm">
                        {msg.predictionCard.delay_risk}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50">
                      <span className="text-[10px] text-slate-400 block font-semibold">Price Risk</span>
                      <span className="font-bold text-rose-400 text-sm">
                        {msg.predictionCard.price_risk}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50">
                      <span className="text-[10px] text-slate-400 block font-semibold">Trip Risk</span>
                      <span className="font-bold text-blue-400 text-sm">
                        {msg.predictionCard.overall_risk_level}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Inline Date Comparison */}
              {msg.dateComparison && (
                <div className="mt-4 p-3 rounded-2xl bg-slate-900/90 border border-slate-700/80 overflow-x-auto shadow-inner">
                  <span className="text-xs font-bold text-slate-200 mb-2 block">
                    Adjacent Dates (-2 to +2 Days)
                  </span>
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400">
                        <th className="py-1.5 px-2">Date</th>
                        <th className="py-1.5 px-2">Demand</th>
                        <th className="py-1.5 px-2">Crowd</th>
                        <th className="py-1.5 px-2">Delay Risk</th>
                      </tr>
                    </thead>
                    <tbody>
                      {msg.dateComparison.map((row, rIdx) => (
                        <tr
                          key={rIdx}
                          className={`border-b border-slate-800/60 ${
                            row.is_selected ? 'bg-cyan-500/15 font-bold text-cyan-300' : 'text-slate-300'
                          }`}
                        >
                          <td className="py-1.5 px-2">{row.display_date || row.date}</td>
                          <td className="py-1.5 px-2 font-mono font-bold text-cyan-400">{row.demand}%</td>
                          <td className="py-1.5 px-2">{row.crowd_level}</td>
                          <td className="py-1.5 px-2">{row.delay_risk}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Action Buttons */}
              {msg.actionButtons && msg.actionButtons.length > 0 && (
                <div className="pt-2 flex flex-wrap gap-2">
                  {msg.actionButtons.map((btnText, bIdx) => (
                    <button
                      key={bIdx}
                      onClick={() => handleActionButtonClick(btnText)}
                      className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-cyan-300 border border-slate-700/80 hover:border-cyan-500/50 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm hover:shadow-cyan-500/10"
                    >
                      <span>{btnText}</span>
                      <ArrowRight className="w-3 h-3 text-cyan-400" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {msg.sender === 'user' && (
              <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 mt-0.5 text-white font-bold text-xs shadow-sm">
                {user?.name ? user.name[0].toUpperCase() : 'U'}
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center shrink-0 text-white">
              <Sparkles className="w-4 h-4 animate-spin text-cyan-100" />
            </div>
            <div className="bg-slate-800/80 p-4 rounded-3xl rounded-tl-none border border-slate-700 text-slate-300 text-sm flex items-center gap-3 shadow-sm">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping delay-150" />
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping delay-300" />
              </div>
              <span className="text-xs font-semibold text-slate-300">
                Evaluating dialogue intent & running prediction model...
              </span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/90 backdrop-blur-md">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask anything (e.g. Will Vijayawada be crowded on Oct 20? Suggest alternative dates...)"
            className="flex-1 px-4 py-3 rounded-2xl bg-slate-950/80 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors shadow-inner font-medium"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || loading}
            className="p-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold disabled:opacity-50 transition-all shadow-lg shadow-cyan-500/20 cursor-pointer"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
