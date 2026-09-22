import { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = {
  rawMaterials: '#3B82F6',
  process: '#E87722',
  energy: '#EAB308',
  alloys: '#A855F7',
  scope1: '#E87722', // Match process color
  scope2: '#EAB308', // Match energy color
  scope3: '#A855F7', // Deep purple for massive scope 3
};

const LABELS = {
  rawMaterials: 'Raw Materials',
  process: 'Process Route',
  energy: 'Energy / Grid',
  alloys: 'Alloy Additions',
  scope1: 'Scope 1 (Direct)',
  scope2: 'Scope 2 (Indirect)',
  scope3: 'Scope 3 (Value Chain)',
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const d = payload[0].payload;
    return (
      <div className="glass-card rounded-lg px-3 py-2 text-sm">
        <p className="font-bold text-white">{d.label}</p>
        <p className="text-slate-300">{d.value} t CO₂ ({d.pct}%)</p>
      </div>
    );
  }
  return null;
};

export default function BreakdownChart({ breakdown, percentages, scopes, scopePercentages }) {
  const [view, setView] = useState('factors'); // 'factors' or 'scopes'

  const activeData = view === 'factors' ? breakdown : scopes;
  const activePercentages = view === 'factors' ? percentages : scopePercentages;

  const data = Object.entries(activeData).map(([key, value]) => ({
    name: key,
    label: LABELS[key],
    value,
    pct: activePercentages[key],
    color: COLORS[key],
  }));

  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-6 bg-accent-purple rounded-full" />
          <h3 className="text-sm font-bold text-slate-300">Emissions Breakdown</h3>
        </div>
        
        {/* Toggle Switch */}
        <div className="flex bg-slate-800/50 rounded-lg p-1">
          <button
            onClick={() => setView('factors')}
            className={`text-xs px-3 py-1 rounded-md font-semibold transition-colors ${
              view === 'factors' ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            By Factor
          </button>
          <button
            onClick={() => setView('scopes')}
            className={`text-xs px-3 py-1 rounded-md font-semibold transition-colors ${
              view === 'scopes' ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            By Scope
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="w-40 h-40">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={42}
                outerRadius={68}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={0}
              >
                {data.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex-1 space-y-2.5">
          {data.map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: item.color }} />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs font-medium text-slate-300 truncate">{item.label}</span>
                  <span className="text-xs font-bold text-white ml-2">{item.value}t</span>
                </div>
                <div className="w-full h-1.5 bg-slate-700 rounded-full mt-1">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${item.pct}%`, backgroundColor: item.color }}
                  />
                </div>
              </div>
              <span className="text-xs font-bold w-9 text-right" style={{ color: item.color }}>
                {item.pct}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
