import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Clock,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Sparkles,
  Train,
  Bus,
  Plane,
  Car,
  CheckCircle2,
  Footprints,
  Bike
} from 'lucide-react';
import TiltCard from '../components/common/TiltCard';
import AnimatedButton from '../components/common/AnimatedButton';
import RoutePath from '../components/three/RoutePath';
import { searchRoutes, compareTransportModes } from '../services/api';

const TRANSPORT_MODES_3D = [
  { id: 'train', name: 'Train', icon: Train, speed: 'Fast', cost: '₹350', comfort: 'High', delay: 'Medium' },
  { id: 'bus', name: 'Bus', icon: Bus, speed: 'Moderate', cost: '₹550', comfort: 'Medium', delay: 'High' },
  { id: 'flight', name: 'Flight', icon: Plane, speed: 'Ultra Fast', cost: '₹2,900', comfort: 'Very High', delay: 'Low' },
  { id: 'car', name: 'Car', icon: Car, speed: 'Flexible', cost: '₹2,600', comfort: 'High', delay: 'Medium' },
  { id: 'taxi', name: 'Taxi', icon: Car, speed: 'Door-to-Door', cost: '₹4,200', comfort: 'High', delay: 'Medium' },
  { id: 'walk', name: 'Walk', icon: Footprints, speed: 'Local', cost: '₹0', comfort: 'Active', delay: 'Low' },
  { id: 'cycle', name: 'Cycle', icon: Bike, speed: 'Short Distance', cost: '₹0', comfort: 'Active', delay: 'Low' }
];

