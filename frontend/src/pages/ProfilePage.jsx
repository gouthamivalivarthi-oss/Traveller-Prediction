import React, { useState, useEffect } from 'react';
import { User, Train, Clock, MapPin, Sparkles, CheckCircle2, ShieldCheck, Compass, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import GlassCard from '../components/common/GlassCard';
import TiltCard from '../components/common/TiltCard';
import AnimatedButton from '../components/common/AnimatedButton';

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();

  const [name, setName] = useState(user?.name || 'Gouthami');
  const [preferredTransport, setPreferredTransport] = useState(user?.preferred_transport || 'train');
  const [budget, setBudget] = useState(user?.budget || 'Medium');
  const [travelTime, setTravelTime] = useState(user?.preferred_travel_time || 'Morning (06:00 - 10:00)');
  const [travelFrequency, setTravelFrequency] = useState('Bi-weekly Weekend Trips');
  const [walkingPreference, setWalkingPreference] = useState('Moderate (up to 1.5 km)');
  const [destinations, setDestinations] = useState((user?.frequent_destinations || ['Hyderabad', 'Vijayawada', 'Goa']).join(', '));
  const [maxDuration, setMaxDuration] = useState(user?.max_duration || '6 hours');
  const [preferences, setPreferences] = useState(user?.travel_preferences || 'Window seat, punctual train departures, vegetarian meal options');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPreferredTransport(user.preferred_transport || 'train');
      setBudget(user.budget || 'Medium');
      setTravelTime(user.preferred_travel_time || 'Morning (06:00 - 10:00)');
      setDestinations((user.frequent_destinations || ['Hyderabad', 'Vijayawada', 'Goa']).join(', '));
      setMaxDuration(user.max_duration || '6 hours');
      setPreferences(user.travel_preferences || '');
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const destArray = destinations.split(',').map((s) => s.trim()).filter(Boolean);
    await updateProfile({
      name,
      preferred_transport: preferredTransport,
      budget,
      preferred_travel_time: travelTime,
      frequent_destinations: destArray,
      max_duration: maxDuration,
      travel_preferences: preferences
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 pb-16 max-w-4xl">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF7657]/10 border border-[#FF7657]/25 text-[#FF7657] text-xs font-bold uppercase tracking-wider mb-2">
          <User className="w-3.5 h-3.5" />
          3D Traveler Profile
        </div>
        <h1 className="text-3xl font-extrabold text-[#34261F] tracking-tight">Traveler Profile & Preferences</h1>
        <p className="text-sm text-[#7A5843] mt-1 max-w-xl">
          Configure your personal mobility defaults. Travel AI and the 3D Prediction Engine personalize crowd warnings and route suggestions to this profile.
        </p>
      </div>

      {/* AI Personalization Banner */}
      <GlassCard className="p-5 border border-[#F2DECC] bg-gradient-to-r from-[#FFF8ED] to-[#FFF1DD] flex items-start gap-3">
        <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#FF7657] to-[#FF9F43] flex items-center justify-center shrink-0 mt-0.5 text-white shadow-sm">
          <Sparkles className="w-4 h-4" />
        </div>
        <div className="text-xs text-[#5A4032] space-y-1">
          <strong className="text-[#34261F] block text-sm font-bold">Autonomous AI Context Tuning:</strong>
          <p>
            When you ask: <em>"Plan my trip to Vijayawada"</em>, Travel AI automatically configures for <strong>{preferredTransport}</strong> travel during <strong>{travelTime}</strong> within a <strong>{budget}</strong> budget tier.
          </p>
        </div>
      </GlassCard>

      {/* Profile Form */}
      <form onSubmit={handleSubmit}>
        <GlassCard className="p-6 sm:p-8 border border-[#F2DECC] space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
            <div>
              <label className="text-[#34261F] font-bold block mb-1.5">Traveler Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8ED] border border-[#F2DECC] text-sm text-[#34261F] font-semibold focus:outline-none focus:border-[#FF7657]"
              />
            </div>

            <div>
              <label className="text-[#34261F] font-bold block mb-1.5">Preferred Transport Mode</label>
              <select
                value={preferredTransport}
                onChange={(e) => setPreferredTransport(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8ED] border border-[#F2DECC] text-sm text-[#34261F] font-semibold focus:outline-none focus:border-[#FF7657]"
              >
                <option value="train">🚆 Train (Standard & Express)</option>
                <option value="flight">✈ Flight</option>
                <option value="bus">🚌 Express Coach / Bus</option>
                <option value="car">🚗 Personal Car</option>
                <option value="taxi">🚕 Taxi / Cab</option>
              </select>
            </div>

            <div>
              <label className="text-[#34261F] font-bold block mb-1.5">Standard Budget Tier</label>
              <select
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8ED] border border-[#F2DECC] text-sm text-[#34261F] font-semibold focus:outline-none focus:border-[#FF7657]"
              >
                <option value="Economy">Economy (Budget Optimization)</option>
                <option value="Medium">Medium (Balanced Comfort)</option>
                <option value="Premium">Premium (Fastest / AC Express)</option>
              </select>
            </div>

            <div>
              <label className="text-[#34261F] font-bold block mb-1.5">Preferred Travel Time Window</label>
              <input
                type="text"
                value={travelTime}
                onChange={(e) => setTravelTime(e.target.value)}
                placeholder="e.g. Morning (06:00 - 10:00)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8ED] border border-[#F2DECC] text-sm text-[#34261F] font-semibold focus:outline-none focus:border-[#FF7657]"
              />
            </div>

            <div>
              <label className="text-[#34261F] font-bold block mb-1.5">Travel Frequency</label>
              <input
                type="text"
                value={travelFrequency}
                onChange={(e) => setTravelFrequency(e.target.value)}
                placeholder="e.g. Bi-weekly Weekend Trips"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8ED] border border-[#F2DECC] text-sm text-[#34261F] font-semibold focus:outline-none focus:border-[#FF7657]"
              />
            </div>

            <div>
              <label className="text-[#34261F] font-bold block mb-1.5">Walking Preference</label>
              <input
                type="text"
                value={walkingPreference}
                onChange={(e) => setWalkingPreference(e.target.value)}
                placeholder="e.g. Moderate (up to 1.5 km)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8ED] border border-[#F2DECC] text-sm text-[#34261F] font-semibold focus:outline-none focus:border-[#FF7657]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-[#34261F] font-bold block mb-1.5">Favorite Destinations (comma-separated)</label>
              <input
                type="text"
                value={destinations}
                onChange={(e) => setDestinations(e.target.value)}
                placeholder="Hyderabad, Vijayawada, Goa, Bangalore"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8ED] border border-[#F2DECC] text-sm text-[#34261F] font-semibold focus:outline-none focus:border-[#FF7657]"
              />
            </div>
          </div>

          <div>
            <label className="text-[#34261F] font-bold block text-xs mb-1.5">Special Travel Preferences & Dietary Needs</label>
            <textarea
              rows="3"
              value={preferences}
              onChange={(e) => setPreferences(e.target.value)}
              placeholder="Window seat, punctual train departures, avoid overnight transit..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8ED] border border-[#F2DECC] text-sm text-[#34261F] font-semibold focus:outline-none focus:border-[#FF7657]"
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[#F2DECC]">
            <div className="flex items-center gap-2 text-xs text-[#7A5843] font-medium">
              <ShieldCheck className="w-4 h-4 text-[#7BC67B]" />
              <span>Encrypted local session profile</span>
            </div>

            <AnimatedButton type="submit">
              {savedSuccess ? 'Preferences Saved! ✓' : 'Save 3D Profile'}
            </AnimatedButton>
          </div>
        </GlassCard>
      </form>
    </div>
  );
}

