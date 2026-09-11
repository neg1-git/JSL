import { STEEL_GRADES, PROCESS_ROUTES } from '../emissionsModel';

export default function InputPanel({
  grade, setGrade,
  scrapPercent, setScrapPercent,
  processRoute, setProcessRoute,
  renewablePercent, setRenewablePercent,
  useNPI, setUseNPI,
}) {
  return (
    <div className="glass-card rounded-2xl p-6 space-y-6 sticky top-24">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-2 h-6 bg-brand rounded-full" />
        <h2 className="text-lg font-bold text-white">Configure Inputs</h2>
      </div>

      {/* Steel Grade */}
      <div>
        <label className="block text-sm font-semibold text-slate-300 mb-2">
          Steel Grade
        </label>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(STEEL_GRADES).map(([key, g]) => (
            <button
              key={key}
              onClick={() => setGrade(key)}
              className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border ${
                grade === key
                  ? 'bg-brand text-white border-brand shadow-lg shadow-brand/25'
                  : 'bg-surface-3/50 text-slate-300 border-slate-600/50 hover:border-brand/50 hover:bg-surface-3'
              }`}
            >
              <span className="font-bold">{g.name}</span>
              <span className="block text-xs opacity-70 mt-0.5">{g.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Scrap Ratio */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-semibold text-slate-300">
            ♻️ Scrap Ratio
          </label>
          <span className="text-2xl font-black text-brand">{scrapPercent}%</span>
        </div>
        <input
          type="range"
          min="0" max="100" step="5"
          value={scrapPercent}
          onChange={e => setScrapPercent(Number(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-slate-500 mt-1">
          <span>100% Virgin Ore</span>
          <span>100% Recycled Scrap</span>
        </div>
      </div>

      {/* Process Route */}
      <div>
        <label className="block text-sm font-semibold text-slate-300 mb-2">
          ⚡ Process Route
        </label>
        <div className="space-y-2">
          {Object.entries(PROCESS_ROUTES).map(([key, route]) => (
            <button
              key={key}
              onClick={() => setProcessRoute(key)}
              className={`w-full px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 text-left border ${
                processRoute === key
                  ? 'bg-brand text-white border-brand shadow-lg shadow-brand/25'
                  : 'bg-surface-3/50 text-slate-300 border-slate-600/50 hover:border-brand/50'
              }`}
            >
              <span className="font-bold">{key}</span>
              <span className="text-xs opacity-70 ml-2">{route.name.split('(')[0].trim()}</span>
              <span className={`float-right text-xs px-2 py-0.5 rounded-full ${
                route.ef < 1 ? 'bg-accent-green/20 text-accent-green' : 'bg-accent-red/20 text-accent-red'
              }`}>
                {route.ef} tCO₂
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Renewable Energy */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-semibold text-slate-300">
            ☀️ Renewable Energy
          </label>
          <span className="text-2xl font-black text-accent-green">{renewablePercent}%</span>
        </div>
        <input
          type="range"
          min="0" max="100" step="5"
          value={renewablePercent}
          onChange={e => setRenewablePercent(Number(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-slate-500 mt-1">
          <span>100% Grid (Coal)</span>
          <span>100% Solar/Wind</span>
        </div>
      </div>

      {/* NPI Toggle */}
      <div className="flex items-center justify-between p-3 rounded-xl bg-surface-3/50 border border-slate-600/50">
        <div>
          <span className="text-sm font-semibold text-slate-300">Nickel from NPI</span>
          <p className="text-xs text-slate-500 mt-0.5">Nickel Pig Iron (very high emissions)</p>
        </div>
        <button
          onClick={() => setUseNPI(!useNPI)}
          className={`w-14 h-7 rounded-full transition-all duration-300 relative ${
            useNPI ? 'bg-accent-red' : 'bg-slate-600'
          }`}
        >
          <div className={`w-5 h-5 rounded-full bg-white absolute top-1 transition-all duration-300 ${
            useNPI ? 'left-8' : 'left-1'
          }`} />
        </button>
      </div>
    </div>
  );
}