export default function RoutePlannerPage() {
  const [origin, setOrigin] = useState('Hyderabad');
  const [destination, setDestination] = useState('Vijayawada');
  const [travelDate, setTravelDate] = useState('2026-10-20');
  const [departureTime, setDepartureTime] = useState('08:00');
  const [transportMode, setTransportMode] = useState('train');
  const [priority, setPriority] = useState('Balanced');

  const [loading, setLoading] = useState(false);
  const [routes, setRoutes] = useState([]);
  const [transportComparison, setTransportComparison] = useState(null);

  useEffect(() => {
    handleSearch();
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const rRes = await searchRoutes({
        origin,
        destination,
        travel_date: travelDate,
        departure_time: departureTime,
        transport_mode: transportMode,
        priority
      });
      if (rRes.success && rRes.data) {
        setRoutes(rRes.data.routes || []);
      }

      const cRes = await compareTransportModes({
        origin,
        destination,
        travel_date: travelDate
      });
      if (cRes.success && cRes.data) {
        setTransportComparison(cRes.data);
      }
    } catch (err) {}
    finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF9F43]/15 text-[#FF7657] text-xs font-bold uppercase tracking-wider mb-2">
          <MapPin className="w-3.5 h-3.5" />
          Smart Route Engine
        </div>
        <h1 className="text-3xl font-black text-[#34261F] tracking-tight">3D Route & Mode Planner</h1>
        <p className="text-sm text-[#5A4032] mt-1 max-w-xl">
          Multi-criteria route comparisons (Fastest, Cheapest, Least Crowded, Balanced) with dynamic cross-modal evaluations.
        </p>
      </div>

      {/* Input Form Card */}
      <TiltCard className="p-6 sm:p-8 border border-[#FF9F43]/30 bg-[#FFFDF8]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
          <div>
            <label className="text-xs font-bold text-[#5A4032] block mb-1">Origin</label>
            <input
              type="text"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8ED] border border-[#FF9F43]/30 text-sm font-semibold text-[#34261F] focus:outline-none focus:border-[#FF7657]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#5A4032] block mb-1">Destination</label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8ED] border border-[#FF9F43]/30 text-sm font-semibold text-[#34261F] focus:outline-none focus:border-[#FF7657]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#5A4032] block mb-1">Travel Date</label>
            <input
              type="date"
              value={travelDate}
              onChange={(e) => setTravelDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8ED] border border-[#FF9F43]/30 text-sm font-semibold text-[#34261F] focus:outline-none focus:border-[#FF7657]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#5A4032] block mb-1">Departure Time</label>
            <input
              type="time"
              value={departureTime}
              onChange={(e) => setDepartureTime(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8ED] border border-[#FF9F43]/30 text-sm font-semibold text-[#34261F] focus:outline-none focus:border-[#FF7657]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#5A4032] block mb-1">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8ED] border border-[#FF9F43]/30 text-sm font-semibold text-[#34261F] focus:outline-none focus:border-[#FF7657]"
            >
              <option value="Balanced">Balanced</option>
              <option value="Fastest">Fastest</option>
              <option value="Cheapest">Cheapest</option>
              <option value="Least Crowded">Least Crowded</option>
              <option value="Fewest Transfers">Fewest Transfers</option>
            </select>
          </div>

          <div className="flex items-end">
            <AnimatedButton
              onClick={handleSearch}
              disabled={loading}
              variant="primary"
              className="w-full text-xs py-3"
            >
              {loading ? 'Finding Routes...' : '✦ Plan Routes'}
            </AnimatedButton>
          </div>
        </div>
      </TiltCard>

      {/* 3D Map-Style Animated Route Track (Section 16: Origin ● ╲ ╲ ● Destination) */}
      <RoutePath origin={origin} destination={destination} status="Predicted Highway Corridor (NH65)" />

      {/* 3D Route Cards (Section 16: Fastest, Cheapest, Least Crowded, Balanced) */}
      <div className="space-y-4">
        <h3 className="text-xl font-black text-[#34261F] flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#FF7657]" />
          Route Alternatives for {origin} → {destination}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {routes.map((r, idx) => (
            <TiltCard
              key={idx}
              className="p-6 border border-[#FF9F43]/30 bg-[#FFFDF8] hover:border-[#FF7657] transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-[#FF9F43]/15 text-[#FF7657] uppercase tracking-wider">
                    {r.type}
                  </span>
                  <span
                    className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                      r.demand_level === 'HIGH' || r.demand_level === 'VERY HIGH'
                        ? 'bg-[#FF7657]/15 text-[#FF7657] border border-[#FF7657]/30'
                        : 'bg-[#FF9F43]/15 text-[#FF9F43] border border-[#FF9F43]/30'
                    }`}
                  >
                    {r.demand_level} CROWD
                  </span>
                </div>

                <h4 className="font-extrabold text-[#34261F] text-base">{r.name}</h4>

                <div className="grid grid-cols-2 gap-2 text-xs py-2 border-y border-[#FF9F43]/20">
                  <div>
                    <span className="text-[#8C7162] text-[10px] block">Duration</span>
                    <strong className="text-[#34261F] text-sm flex items-center gap-1 font-black">
                      <Clock className="w-3.5 h-3.5 text-[#FF7657]" /> {r.duration}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[#8C7162] text-[10px] block">Distance</span>
                    <strong className="text-[#34261F] text-sm font-black">{r.distance_km} km</strong>
                  </div>
                  <div>
                    <span className="text-[#8C7162] text-[10px] block">Estimated Cost</span>
                    <strong className="text-[#7BC67B] text-sm font-black">₹{r.estimated_cost}</strong>
                  </div>
                  <div>
                    <span className="text-[#8C7162] text-[10px] block">Delay Risk</span>
                    <strong className="text-[#FF9F43] text-sm font-black">{r.delay_risk}</strong>
                  </div>
                </div>

                <div className="space-y-1 text-xs">
                  <div className="text-[#7BC67B] flex items-center gap-1.5 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>{r.pros}</span>
                  </div>
                  <div className="text-[#5A4032] flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-[#FF9F43]" />
                    <span>{r.cons}</span>
                  </div>
                </div>
              </div>

              <AnimatedButton variant="secondary" className="w-full text-xs py-2.5">
                Select Route
              </AnimatedButton>
            </TiltCard>
          ))}
        </div>
      </div>

      {/* Section 17: 3D Transport Mode Cards */}
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-black text-[#34261F] flex items-center gap-2">
            <Train className="w-5 h-5 text-[#FF9F43]" />
            3D Floating Transport Mode Cards (Section 17)
          </h3>
          <p className="text-xs text-[#5A4032]">
            Hover over cards to see icon rotate, card rise in 3D, and expanded trade-offs appear
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {TRANSPORT_MODES_3D.map((m) => {
            const Icon = m.icon;
            return (
              <div
                key={m.id}
                className="group p-4 rounded-3xl glass-panel-warm border border-[#FF9F43]/30 hover:border-[#FF7657] text-center transition-all duration-300 transform hover:-translate-y-2 hover:shadow-[0_16px_32px_rgba(255,118,87,0.25)] cursor-pointer"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FFFDF8] to-[#FFF1DD] border border-[#FF9F43]/30 mx-auto flex items-center justify-center text-[#FF7657] shadow-sm group-hover:rotate-12 transition-transform duration-300">
                  <Icon className="w-6 h-6" />
                </div>

                <h5 className="font-extrabold text-[#34261F] text-xs mt-3">{m.name}</h5>
                <span className="text-[10px] font-bold text-[#FF9F43] block mt-0.5">{m.cost}</span>

                {/* Expanded info on hover */}
                <div className="mt-2 pt-2 border-t border-[#FF9F43]/20 text-[10px] text-[#5A4032] space-y-0.5 opacity-80 group-hover:opacity-100 transition-opacity">
                  <div>Speed: {m.speed}</div>
                  <div>Delay: {m.delay}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
