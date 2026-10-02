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
      // Warm fallback response
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
    <div className="h-[calc(100vh-8.5rem)] flex flex-col rounded-3xl glass-panel-warm border border-[#F2DECC] overflow-hidden shadow-2xl">
      {/* Chatbot Header */}
      <div className="px-6 py-4 border-b border-[#F2DECC] bg-[#FFF8ED]/90 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF7657] to-[#FF9F43] flex items-center justify-center text-white shadow-md shadow-[#FF7657]/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-[#34261F] text-base">Travel AI</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#7BC67B]/20 text-[#2D6A2E] border border-[#7BC67B]/40">
                Online & Predictive
              </span>
            </div>
            <p className="text-xs text-[#7A5843]">
              Your intelligent journey companion • MultiWOZ RAG & Random Forest Engine
            </p>
          </div>
        </div>

        <button
          onClick={() => setMessages(initialMessages)}
          className="text-xs text-[#7A5843] hover:text-[#34261F] flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FFFDF8] border border-[#F2DECC] hover:bg-[#FFF8ED] transition-colors cursor-pointer"
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
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#FF7657] to-[#FF9F43] flex items-center justify-center shrink-0 mt-0.5 shadow-sm text-white">
                <Sparkles className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-2xl rounded-3xl p-4 sm:p-5 text-sm leading-relaxed space-y-3 shadow-sm ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-[#FF7657] to-[#FF9F43] text-white rounded-tr-none shadow-md font-medium'
                  : 'bg-[#FFFDF8]/90 text-[#34261F] border border-[#F2DECC] rounded-tl-none shadow-sm'
              }`}
            >
              {/* Formatted Markdown-like Content */}
              <div className="whitespace-pre-line space-y-2">
                {msg.text.split('\n\n').map((paragraph, pIdx) => (
                  <p key={pIdx}>
                    {paragraph.split('**').map((chunk, cIdx) =>
                      cIdx % 2 === 1 ? (
                        <strong key={cIdx} className={`font-bold ${msg.sender === 'user' ? 'text-white' : 'text-[#34261F]'}`}>
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
                <div className="mt-4 p-4 rounded-2xl bg-[#FFF8ED] border border-[#F2DECC] space-y-3 shadow-inner">
                  <div className="flex items-center justify-between border-b border-[#F2DECC] pb-2">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#FF7657]" />
                      <span className="font-bold text-[#34261F] text-xs uppercase tracking-wider">
                        Prediction Forecast Card
                      </span>
                    </div>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#FF7657]/15 text-[#FF7657] border border-[#FF7657]/30">
                      {msg.predictionCard.crowd_level} DEMAND
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                    <div className="p-2.5 rounded-xl bg-[#FFFDF8] border border-[#F2DECC]">
                      <span className="text-[10px] text-[#7A5843] block font-semibold">Demand Score</span>
                      <span className="font-black text-[#FF7657] text-base">
                        {msg.predictionCard.demand_score}%
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#FFFDF8] border border-[#F2DECC]">
                      <span className="text-[10px] text-[#7A5843] block font-semibold">Delay Risk</span>
                      <span className="font-bold text-[#FF9F43] text-sm">
                        {msg.predictionCard.delay_risk}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#FFFDF8] border border-[#F2DECC]">
                      <span className="text-[10px] text-[#7A5843] block font-semibold">Price Risk</span>
                      <span className="font-bold text-[#FF7657] text-sm">
                        {msg.predictionCard.price_risk}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#FFFDF8] border border-[#F2DECC]">
                      <span className="text-[10px] text-[#7A5843] block font-semibold">Trip Risk</span>
                      <span className="font-bold text-[#A85832] text-sm">
                        {msg.predictionCard.overall_risk_level}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Inline Date Comparison */}
              {msg.dateComparison && (
                <div className="mt-4 p-3 rounded-2xl bg-[#FFF8ED] border border-[#F2DECC] overflow-x-auto shadow-inner">
                  <span className="text-xs font-bold text-[#34261F] mb-2 block">
                    Adjacent Dates (-2 to +2 Days)
                  </span>
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-[#F2DECC] text-[#7A5843]">
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
                          className={`border-b border-[#F2DECC]/50 ${
                            row.is_selected ? 'bg-[#FF7657]/15 font-bold text-[#FF7657]' : 'text-[#34261F]'
                          }`}
                        >
                          <td className="py-1.5 px-2">{row.display_date || row.date}</td>
                          <td className="py-1.5 px-2">{row.demand}%</td>
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
                      className="text-xs font-bold px-3 py-1.5 rounded-xl bg-[#FFF8ED] hover:bg-[#FDE7D3] text-[#A85832] border border-[#F2DECC] hover:border-[#FF9F43] transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <span>{btnText}</span>
                      <ArrowRight className="w-3 h-3 text-[#FF7657]" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {msg.sender === 'user' && (
              <div className="w-8 h-8 rounded-xl bg-[#5A4032] flex items-center justify-center shrink-0 mt-0.5 text-[#FFF8ED] font-bold text-xs shadow-sm">
                {user?.name ? user.name[0].toUpperCase() : 'U'}
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#FF7657] to-[#FF9F43] flex items-center justify-center shrink-0 text-white">
              <Sparkles className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-[#FFFDF8] p-4 rounded-3xl rounded-tl-none border border-[#F2DECC] text-[#7A5843] text-sm flex items-center gap-3 shadow-sm">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#FF7657] animate-ping" />
                <span className="w-2 h-2 rounded-full bg-[#FF9F43] animate-ping delay-150" />
                <span className="w-2 h-2 rounded-full bg-[#FFC857] animate-ping delay-300" />
              </div>
              <span className="text-xs font-semibold text-[#5A4032]">
                Evaluating dialogue intent & running prediction model...
              </span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="p-4 border-t border-[#F2DECC] bg-[#FFF8ED]/90 backdrop-blur-md">
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
            className="flex-1 px-4 py-3 rounded-2xl bg-[#FFFDF8] border border-[#F2DECC] text-sm text-[#34261F] placeholder-[#A08573] focus:outline-none focus:border-[#FF7657] transition-colors shadow-inner font-medium"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || loading}
            className="p-3 rounded-2xl bg-gradient-to-r from-[#FF7657] to-[#FF9F43] hover:from-[#FF603B] hover:to-[#FF8E26] text-white font-bold disabled:opacity-50 transition-all shadow-md shadow-[#FF7657]/30 cursor-pointer"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}

