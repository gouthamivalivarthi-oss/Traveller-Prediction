import React, { useState, useEffect } from 'react';
import {
  CalendarDays,
  Calendar,
  MapPin,
  Plus,
  X
} from 'lucide-react';
import TiltCard from '../components/common/TiltCard';
import AnimatedButton from '../components/common/AnimatedButton';
import { getHolidays, createHoliday } from '../services/api';

export default function HolidaysPage() {
  const [holidays, setHolidays] = useState([]);
  const [events, setEvents] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // New Holiday form state
  const [newName, setNewName] = useState('');
  const [newDate, setNewDate] = useState('2026-11-20');
  const [newEndDate, setNewEndDate] = useState('2026-11-22');
  const [newLocation, setNewLocation] = useState('National Transit Hubs');
  const [newType, setNewType] = useState('festival');
  const [newImportance, setNewImportance] = useState('high');
  const [newDesc, setNewDesc] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const res = await getHolidays();
      if (res.success) {
        setHolidays(res.holidays || []);
        setEvents(res.events || []);
        if (res.holidays?.length > 0) {
          setSelectedItem(res.holidays[0]);
        }
      }
    } catch (err) {}
  };

  const handleAddHoliday = async (e) => {
    e.preventDefault();
    if (!newName || !newDate) return;
    try {
      const res = await createHoliday({
        name: newName,
        date: newDate,
        endDate: newEndDate,
        location: newLocation,
        type: newType,
        importance: newImportance,
        description: newDesc
      });
      if (res.success) {
        setShowModal(false);
        loadData();
      }
    } catch (err) {}
  };

  const combined = [
    ...holidays.map((h) => ({ ...h, category: 'Holiday' })),
    ...events.map((e) => ({ ...e, category: 'Event' }))
  ];

  const filtered = combined.filter((item) => {
    if (filterType === 'all') return true;
    if (filterType === 'festival') return item.type === 'festival' || item.type === 'cultural_religious';
    if (filterType === 'long_weekend') return item.name.toLowerCase().includes('weekend') || item.type === 'long_weekend';
    if (filterType === 'holiday') return item.type === 'holiday';
    return true;
  });

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/15 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">
            <CalendarDays className="w-3.5 h-3.5" />
            Holiday & Event Engine
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">3D Holiday Calendar</h1>
          <p className="text-sm text-slate-400 mt-1 max-w-xl">
            Detecting festival periods, religious pilgrimages, and long weekends with measured crowd influence factors.
          </p>
        </div>

        <AnimatedButton
          onClick={() => setShowModal(true)}
          variant="primary"
          className="text-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Holiday</span>
        </AnimatedButton>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
        {[
          { id: 'all', label: 'All Dates & Events' },
          { id: 'festival', label: 'Festivals & Pilgrimages' },
          { id: 'long_weekend', label: 'Long Weekends' },
          { id: 'holiday', label: 'National Holidays' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterType(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterType === tab.id
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md shadow-blue-500/25'
                : 'bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 3D Floating Calendar Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filtered.map((item, idx) => {
              const isSelected = selectedItem?.name === item.name;
              const isHigh = item.importance === 'high' || item.type === 'festival';
              return (
                <TiltCard
                  key={idx}
                  onClick={() => setSelectedItem(item)}
                  className={`p-5 transition-all cursor-pointer ${
                    isSelected
                      ? 'border-cyan-400 bg-slate-800/90 ring-2 ring-cyan-500/40 shadow-xl'
                      : 'border-slate-800 bg-[#0F172A]/90 hover:border-blue-500/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-cyan-400 flex items-center gap-1.5 uppercase">
                      <Calendar className="w-3.5 h-3.5" />
                      {item.date}
                    </span>
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                        isHigh
                          ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                          : 'bg-blue-500/15 text-cyan-400 border border-blue-500/30'
                      }`}
                    >
                      {isHigh ? 'HIGH DEMAND' : 'MEDIUM'}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-white text-base mt-2">{item.name}</h3>

                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-blue-400" />
                    <span>{item.location}</span>
                  </p>

                  <p className="text-xs text-slate-300 mt-2 line-clamp-2">
                    {item.description || 'Elevated passenger demand anticipated across transit routes.'}
                  </p>
                </TiltCard>
              );
            })}
          </div>
        </div>

        {/* Selected Holiday Impact Details */}
        <div className="space-y-4">
          {selectedItem && (
            <TiltCard className="p-6 border border-slate-800 bg-[#0F172A]/90 space-y-4 sticky top-24">
              <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-blue-500/15 text-cyan-400 uppercase tracking-wider block w-fit border border-blue-500/30">
                Holiday Prediction Factor
              </span>

              <h3 className="text-xl font-black text-white">{selectedItem.name}</h3>

              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-bold">Demand Influence:</span>
                  <span className="font-black text-rose-400">HIGH (+25 Points)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-bold">Corridor Risk:</span>
                  <span className="font-black text-amber-400">ELEVATED (84%)</span>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-300">
                <strong className="text-white block text-xs uppercase tracking-wider">
                  Transit Window Guidance:
                </strong>
                <p className="leading-relaxed">
                  Avoid departing during evening peak hours. Shifting travel by 24–48 hours significantly reduces ticket surge prices and terminal queues.
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-500">
                <em>Note: Holiday effect is treated as one normalized model feature, not an automatic binary crowd guarantee.</em>
              </div>
            </TiltCard>
          )}
        </div>
      </div>

      {/* Add Holiday Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl bg-[#0F172A] p-6 sm:p-8 border border-slate-700 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-black text-white text-lg">Add Custom Holiday or Event</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddHoliday} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 font-bold block mb-1">Holiday / Event Name</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. State Festival"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm font-semibold text-white focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Start Date</label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm font-semibold text-white focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-bold block mb-1">End Date</label>
                  <input
                    type="date"
                    value={newEndDate}
                    onChange={(e) => setNewEndDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm font-semibold text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Location</label>
                  <input
                    type="text"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm font-semibold text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Category Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm font-semibold text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="festival">Festival</option>
                    <option value="holiday">Holiday</option>
                    <option value="long_weekend">Long Weekend</option>
                    <option value="event">Major Event</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <AnimatedButton type="submit" variant="primary" className="text-xs px-5 py-2.5">
                  Save Holiday
                </AnimatedButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
