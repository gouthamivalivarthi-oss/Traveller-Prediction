import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Calendar, Sparkles, ArrowRight, Trash2, MapPin } from 'lucide-react';
import { getTrips, deleteTrip } from '../services/api';
import GlassCard from '../components/common/GlassCard';
import TiltCard from '../components/common/TiltCard';
import AnimatedButton from '../components/common/AnimatedButton';

export default function SavedTripsPage() {
  const navigate = useNavigate();
  const [savedTrips, setSavedTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSaved();
  }, []);

  const loadSaved = async () => {
    try {
      const res = await getTrips('Saved');
      if (res.success) {
        setSavedTrips(res.data || []);
      }
    } catch (err) {
      console.warn('Error loading saved trips:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id) => {
    try {
      await deleteTrip(id);
      loadSaved();
    } catch (err) {}
  };

  return (
    <div className="space-y-8 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF7657]/10 border border-[#FF7657]/25 text-[#FF7657] text-xs font-bold uppercase tracking-wider mb-2">
            <Heart className="w-3.5 h-3.5 text-[#FF7657]" />
            Bookmarked Corridors
          </div>
          <h1 className="text-3xl font-extrabold text-[#34261F] tracking-tight">Saved Trips</h1>
          <p className="text-sm text-[#7A5843] mt-1 max-w-xl">
            Quickly access and re-run predictions for your favorite corridors and potential travel dates.
          </p>
        </div>

        <AnimatedButton
          onClick={() => navigate('/predict')}
          className="self-start sm:self-auto"
        >
          <Sparkles className="w-4 h-4" />
          <span>New Forecast</span>
        </AnimatedButton>
      </div>

      {savedTrips.length === 0 && !loading ? (
        <GlassCard className="p-12 text-center border border-[#F2DECC] space-y-4">
          <Heart className="w-12 h-12 text-[#FF9F43] mx-auto opacity-70" />
          <h3 className="text-lg font-bold text-[#34261F]">No saved trips yet</h3>
          <p className="text-xs text-[#7A5843] max-w-md mx-auto">
            Click "Save Trip" from the Journey Prediction page to bookmark your preferred travel routes.
          </p>
          <AnimatedButton
            onClick={() => navigate('/predict')}
            className="inline-flex mx-auto"
          >
            Predict & Bookmark
          </AnimatedButton>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {savedTrips.map((t) => (
            <TiltCard
              key={t._id}
              className="p-6 border border-[#F2DECC] flex flex-col justify-between hover:border-[#FF9F43] transition-all space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-[#34261F] text-base">
                    {t.origin} → {t.destination}
                  </span>
                  <button
                    onClick={() => handleRemove(t._id)}
                    className="p-1.5 rounded-xl text-[#7A5843] hover:text-[#FF7657] hover:bg-[#FFF8ED] transition-colors cursor-pointer"
                    title="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-[#7A5843] flex items-center gap-1.5 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-[#FF7657]" />
                  <span>Target Date: <strong>{t.travelDate}</strong></span>
                </p>
                <div className="p-3 rounded-2xl bg-[#FFF8ED] border border-[#F2DECC] text-xs">
                  <span className="font-extrabold text-[#FF7657] block">{t.crowdLevel || 'HIGH'} CROWD</span>
                  <span className="text-[11px] text-[#7A5843] font-medium">Predicted Demand: {t.demandScore || 82}%</span>
                </div>
              </div>

              <button
                onClick={() => navigate('/predict')}
                className="w-full py-2.5 rounded-xl bg-[#FFFDF8] hover:bg-[#FFF8ED] border border-[#F2DECC] hover:border-[#FF9F43] text-xs font-bold text-[#A85832] flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm"
              >
                <span>Re-Evaluate Live Risk</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#FF7657]" />
              </button>
            </TiltCard>
          ))}
        </div>
      )}
    </div>
  );
}

