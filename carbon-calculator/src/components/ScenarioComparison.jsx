import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { STEEL_GRADES, PROCESS_ROUTES } from '../emissionsModel';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card rounded-lg px-3 py-2 text-sm">
        <p className="font-bold text-white">{payload[0].payload.name}</p>
        <p className="text-slate-300">{payload[0].value.toFixed(2)} t CO₂/t</p>
      </div>
    );
  }
  return null;
};

export default function ScenarioComparison({
  resultA, resultB, paramsA, scenarioB, setScenarioB,
  showScenarioB, setShowScenarioB,
}) {
  const reduction = resultA.total - resultB.total;
  const reductionPct = ((reduction / resultA.total) * 100);

  if (!showScenarioB) {
    return (
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-6 bg-accent-cyan rounded-full" />
            <h3 className="text-sm font-bold text-slate-300">📊 Scenario Comparison</h3>
          </div>
          <button
            onClick={() => setShowScenarioB(true)}
            className="px-5 py-2.5 bg-brand text-white rounded-xl font-bold text-sm hover:bg-brand-dark transition-all shadow-lg shadow-brand/25"
          >
            + Add Scenario B
          </button>
        </div>
        <p className="text-sm text-slate-400 mt-2">
          Compare two configurations side-by-side to measure potential CO₂ reductions.
        </p>
      </div>
    );
  }

  const chartData = [
    { name: 'Raw Materials', A: resultA.breakdown.rawMaterials, B: resultB.breakdown.rawMaterials },
    { name: 'Process', A: resultA.breakdown.process, B: resultB.breakdown.process },
    { name: 'Energy', A: resultA.breakdown.energy, B: resultB.breakdown.energy },
    { name: 'Alloys', A: resultA.breakdown.alloys, B: resultB.breakdown.alloys },
  ];

  const totalChart = [
    { name: 'Scenario A\n(Current)', value: resultA.total },
    { name: 'Scenario B\n(Optimized)', value: resultB.total },
  ];

  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-2 h-6 bg-accent-cyan rounded-full" />
          <h3 className="text-sm font-bold text-slate-300">📊 Scenario Comparison</h3>
        </div>
        <button
          onClick={() => setShowScenarioB(false)}
          className="px-4 py-2 bg-surface-3 text-slate-300 rounded-xl font-medium text-sm hover:bg-slate-600 transition-all border border-slate-600"
        >
          Close
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scenario B Config */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-accent-cyan">Scenario B Configuration</h4>

          <div>
            <label className="text-xs text-slate-400 mb-1 block">Steel Grade</label>
            <select
              value={scenarioB.grade}
              onChange={e => setScenarioB({ ...scenarioB, grade: e.target.value })}
              className="w-full bg-surface-3 text-white rounded-lg px-3 py-2 text-sm border border-slate-600"
            >
              {Object.entries(STEEL_GRADES).map(([key, g]) => (
                <option key={key} value={key}>{g.name}</option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex justify-between">
              <label className="text-xs text-slate-400">Scrap Ratio</label>
              <span className="text-sm font-bold text-brand">{scenarioB.scrapPercent}%</span>
            </div>
            <input
              type="range" min="0" max="100" step="5"
              value={scenarioB.scrapPercent}
              onChange={e => setScenarioB({ ...scenarioB, scrapPercent: Number(e.target.value) })}
              className="w-full mt-1"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400 mb-1 block">Process Route</label>
            <select
              value={scenarioB.processRoute}
              onChange={e => setScenarioB({ ...scenarioB, processRoute: e.target.value })}
              className="w-full bg-surface-3 text-white rounded-lg px-3 py-2 text-sm border border-slate-600"
            >
              {Object.entries(PROCESS_ROUTES).map(([key, r]) => (
                <option key={key} value={key}>{key} — {r.name}</option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex justify-between">
              <label className="text-xs text-slate-400">Renewable %</label>
              <span className="text-sm font-bold text-accent-green">{scenarioB.renewablePercent}%</span>
            </div>
            <input
              type="range" min="0" max="100" step="5"
              value={scenarioB.renewablePercent}
              onChange={e => setScenarioB({ ...scenarioB, renewablePercent: Number(e.target.value) })}
              className="w-full mt-1"
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={scenarioB.useNPI}
              onChange={e => setScenarioB({ ...scenarioB, useNPI: e.target.checked })}
              className="w-4 h-4 rounded accent-brand"
            />
            <span className="text-xs text-slate-400">Use NPI Nickel</span>
          </label>
        </div>

        {/* Total comparison bar chart */}
        <div className="flex flex-col items-center justify-center">
          <div className="w-full h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={totalChart} barGap={8}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={60}>
                  <Cell fill="#E87722" />
                  <Cell fill="#22C55E" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Reduction badge */}
          <div className={`mt-4 px-6 py-3 rounded-2xl text-center ${
            reduction > 0 ? 'bg-accent-green/10 border border-accent-green/30' : 'bg-accent-red/10 border border-accent-red/30'
          }`}>
            <span className={`text-3xl font-black ${reduction > 0 ? 'text-accent-green' : 'text-accent-red'}`}>
              {reduction > 0 ? '↓' : '↑'} {Math.abs(reductionPct).toFixed(1)}%
            </span>
            <p className="text-xs text-slate-400 mt-1">
              {reduction > 0 ? `Saves ${Math.abs(reduction).toFixed(2)} t CO₂/t` : `Adds ${Math.abs(reduction).toFixed(2)} t CO₂/t`}
            </p>
          </div>
        </div>

        {/* Side-by-side numbers table */}
        <div>
          <h4 className="text-sm font-bold text-slate-300 mb-3">Side-by-Side Breakdown</h4>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left text-xs text-slate-500 pb-2">Metric</th>
                <th className="text-right text-xs text-brand pb-2">A (Current)</th>
                <th className="text-right text-xs text-accent-green pb-2">B (Optimized)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              <tr>
                <td className="py-2 text-slate-400">Raw Materials</td>
                <td className="py-2 text-right font-mono text-white">{resultA.breakdown.rawMaterials}t</td>
                <td className="py-2 text-right font-mono text-white">{resultB.breakdown.rawMaterials}t</td>
              </tr>
              <tr>
                <td className="py-2 text-slate-400">Process</td>
                <td className="py-2 text-right font-mono text-white">{resultA.breakdown.process}t</td>
                <td className="py-2 text-right font-mono text-white">{resultB.breakdown.process}t</td>
              </tr>
              <tr>
                <td className="py-2 text-slate-400">Energy</td>
                <td className="py-2 text-right font-mono text-white">{resultA.breakdown.energy}t</td>
                <td className="py-2 text-right font-mono text-white">{resultB.breakdown.energy}t</td>
              </tr>
              <tr>
                <td className="py-2 text-slate-400">Alloys</td>
                <td className="py-2 text-right font-mono text-white">{resultA.breakdown.alloys}t</td>
                <td className="py-2 text-right font-mono text-white">{resultB.breakdown.alloys}t</td>
              </tr>
              <tr className="font-bold">
                <td className="py-2 text-white">TOTAL</td>
                <td className="py-2 text-right text-brand">{resultA.total}t</td>
                <td className="py-2 text-right text-accent-green">{resultB.total}t</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
