export default function EnergyCard({ energyGJ }) {
  const maxGJ = 25;
  const pct = Math.min((energyGJ / maxGJ) * 100, 100);

  const getColor = (val) => {
    if (val <= 8) return '#22C55E';
    if (val <= 14) return '#EAB308';
    return '#EF4444';
  };

  const color = getColor(energyGJ);

  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-6 bg-accent-cyan rounded-full" />
        <h3 className="text-sm font-bold text-slate-300">Energy Consumption</h3>
      </div>

      <div className="flex items-end gap-4">
        <div>
          <span className="text-4xl font-black" style={{ color }}>{energyGJ}</span>
          <span className="text-lg text-slate-400 ml-1 font-medium">GJ/t</span>
        </div>
      </div>

      <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden mt-4">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-xs text-slate-600">0</span>
        <span className="text-xs text-slate-600">25 GJ/t</span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="bg-surface-3/50 rounded-lg p-3">
          <p className="text-xs text-slate-500">Electricity</p>
          <p className="text-lg font-bold text-accent-yellow">
            {(energyGJ * 0.3).toFixed(1)} <span className="text-xs text-slate-400">GJ</span>
          </p>
        </div>
        <div className="bg-surface-3/50 rounded-lg p-3">
          <p className="text-xs text-slate-500">Thermal / Fuel</p>
          <p className="text-lg font-bold text-accent-red">
            {(energyGJ * 0.7).toFixed(1)} <span className="text-xs text-slate-400">GJ</span>
          </p>
        </div>
      </div>
    </div>
  );
}
