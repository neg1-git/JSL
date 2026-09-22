import { useState, useMemo } from 'react';
import { calculateEmissions, getOptimizations, STEEL_GRADES, PROCESS_ROUTES } from './emissionsModel';
import Header from './components/Header';
import InputPanel from './components/InputPanel';
import GaugeCard from './components/GaugeCard';
import BreakdownChart from './components/BreakdownChart';
import BenchmarkBar from './components/BenchmarkBar';
import ScenarioComparison from './components/ScenarioComparison';
import Optimizations from './components/Optimizations';
import EnergyCard from './components/EnergyCard';

function App() {
  // Input state
  const [grade, setGrade] = useState('304');
  const [scrapPercent, setScrapPercent] = useState(40);
  const [processRoute, setProcessRoute] = useState('EAF');
  const [renewablePercent, setRenewablePercent] = useState(10);
  const [useNPI, setUseNPI] = useState(false);

  // Scenario B state
  const [showScenarioB, setShowScenarioB] = useState(false);
  const [scenarioB, setScenarioB] = useState({
    grade: '304',
    scrapPercent: 80,
    processRoute: 'EAF',
    renewablePercent: 50,
    useNPI: false,
  });

  const currentParams = { grade, scrapPercent, processRoute, renewablePercent, useNPI };

  // Calculate emissions
  const resultA = useMemo(() => calculateEmissions(currentParams), [grade, scrapPercent, processRoute, renewablePercent, useNPI]);
  const resultB = useMemo(() => calculateEmissions(scenarioB), [scenarioB]);
  const optimizations = useMemo(() => getOptimizations(currentParams, resultA.total), [currentParams, resultA.total]);

  return (
    <div className="min-h-screen font-sans">
      <Header />
      
      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Top Section: Inputs + Results */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
          
          {/* Left: Input Panel */}
          <div className="lg:col-span-4">
            <InputPanel
              grade={grade} setGrade={setGrade}
              scrapPercent={scrapPercent} setScrapPercent={setScrapPercent}
              processRoute={processRoute} setProcessRoute={setProcessRoute}
              renewablePercent={renewablePercent} setRenewablePercent={setRenewablePercent}
              useNPI={useNPI} setUseNPI={setUseNPI}
            />
          </div>

          {/* Right: Results Dashboard */}
          <div className="lg:col-span-8 space-y-6">
            {/* Top row: Gauge + Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <GaugeCard total={resultA.total} />
              <BreakdownChart 
                breakdown={resultA.breakdown} 
                percentages={resultA.percentages} 
                scopes={resultA.scopes}
                scopePercentages={resultA.scopePercentages}
              />
            </div>

            {/* Benchmark + Energy */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <BenchmarkBar total={resultA.total} />
              <EnergyCard energyGJ={resultA.energyGJ} />
            </div>
          </div>
        </div>

        {/* Optimizations */}
        <div className="mt-6">
          <Optimizations suggestions={optimizations} />
        </div>

        {/* Scenario Comparison */}
        <div className="mt-6">
          <ScenarioComparison
            resultA={resultA}
            resultB={resultB}
            paramsA={currentParams}
            scenarioB={scenarioB}
            setScenarioB={setScenarioB}
            showScenarioB={showScenarioB}
            setShowScenarioB={setShowScenarioB}
          />
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-slate-500 border-t border-slate-700/50 pt-6">
          <p>Data sources: worldsteel (2024) · CEA India FY24-25 · ISSF · IRENA · ACS Sustainable Resource Mgmt</p>
          <p className="mt-1">JSL Stainless Spark · Problem Statement 3 · Carbon & Energy Calculator</p>
        </footer>
      </main>
    </div>
  );
}

export default App;
