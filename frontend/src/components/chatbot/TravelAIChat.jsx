import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Sparkles, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MessageBubble from './MessageBubble';
import { sendChatMessage } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function TravelAIChat({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: "✦ **Travel AI Assistant**\n\nI am your intelligent journey companion. I evaluate festival rushes, crowd concentrations, transit delay probabilities, and fare spikes before you depart.\n\nHow can I help you plan your journey?",
      predictionCard: null,
      actionButtons: [
        'Will it be crowded if I travel next weekend?',
        'Is there any holiday around October 20?',
        'Compare Dates',
        'Check Holidays',
        'Find Routes'
      ]
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  if (!isOpen) return null;

  const handleSend = async (queryText) => {
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
          actionButtons: res.data.action_buttons || [
            'Compare Dates',
            'Find Alternative',
            'Check Holiday'
          ]
        };
        setMessages((prev) => [...prev, aiMsg]);
      }
    } catch (err) {
      console.warn('Chat error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleActionClick = (btnText) => {
    if (btnText === 'Compare Dates') {
      navigate('/predict');
      if (onClose) onClose();
    } else if (btnText === 'Find Routes' || btnText === 'Find Alternative') {
      navigate('/routes');
      if (onClose) onClose();
    } else if (btnText === 'Check Holidays' || btnText === 'Check Holiday') {
      navigate('/holidays');
      if (onClose) onClose();
    } else {
      handleSend(btnText);
    }
  };

  return (
    <div className="fixed bottom-24 right-6 z-50 w-[95vw] max-w-md h-[560px] rounded-3xl bg-[#0B1120]/95 backdrop-blur-2xl border border-slate-700/80 shadow-2xl flex flex-col overflow-hidden animate-scaleUp">
      {/* 1. Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-blue-500/25">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-white text-sm">✦ Travel AI</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                Online
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Your intelligent journey companion</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* 2. Messages List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m) => (
          <MessageBubble key={m.id} message={m} onActionClick={handleActionClick} />
        ))}

        {loading && (
          <div className="flex items-center gap-2 p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>Consulting holiday engine & multi-factor ML models...</span>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* 3. Input Form */}
      <div className="p-3 border-t border-slate-800 bg-slate-900/90">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask anything (e.g. Will Vijayawada be crowded on Oct 20?)"
            className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs font-semibold text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || loading}
            className="p-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white disabled:opacity-50 transition-all shadow-md shadow-blue-500/25 cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
