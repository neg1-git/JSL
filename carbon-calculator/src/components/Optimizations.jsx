export default function Optimizations({ suggestions }) {
  if (suggestions.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-6 bg-accent-green rounded-full" />
          <h3 className="text-sm font-bold text-slate-300">🎯 Optimization Suggestions</h3>
        </div>
        <div className="text-center py-6">
          <span className="text-3xl">🏆</span>
          <p className="text-accent-green font-bold mt-2">Already optimized!</p>
          <p className="text-sm text-slate-400 mt-1">Your configuration is near the lowest achievable emissions.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-6 bg-accent-green rounded-full" />
        <h3 className="text-sm font-bold text-slate-300">🎯 Optimization Suggestions</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {suggestions.map((s, i) => (
          <div
            key={i}
            className="bg-surface-3/50 rounded-xl p-4 border border-slate-600/50 hover:border-accent-green/50 transition-all duration-200"
          >
            <div className="text-2xl mb-2">{s.icon}</div>
            <p className="text-sm font-semibold text-white">{s.action}</p>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-black text-accent-green">-{s.saving}t</span>
              <span className="text-sm text-accent-green font-bold">({s.savingPercent}%)</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">CO₂ reduction per tonne</p>
          </div>
        ))}
      </div>
    </div>
  );
}
