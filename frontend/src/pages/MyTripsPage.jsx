import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Luggage,
  Calendar,
  Sparkles,
  Plane,
  Trash2,
  Plus,
  ArrowRight,
  TrendingUp,
  Compass
} from 'lucide-react';
import { getTrips, updateTrip, deleteTrip } from '../services/api';
import GlassCard from '../components/common/GlassCard';
import TiltCard from '../components/common/TiltCard';
import AnimatedButton from '../components/common/AnimatedButton';

export default function MyTripsPage() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [activeTab, setActiveTab] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTrips();
  }, [activeTab]);

  const loadTrips = async () => {
    setLoading(true);
    try {
      const res = await getTrips(activeTab === 'All' ? '' : activeTab);
      if (res.success) {
        setTrips(res.data || []);
      }
    } catch (err) {
      console.warn('Error loading trips:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (tripId, newStatus) => {
    try {
      await updateTrip(tripId, { status: newStatus });
      loadTrips();
    } catch (err) {
      console.warn('Status update error:', err);
    }
  };

  const handleDelete = async (tripId) => {
    if (!window.confirm('Are you sure you want to remove this trip?')) return;
    try {
      await deleteTrip(tripId);
      loadTrips();
    } catch (err) {
      console.warn('Trip delete error:', err);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Luggage className="w-3.5 h-3.5 text-cyan-400" />
            3D Itinerary Manager
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">My Trips & Itineraries</h1>
          <p className="text-sm text-slate-400 mt-1 max-w-xl">
            Monitor planned and booked journeys with continuous crowd forecasts and transit risk insights.
          </p>
        </div>

        <AnimatedButton
          onClick={() => navigate('/predict')}
          className="self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Trip Forecast</span>
        </AnimatedButton>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
        {['All', 'Upcoming', 'Saved', 'Completed', 'Cancelled'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === tab
                ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md shadow-cyan-500/20'
                : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Trip Cards Grid */}
      {loading ? (
        <div className="text-center py-12 text-slate-400 text-xs font-semibold">Loading itineraries...</div>
      ) : trips.length === 0 ? (
        <GlassCard className="p-12 text-center border border-slate-800 bg-slate-900/60 space-y-4">
          <Luggage className="w-12 h-12 text-cyan-400 mx-auto opacity-70" />
          <h3 className="text-lg font-bold text-white">No journeys found in this category</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Use the Travel Prediction engine to evaluate routes, forecast congestion, and save active itineraries.
          </p>
          <AnimatedButton
            onClick={() => navigate('/predict')}
            className="inline-flex mx-auto"
          >
            Start Prediction
          </AnimatedButton>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {trips.map((t) => (
            <TiltCard
              key={t._id}
              className="p-6 border border-slate-800 bg-slate-900/60 flex flex-col justify-between hover:border-cyan-500/40 transition-all space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Plane className="w-5 h-5 text-cyan-400" />
                    <span className="font-extrabold text-white text-lg">{t.origin}</span>
                    <span className="text-cyan-400 font-bold">→</span>
                    <span className="font-extrabold text-white text-lg">{t.destination}</span>
                  </div>
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                      t.status === 'Upcoming'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : t.status === 'Saved'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                        : t.status === 'Completed'
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    }`}
                  >
                    {t.status}
                  </span>
                </div>

                <div className="text-xs text-slate-400 flex flex-wrap items-center gap-3 font-medium">
                  <span className="flex items-center gap-1.5 font-bold text-slate-200">
                    <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                    {t.travelDate} {t.returnDate ? `to ${t.returnDate}` : ''}
                  </span>
                  <span>•</span>
                  <span className="uppercase font-semibold text-slate-400">{t.transportMode || 'Train'}</span>
                  <span>•</span>
                  <span>{t.passengers || 1} Traveler(s)</span>
                </div>

                {/* Demand & Risk Score Badges */}
                <div className="grid grid-cols-2 gap-2 text-xs py-2 border-y border-slate-800">
                  <div className="p-3 rounded-2xl bg-slate-800/50 border border-slate-700/50">
                    <span className="text-[10px] text-slate-400 block font-semibold">Travel Demand</span>
                    <span className="font-black text-cyan-400 text-sm">
                      {t.crowdLevel || 'HIGH'} ({t.demandScore || 82}%)
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-800/50 border border-slate-700/50">
                    <span className="text-[10px] text-slate-400 block font-semibold">Journey Risk</span>
                    <span className="font-black text-blue-400 text-sm">
                      {t.overallRiskLevel || 'MEDIUM'} ({t.overallRiskScore || 62}/100)
                    </span>
                  </div>
                </div>

                {t.notes && <p className="text-xs text-slate-300 italic bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/60">"{t.notes}"</p>}
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
                <button
                  onClick={() => navigate('/predict')}
                  className="font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>View Trip Forecast →</span>
                </button>

                <div className="flex items-center gap-2">
                  <select
                    value={t.status}
                    onChange={(e) => handleStatusChange(t._id, e.target.value)}
                    className="px-2.5 py-1 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold cursor-pointer focus:outline-none"
                  >
                    <option value="Upcoming">Upcoming</option>
                    <option value="Completed">Completed</option>
                    <option value="Saved">Saved</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>

                  <button
                    onClick={() => handleDelete(t._id)}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer border border-transparent hover:border-slate-700"
                    title="Delete Trip"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </TiltCard>
          ))}
        </div>
      )}
    </div>
  );
}
