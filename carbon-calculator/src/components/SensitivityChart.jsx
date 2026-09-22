import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import { calculateEmissions } from '../emissionsModel';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const d = payload[0].payload;
    return (
      <div className="glass-card rounded-lg px-3 py-2 text-sm">
        <p className="font-bold text-white">{d.name}</p>
        <p className="text-slate-300">
          {d.direction === 'decrease' ? '↓' : '↑'} {Math.abs(d.impact).toFixed(3)} t CO₂/t ({Math.abs(d.pct).toFixed(1)}%)
        </p>
        <p className="text-xs text-slate-400 mt-1">{d.description}</p>
      </div>
    );
  }
  return null;
};

export default function SensitivityChart({ currentParams, currentTotal }) {
  const sensitivities = useMemo(() => {
    const results = [];

    // Test: Scrap ratio +20% (or to 100 if near cap)
    const scrapUp = Math.min(currentParams.scrapPercent + 20, 100);
    if (scrapUp !== currentParams.scrapPercent) {
      const result = calculateEmissions({ ...currentParams, scrapPercent: scrapUp });
      const delta = result.total - currentTotal;
      results.push({
        name: `Scrap Ratio → ${scrapUp}%`,
        impact: delta,
        absImpact: Math.abs(delta),
        direction: delta < 0 ? 'decrease' : 'increase',
        description: `Change scrap from ${currentParams.scrapPercent}% to ${scrapUp}%`,
        lever: 'scrap',
      });
    }

    // Test: Scrap ratio -20% (or to 0 if near floor)
    const scrapDown = Math.max(currentParams.scrapPercent - 20, 0);
    if (scrapDown !== currentParams.scrapPercent) {
      const result = calculateEmissions({ ...currentParams, scrapPercent: scrapDown });
      const delta = result.total - currentTotal;
      results.push({
        name: `Scrap Ratio → ${scrapDown}%`,
        impact: delta,
        absImpact: Math.abs(delta),
        direction: delta < 0 ? 'decrease' : 'increase',
        description: `Change scrap from ${currentParams.scrapPercent}% to ${scrapDown}%`,
        lever: 'scrap',
      });
    }

    // Test: Renewables +30%
    const renewUp = Math.min(currentParams.renewablePercent + 30, 100);
    if (renewUp !== currentParams.renewablePercent) {
      const result = calculateEmissions({ ...currentParams, renewablePercent: renewUp });
      const delta = result.total - currentTotal;
      results.push({
        name: `Renewables → ${renewUp}%`,
        impact: delta,
        absImpact: Math.abs(delta),
        direction: delta < 0 ? 'decrease' : 'increase',
        description: `Change renewables from ${currentParams.renewablePercent}% to ${renewUp}%`,
        lever: 'renewable',
      });
    }

    // Test: Renewables -30%
    const renewDown = Math.max(currentParams.renewablePercent - 30, 0);
    if (renewDown !== currentParams.renewablePercent) {
      const result = calculateEmissions({ ...currentParams, renewablePercent: renewDown });
      const delta = result.total - currentTotal;
      results.push({
        name: `Renewables → ${renewDown}%`,
        impact: delta,
        absImpact: Math.abs(delta),
        direction: delta < 0 ? 'decrease' : 'increase',
        description: `Change renewables from ${currentParams.renewablePercent}% to ${renewDown}%`,
        lever: 'renewable',
      });
    }

    // Test: Toggle NPI
    const npiResult = calculateEmissions({ ...currentParams, useNPI: !currentParams.useNPI });
    const npiDelta = npiResult.total - currentTotal;
    if (Math.abs(npiDelta) > 0.001) {
      results.push({
        name: currentParams.useNPI ? 'Switch OFF NPI' : 'Switch ON NPI',
        impact: npiDelta,
        absImpact: Math.abs(npiDelta),
        direction: npiDelta < 0 ? 'decrease' : 'increase',
        description: currentParams.useNPI ? 'Switch from NPI to scrap-sourced Ni' : 'Switch from scrap-sourced Ni to NPI',
        lever: 'npi',
      });
    }

    // Test: Switch process routes
    const routes = ['EAF', 'BOF', 'IF'];
    routes.forEach(route => {
      if (route !== currentParams.processRoute) {
        const result = calculateEmissions({ ...currentParams, processRoute: route });
        const delta = result.total - currentTotal;
        results.push({
          name: `Switch to ${route}`,
          impact: delta,
          absImpact: Math.abs(delta),
          direction: delta < 0 ? 'decrease' : 'increase',
          description: `Change route from ${currentParams.processRoute} to ${route}`,
          lever: 'route',
        });
      }
    });

    // Sort by absolute impact (largest first = tornado shape)
    return results.sort((a, b) => b.absImpact - a.absImpact);
  }, [currentParams, currentTotal]);

  // Color mapping
  const getColor = (entry) => {
    if (entry.direction === 'decrease') return '#22C55E'; // green = reduction
    return '#EF4444'; // red = increase
  };

  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-6 bg-accent-yellow rounded-full" />
          <h3 className="text-sm font-bold text-slate-300">🌪️ Sensitivity Analysis</h3>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-accent-green inline-block" /> Reduces CO₂</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-accent-red inline-block" /> Increases CO₂</span>
        </div>
      </div>
      <p className="text-xs text-slate-500 mb-4">
        Impact of changing each lever individually from your current configuration. Baseline: <span className="text-white font-bold">{currentTotal.toFixed(2)} t CO₂/t</span>
      </p>

      <div className="w-full h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={sensitivities}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
          >
            <XAxis
              type="number"
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              tickFormatter={(v) => `${v > 0 ? '+' : ''}${v.toFixed(2)}t`}
              domain={['dataMin', 'dataMax']}
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fill: '#cbd5e1', fontSize: 11 }}
              width={140}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine x={0} stroke="#475569" strokeWidth={2} />
            <Bar dataKey="impact" radius={[0, 6, 6, 0]} barSize={24}>
              {sensitivities.map((entry, i) => (
                <Cell key={i} fill={getColor(entry)} fillOpacity={0.85} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Key takeaway */}
      {sensitivities.length > 0 && (
        <div className="mt-4 bg-surface-3/50 rounded-xl p-4 border border-accent-yellow/30">
          <p className="text-sm text-slate-300">
            <span className="text-accent-yellow font-bold">Key Insight:</span>{' '}
            <span className="text-white font-semibold">{sensitivities[0].name}</span> has the largest single-lever impact 
            ({sensitivities[0].direction === 'decrease' ? '↓' : '↑'}{sensitivities[0].absImpact.toFixed(2)} t CO₂/t, {((sensitivities[0].absImpact / currentTotal) * 100).toFixed(1)}% of baseline).
            {sensitivities[0].lever === 'npi' && ' This confirms that nickel sourcing strategy is the dominant decarbonization lever for stainless steel.'}
            {sensitivities[0].lever === 'route' && ' Process route selection is the dominant emissions driver for this configuration.'}
            {sensitivities[0].lever === 'scrap' && ' Scrap circularity is the dominant emissions driver for this configuration.'}
          </p>
        </div>
      )}
    </div>
  );
}
