import { getBenchmarks } from '../emissionsModel';

export default function BenchmarkBar({ total }) {
  const benchmarks = getBenchmarks();
  const maxVal = 5;

  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-6 bg-accent-blue rounded-full" />
        <h3 className="text-sm font-bold text-slate-300">Industry Benchmarks</h3>
      </div>

      <div className="space-y-3">
        {/* Your result */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-bold text-brand">🏭 Your Config</span>
            <span className="text-sm font-black text-brand">{total.toFixed(2)} t</span>
          </div>
          <div className="w-full h-4 bg-slate-700 rounded-full overflow-hidden relative">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand-dark to-brand transition-all duration-500"
              style={{ width: `${Math.min((total / maxVal) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* Benchmarks */}
        {benchmarks.map((b) => (
          <div key={b.name}>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-medium text-slate-400">{b.name}</span>
              <span className="text-xs font-bold" style={{ color: b.color }}>
                {b.value} t
              </span>
            </div>
            <div className="w-full h-2.5 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${(b.value / maxVal) * 100}%`,
                  backgroundColor: b.color,
                  opacity: 0.7,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Scale */}
      <div className="flex justify-between mt-3 px-1">
        <span className="text-xs text-slate-600">0</span>
        <span className="text-xs text-slate-600">1</span>
        <span className="text-xs text-slate-600">2</span>
        <span className="text-xs text-slate-600">3</span>
        <span className="text-xs text-slate-600">4</span>
        <span className="text-xs text-slate-600">5</span>
      </div>
    </div>
  );
}
