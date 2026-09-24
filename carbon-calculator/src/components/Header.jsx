import MethodologyModal from './MethodologyModal';

export default function Header() {
  return (
    <header className="border-b border-slate-700/50 bg-surface/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <img 
              src="/jsl-logo.webp" 
              alt="JSL Logo" 
              className="h-10 object-contain" 
            />
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight">
                Carbon & Energy Calculator
              </h1>
              <p className="text-xs text-slate-400">Stainless Steelmaking Emissions Simulator</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <MethodologyModal />
          <span className="text-xs px-3 py-1.5 rounded-full bg-brand/15 text-brand font-semibold border border-brand/30">
            Net Zero 2050
          </span>
          <span className="text-xs px-3 py-1.5 rounded-full bg-accent-green/15 text-accent-green font-semibold border border-accent-green/30">
            Live Calculator
          </span>
        </div>
      </div>
    </header>
  );
}
