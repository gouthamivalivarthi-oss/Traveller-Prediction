import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Sparkles, X, RefreshCw } from 'lucide-react';
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
    <div className="fixed bottom-24 right-6 z-50 w-[95vw] max-w-md h-[560px] rounded-3xl glass-panel-warm border border-[#FF7657]/40 shadow-2xl flex flex-col overflow-hidden animate-scaleUp">
      {/* 1. Header (Section 10) */}
      <div className="p-4 border-b border-[#FF9F43]/30 bg-gradient-to-r from-[#FFFDF8] to-[#FFF1DD] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#FF7657] to-[#FF9F43] flex items-center justify-center text-white shadow-md shadow-[#FF7657]/30">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-[#34261F] text-sm">✦ Travel AI</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#7BC67B]/20 text-[#5A4032] border border-[#7BC67B]/40">
                Online
              </span>
            </div>
            <p className="text-[11px] text-[#8C7162]">Your intelligent journey companion</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-xl text-[#8C7162] hover:text-[#34261F] hover:bg-[#FFF8ED] transition-colors"
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
          <div className="flex items-center gap-2 p-3 rounded-2xl glass-panel-cream text-xs text-[#5A4032]">
            <span className="w-2 h-2 rounded-full bg-[#FF7657] animate-ping" />
            <span>Consulting holiday engine & multi-factor ML models...</span>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* 3. Input Form */}
      <div className="p-3 border-t border-[#FF9F43]/30 bg-[#FFFDF8]">
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
            className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#FFF8ED] border border-[#FF9F43]/30 text-xs font-semibold text-[#34261F] placeholder-[#8C7162] focus:outline-none focus:border-[#FF7657]"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || loading}
            className="p-2.5 rounded-xl bg-gradient-to-r from-[#FF7657] to-[#FF9F43] hover:from-[#FF6347] hover:to-[#FF8C00] text-white disabled:opacity-50 transition-all shadow-md shadow-[#FF7657]/30 cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
