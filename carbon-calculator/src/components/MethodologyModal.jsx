import { useState } from 'react';
import { createPortal } from 'react-dom';

export default function MethodologyModal() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-xs px-3 py-1.5 rounded-full bg-slate-700/50 text-slate-300 font-semibold border border-slate-600/50 hover:border-brand/50 hover:text-white transition-all flex items-center gap-1.5"
      >
        <span className="text-sm">ℹ️</span> Methodology
      </button>

      {open && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/* Modal */}
          <div className="relative bg-surface border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl">
            {/* Header */}
            <div className="sticky top-0 bg-surface border-b border-slate-700 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-lg font-bold text-white">📐 Methodology & Assumptions</h2>
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 rounded-lg bg-slate-700 text-slate-300 hover:text-white hover:bg-slate-600 transition-colors flex items-center justify-center text-lg"
              >
                ×
              </button>
            </div>

            {/* Content */}
            <div className="px-6 py-5 space-y-6 text-sm text-slate-300 leading-relaxed">
              
              {/* The Model */}
              <section>
                <h3 className="text-base font-bold text-brand mb-2">The 4-Term Emissions Model</h3>
                <div className="bg-surface-3/50 rounded-xl p-4 border border-slate-600/50 font-mono text-center text-white mb-3">
                  Total CO₂ = Raw Materials + Process Route + Energy/Grid + <span className="text-accent-purple font-bold">Alloy Additions</span>
                </div>
                <p>
                  Unlike generic 3-term carbon steel calculators, our model includes a dedicated <strong className="text-accent-purple">Alloy Additions</strong> term 
                  that isolates the emissions from ferrochrome, ferronickel, and ferromolybdenum sourcing — the dominant cost driver 
                  for stainless steel grades.
                </p>
              </section>

              {/* Academic Basis */}
              <section>
                <h3 className="text-base font-bold text-brand mb-2">Academic Validation</h3>
                <div className="space-y-3">
                  <div className="bg-surface-3/50 rounded-xl p-4 border border-slate-600/50">
                    <p className="text-xs text-brand font-semibold mb-1">ACS Sustainable Resource Management (2026)</p>
                    <p>Cradle-to-gate LCA of EAF stainless steelmaking confirms raw material consumption drives <strong className="text-white">&gt;90%</strong> of total environmental impact across all five stainless families (austenitic, ferritic, martensitic, duplex, precipitation-hardening).</p>
                  </div>
                  <div className="bg-surface-3/50 rounded-xl p-4 border border-slate-600/50">
                    <p className="text-xs text-brand font-semibold mb-1">ScienceDirect — Composition in LCA of Steel Grades</p>
                    <p>Alloying-element content ranges (3–8% variability for stainless vs. 0.5–3% for carbon steel) create real uncertainty. Our model uses midpoint emission factors — outputs are optimized baselines, not certified LCA figures.</p>
                  </div>
                  <div className="bg-surface-3/50 rounded-xl p-4 border border-slate-600/50">
                    <p className="text-xs text-brand font-semibold mb-1">Norgate et al. (2007) via MDPI Review (2022)</p>
                    <p>Independent LCA pegs stainless-from-EAF at 6.8 t CO₂/t (cradle-to-gate). Our lower range (1.96–3.15t) reflects a narrower system boundary focused on controllable Scope 1/2 and direct Scope 3 alloy sourcing.</p>
                  </div>
                </div>
              </section>

              {/* Scope Mapping */}
              <section>
                <h3 className="text-base font-bold text-brand mb-2">GHG Protocol Scope Mapping</h3>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-surface-3/50 rounded-xl p-3 border border-brand/30 text-center">
                    <p className="text-xs text-brand font-bold mb-1">Scope 1</p>
                    <p className="text-white font-semibold text-sm">Direct</p>
                    <p className="text-xs mt-1">Process route combustion (EAF/BOF/IF on-site emissions)</p>
                  </div>
                  <div className="bg-surface-3/50 rounded-xl p-3 border border-accent-yellow/30 text-center">
                    <p className="text-xs text-accent-yellow font-bold mb-1">Scope 2</p>
                    <p className="text-white font-semibold text-sm">Indirect</p>
                    <p className="text-xs mt-1">Purchased electricity × grid emission factor (CEA India)</p>
                  </div>
                  <div className="bg-surface-3/50 rounded-xl p-3 border border-accent-purple/30 text-center">
                    <p className="text-xs text-accent-purple font-bold mb-1">Scope 3</p>
                    <p className="text-white font-semibold text-sm">Value Chain</p>
                    <p className="text-xs mt-1">Raw materials + Alloy additions (FeCr, FeNi, NPI, FeMo)</p>
                  </div>
                </div>
              </section>

              {/* Data Sources */}
              <section>
                <h3 className="text-base font-bold text-brand mb-2">Emission Factor Sources</h3>
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left py-2 text-slate-500">Parameter</th>
                      <th className="text-left py-2 text-slate-500">Value</th>
                      <th className="text-left py-2 text-slate-500">Source</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50">
                    <tr><td className="py-2 text-slate-400">Grid EF (India)</td><td className="py-2 text-white font-mono">0.710 kg CO₂/kWh</td><td className="py-2 text-slate-500">CEA FY24-25</td></tr>
                    <tr><td className="py-2 text-slate-400">Ferrochrome</td><td className="py-2 text-white font-mono">3.0 t CO₂e/t</td><td className="py-2 text-slate-500">ISSF / IRENA</td></tr>
                    <tr><td className="py-2 text-slate-400">Ferronickel (scrap)</td><td className="py-2 text-white font-mono">6.0 t CO₂e/t</td><td className="py-2 text-slate-500">ISSF</td></tr>
                    <tr><td className="py-2 text-slate-400">NPI (Nickel Pig Iron)</td><td className="py-2 text-white font-mono">12.0 t CO₂e/t</td><td className="py-2 text-slate-500">ACS / worldsteel</td></tr>
                    <tr><td className="py-2 text-slate-400">Ferromolybdenum</td><td className="py-2 text-white font-mono">8.0 t CO₂e/t</td><td className="py-2 text-slate-500">IRENA</td></tr>
                    <tr><td className="py-2 text-slate-400">EAF process</td><td className="py-2 text-white font-mono">0.6 t CO₂/t</td><td className="py-2 text-slate-500">worldsteel (2024)</td></tr>
                    <tr><td className="py-2 text-slate-400">BOF process</td><td className="py-2 text-white font-mono">2.2 t CO₂/t</td><td className="py-2 text-slate-500">worldsteel (2024)</td></tr>
                    <tr><td className="py-2 text-slate-400">Virgin ore input</td><td className="py-2 text-white font-mono">2.2 t CO₂/t</td><td className="py-2 text-slate-500">IRENA</td></tr>
                    <tr><td className="py-2 text-slate-400">Recycled scrap input</td><td className="py-2 text-white font-mono">0.35 t CO₂/t</td><td className="py-2 text-slate-500">worldsteel</td></tr>
                  </tbody>
                </table>
              </section>

              {/* Known Limitations */}
              <section>
                <h3 className="text-base font-bold text-accent-red mb-2">⚠️ Known Limitations</h3>
                <ul className="space-y-2">
                  <li className="flex gap-2">
                    <span className="text-accent-red mt-0.5">•</span>
                    <span><strong className="text-white">Composition ranges:</strong> Stainless grades have 3–8% elemental variability. We use midpoint values — real plant data would narrow uncertainty.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-accent-red mt-0.5">•</span>
                    <span><strong className="text-white">System boundary:</strong> Our model excludes deep upstream mining/beneficiation. Full cradle-to-gate figures (e.g., Norgate's 6.8t) include stages outside JSL's direct procurement control.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-accent-red mt-0.5">•</span>
                    <span><strong className="text-white">Grid averaging:</strong> Uses India's national average grid EF. Plant-specific or state-level grid data would improve accuracy.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-accent-red mt-0.5">•</span>
                    <span><strong className="text-white">Static emission factors:</strong> Alloy EFs are point estimates. A future version could incorporate supplier-specific EPDs (Environmental Product Declarations).</span>
                  </li>
                </ul>
              </section>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
