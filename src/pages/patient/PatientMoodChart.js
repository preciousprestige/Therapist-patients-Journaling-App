import React, { useEffect, useState } from 'react';
import { moodAPI } from '../../services/api';

const MOODS = { great: 5, good: 4, okay: 3, low: 2, terrible: 1 };
const MOOD_LABEL = { 5: 'Great', 4: 'Good', 3: 'Okay', 2: 'Low', 1: 'Terrible' };
const MOOD_EMOJI = { great: '😄', good: '🙂', okay: '😐', low: '😔', terrible: '😢' };
const MOOD_COLOR = { great: '#10b981', good: '#527f52', okay: '#f59e0b', low: '#f97316', terrible: '#e05555' };

export default function PatientMoodChart() {
  const [moods, setMoods] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try { const r = await moodAPI.getAll(); setMoods((r.data || []).reverse()); } catch { }
      setLoading(false);
    };
    load();
  }, []);

  // Last 14 entries for chart
  const chartData = moods.slice(-14);
  const maxVal = 5;
  const chartH = 160;

  // Stats
  const counts = moods.reduce((acc, m) => { acc[m.mood] = (acc[m.mood] || 0) + 1; return acc; }, {});
  const mostFrequent = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  const avgScore = moods.length ? (moods.reduce((s, m) => s + (MOODS[m.mood] || 3), 0) / moods.length).toFixed(1) : null;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-stone-800">Mood Trends</h1>
        <p className="text-stone-500 text-sm mt-1">Visual overview of your emotional wellbeing over time</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          <div className="h-48 bg-white rounded-2xl border border-stone-100 animate-pulse" />
          <div className="h-24 bg-white rounded-2xl border border-stone-100 animate-pulse" />
        </div>
      ) : moods.length < 2 ? (
        <div className="card p-16 text-center">
          <span className="text-5xl">📊</span>
          <p className="font-display font-semibold text-stone-600 mt-4">Not enough data yet</p>
          <p className="text-stone-400 text-sm mt-1">Do a few more mood check-ins to see your trend chart</p>
        </div>
      ) : (
        <>
          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="card p-4 text-center">
              <p className="text-2xl font-display font-bold text-stone-800">{moods.length}</p>
              <p className="text-xs text-stone-400 mt-0.5">Total Check-ins</p>
            </div>
            <div className="card p-4 text-center">
              <p className="text-2xl font-display font-bold text-stone-800">{avgScore}</p>
              <p className="text-xs text-stone-400 mt-0.5">Avg Mood Score</p>
            </div>
            <div className="card p-4 text-center">
              <p className="text-2xl">{mostFrequent ? MOOD_EMOJI[mostFrequent[0]] : '—'}</p>
              <p className="text-xs text-stone-400 mt-0.5">Most Common</p>
            </div>
          </div>

          {/* Line chart (SVG) */}
          <div className="card p-6 mb-6">
            <h2 className="font-display font-semibold text-stone-800 mb-4">Last {chartData.length} Check-ins</h2>
            {chartData.length > 1 && (() => {
              const w = 100 / (chartData.length - 1);
              const points = chartData.map((m, i) => {
                const x = i * w;
                const y = chartH - ((MOODS[m.mood] || 3) / maxVal) * chartH;
                return { x, y, mood: m.mood, date: m.createdAt };
              });
              const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
              const areaD = `${pathD} L ${points[points.length-1].x} ${chartH} L 0 ${chartH} Z`;

              return (
                <div className="relative">
                  {/* Y axis labels */}
                  <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-stone-400 -translate-x-2" style={{ height: chartH }}>
                    {[5,4,3,2,1].map(v => <span key={v} className="leading-none">{MOOD_LABEL[v]}</span>)}
                  </div>
                  <div className="pl-12">
                    <svg viewBox={`0 0 100 ${chartH}`} className="w-full" preserveAspectRatio="none" style={{ height: chartH }}>
                      {/* Grid lines */}
                      {[1,2,3,4,5].map(v => (
                        <line key={v} x1="0" y1={chartH - (v/maxVal)*chartH} x2="100" y2={chartH - (v/maxVal)*chartH}
                          stroke="#f1f5f9" strokeWidth="0.5" />
                      ))}
                      {/* Area fill */}
                      <path d={areaD} fill="#527f52" fillOpacity="0.08" />
                      {/* Line */}
                      <path d={pathD} fill="none" stroke="#527f52" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
                      {/* Dots */}
                      {points.map((p, i) => (
                        <circle key={i} cx={p.x} cy={p.y} r="1.8" fill={MOOD_COLOR[p.mood] || '#527f52'} stroke="white" strokeWidth="0.8" />
                      ))}
                    </svg>
                    {/* X axis dates */}
                    <div className="flex justify-between mt-2">
                      {chartData.map((m, i) => (
                        <span key={i} className="text-xs text-stone-400" style={{ width: `${100/chartData.length}%`, textAlign: 'center' }}>
                          {m.createdAt ? new Date(m.createdAt).toLocaleDateString('en-PH', { month: 'short', day: 'numeric' }) : ''}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Mood breakdown */}
          <div className="card p-6">
            <h2 className="font-display font-semibold text-stone-800 mb-4">Mood Breakdown</h2>
            <div className="space-y-3">
              {Object.entries(MOODS).map(([mood, score]) => {
                const count = counts[mood] || 0;
                const pct = moods.length ? Math.round((count / moods.length) * 100) : 0;
                return (
                  <div key={mood} className="flex items-center gap-3">
                    <span className="text-xl w-8 flex-shrink-0">{MOOD_EMOJI[mood]}</span>
                    <span className="text-sm font-semibold text-stone-700 w-16 capitalize">{mood}</span>
                    <div className="flex-1 bg-stone-100 rounded-full h-2 overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: MOOD_COLOR[mood] }} />
                    </div>
                    <span className="text-xs text-stone-400 w-8 text-right">{pct}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
