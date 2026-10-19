import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  CheckCircle2,
  Bookmark,
  TrendingUp,
  Calendar
} from 'lucide-react';
import TiltCard from '../components/common/TiltCard';
import AnimatedButton from '../components/common/AnimatedButton';
import { predictTrip, compareDates, createTrip } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function PredictionPage() {
  const { user } = useAuth();

  const [origin, setOrigin] = useState('Hyderabad');
  const [destination, setDestination] = useState('Vijayawada');
  const [travelDate, setTravelDate] = useState('2026-10-20');
  const [returnDate, setReturnDate] = useState('2026-10-23');
  const [transportMode, setTransportMode] = useState('train');
  const [passengers, setPassengers] = useState(2);
  const [budget, setBudget] = useState('Medium');
  const [purpose, setPurpose] = useState('Festival');

  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [dateComparisons, setDateComparisons] = useState(null);
  const [advisorNotes, setAdvisorNotes] = useState([]);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    runFullPrediction();
  }, []);

  const runFullPrediction = async () => {
    setLoading(true);
    setSavedSuccess(false);
    try {
      const pRes = await predictTrip({
        origin,
        destination,
        travel_date: travelDate,
        return_date: returnDate,
        transport_mode: transportMode,
        passengers: parseInt(passengers, 10),
        budget,
        purpose,
        user_preference: user?.travel_preferences || ''
      });
      if (pRes.success && pRes.data) {
        setPrediction(pRes.data);
      }

      const dRes = await compareDates({
        origin,
        destination,
        target_date: travelDate,
        transport_mode: transportMode,
        passengers: parseInt(passengers, 10),
        day_range: 2
      });
      if (dRes.success && dRes.data) {
        setDateComparisons(dRes.data.comparisons);
        setAdvisorNotes(dRes.data.advisor_recommendation || []);
      }
    } catch (err) {
      console.warn('Prediction run error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTrip = async () => {
    if (!prediction) return;
    try {
      const res = await createTrip({
        origin,
        destination,
        travelDate,
        returnDate,
        transportMode,
        passengers: parseInt(passengers, 10),
        demandScore: prediction.demand_score,
        crowdLevel: prediction.crowd_level,
        delayRisk: prediction.delay_risk,
        priceRisk: prediction.price_risk,
        overallRiskScore: prediction.overall_risk_score,
        overallRiskLevel: prediction.overall_risk_level,
        status: 'Saved',
        notes: `Saved from Travel Prediction for ${travelDate}`
      });
      if (res.success) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch (err) {}
  };

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/15 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          Predictive Corridor Engine
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight">Travel Prediction Studio</h1>
        <p className="text-sm text-slate-400 mt-1 max-w-xl">
          Multi-factor machine learning evaluation forecasting transit demand, crowd density, delay probability, and surge fare risk.
        </p>
      </div>

      {/* Main 8-Factor Form Card */}
      <TiltCard className="p-6 sm:p-8 border border-slate-800 bg-[#0F172A]/90">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Origin</label>
            <input
              type="text"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm font-semibold text-white focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Destination</label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm font-semibold text-white focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Travel Date</label>
            <input
              type="date"
              value={travelDate}
              onChange={(e) => setTravelDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm font-semibold text-white focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Return Date</label>
            <input
              type="date"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm font-semibold text-white focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Transport Mode</label>
            <select
              value={transportMode}
              onChange={(e) => setTransportMode(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm font-semibold text-white focus:outline-none focus:border-blue-500 transition-colors"
            >
              <option value="train">Train</option>
              <option value="flight">Flight</option>
              <option value="bus">Bus</option>
              <option value="car">Personal Car</option>
              <option value="taxi">Taxi</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Passengers</label>
            <input
              type="number"
              min="1"
              max="8"
              value={passengers}
              onChange={(e) => setPassengers(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm font-semibold text-white text-center focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Budget Tier</label>
            <select
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm font-semibold text-white focus:outline-none focus:border-blue-500 transition-colors"
            >
              <option value="Economy">Economy</option>
              <option value="Medium">Medium</option>
              <option value="Premium">Premium</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Purpose</label>
            <input
              type="text"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm font-semibold text-white focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
          <span className="text-xs font-semibold text-slate-400">
            Trained on 10,950+ historical transit rows (Random Forest, R² = 0.970)
          </span>

          <AnimatedButton
            onClick={runFullPrediction}
            disabled={loading}
            variant="primary"
            className="w-full sm:w-auto text-sm px-7 py-3"
          >
            {loading ? 'Evaluating Prediction Model...' : '✦ Predict Travel Conditions'}
          </AnimatedButton>
        </div>
      </TiltCard>

      {/* Main Results Display */}
      {prediction && (
        <div className="space-y-8 animate-fadeIn">
          {/* Top Gauges Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <TiltCard className="p-6 border border-slate-800 bg-[#0F172A]/90">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Travel Demand Score
              </span>
              <div className="mt-3 flex items-baseline justify-between">
                <span className="text-4xl font-black text-white">{prediction.demand_score}%</span>
                <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-blue-500/15 text-cyan-400 border border-blue-500/30">
                  {prediction.crowd_level}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 mt-3 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full"
                  style={{ width: `${prediction.demand_score}%` }}
                />
              </div>
            </TiltCard>

            <TiltCard className="p-6 border border-slate-800 bg-[#0F172A]/90">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Crowd Risk</span>
              <span className="text-3xl font-black text-rose-400 mt-3 block">{prediction.crowd_level}</span>
              <span className="text-xs text-slate-400 mt-1 block">Heavy congestion expected</span>
            </TiltCard>

            <TiltCard className="p-6 border border-slate-800 bg-[#0F172A]/90">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Delay Risk</span>
              <span className="text-3xl font-black text-amber-400 mt-3 block">{prediction.delay_risk}</span>
              <span className="text-xs text-slate-400 mt-1 block">Buffer window: 25–40 mins</span>
            </TiltCard>

            <TiltCard className="p-6 border border-slate-800 bg-[#0F172A]/90">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Price Risk</span>
              <span className="text-3xl font-black text-cyan-400 mt-3 block">{prediction.price_risk}</span>
              <span className="text-xs text-slate-400 mt-1 block">Dynamic surge pricing active</span>
            </TiltCard>
          </div>

          {/* Feature Decomposition ("Why this prediction?") */}
          <TiltCard className="p-6 sm:p-8 border border-slate-800 bg-[#0F172A]/90">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
              <div>
                <h3 className="font-extrabold text-white text-lg flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-cyan-400" />
                  Why this prediction? (Measured Factor Contributions)
                </h3>
                <p className="text-xs text-slate-400">
                  Transparent mathematical decomposition explaining how factors composite the demand score
                </p>
              </div>
              <span className="text-xs font-black px-3 py-1 rounded-xl bg-blue-500/15 text-cyan-400 border border-blue-500/30">
                Final Score: {prediction.demand_score}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {prediction.explanation?.contributions?.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between"
                >
                  <div>
                    <span className="text-xs font-bold text-slate-200 block">{item.factor}</span>
                    <span className="text-[10px] text-slate-400">Measured Impact: {item.impact}</span>
                  </div>
                  <span className="text-sm font-black text-cyan-400 px-2 py-0.5 rounded bg-slate-800 border border-slate-700 shadow-sm">
                    {item.points}
                  </span>
                </div>
              ))}
            </div>
          </TiltCard>

          {/* Alternative Date Cards */}
          {dateComparisons && (
            <div className="space-y-4">
              <div>
                <h3 className="font-black text-white text-xl flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-cyan-400" />
                  Compare Nearby Travel Dates (-2 to +2 Days)
                </h3>
                <p className="text-xs text-slate-400">
                  Direct predictions evaluated on nearby dates to find less congested and cheaper travel windows
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {dateComparisons.map((c, idx) => {
                  const isHigh = c.crowd_level === 'HIGH' || c.crowd_level === 'VERY HIGH';
                  const isMedium = c.crowd_level === 'MEDIUM';
                  return (
                    <TiltCard
                      key={idx}
                      onClick={() => {
                        setTravelDate(c.date);
                        runFullPrediction();
                      }}
                      className={`p-5 text-center border transition-all cursor-pointer ${
                        c.is_selected
                          ? 'border-cyan-400 bg-slate-800/90 ring-2 ring-cyan-500/40 shadow-xl'
                          : 'border-slate-800 bg-[#0F172A]/90 hover:border-blue-500/60'
                      }`}
                    >
                      <span className="text-xs font-black text-white block">
                        {c.display_date || c.date}
                      </span>

                      <div className="my-3">
                        <span
                          className={`text-2xl block ${
                            isHigh ? 'text-rose-400' : isMedium ? 'text-amber-400' : 'text-emerald-400'
                          }`}
                        >
                          {isHigh ? '🔴' : isMedium ? '🟠' : '🟢'}
                        </span>
                        <span
                          className={`text-xs font-extrabold uppercase mt-1 block ${
                            isHigh ? 'text-rose-400' : isMedium ? 'text-amber-400' : 'text-emerald-400'
                          }`}
                        >
                          {c.crowd_level}
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-300 font-semibold space-y-0.5 border-t border-slate-800 pt-2">
                        <div>Demand: <strong>{c.demand_score}%</strong></div>
                        <div>Delay: <strong>{c.delay_risk}</strong></div>
                      </div>

                      {c.is_selected && (
                        <span className="mt-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/15 text-cyan-400 block border border-blue-500/30">
                          Current Date
                        </span>
                      )}
                    </TiltCard>
                  );
                })}
              </div>
            </div>
          )}

          {/* Smart Travel Advisor Recommendations & Save Trip */}
          <TiltCard className="p-6 sm:p-8 border border-slate-800 bg-[#0F172A]/90 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                Smart Travel Advisor Suggestions
              </h3>
              <ul className="text-xs text-slate-300 space-y-1.5 font-medium">
                {prediction.recommendations?.map((r, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    <span>{r}</span>
                  </li>
                ))}
                {advisorNotes?.map((n, idx) => (
                  <li key={`adv_${idx}`} className="flex items-center gap-2 text-emerald-400 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>{n}</span>
                  </li>
                ))}
              </ul>
            </div>

            <AnimatedButton
              onClick={handleSaveTrip}
              variant="primary"
              className="text-xs px-6 py-3 shrink-0"
            >
              <Bookmark className="w-4 h-4" />
              <span>{savedSuccess ? 'Saved to My Trips!' : 'Save This Journey'}</span>
            </AnimatedButton>
          </TiltCard>
        </div>
      )}
    </div>
  );
}
