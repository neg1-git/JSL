// ============================================================
// Carbon & Energy Calculator — Emissions Model
// Based on worldsteel, CEA India, ISSF, IRENA data
// ============================================================

// Steel grade presets (alloy composition %)
export const STEEL_GRADES = {
  '200': { name: '200 Series', cr: 15, ni: 4, mo: 0, desc: 'Low-Ni austenitic' },
  '304': { name: '304 / 304L', cr: 18, ni: 8, mo: 0, desc: 'Most common grade' },
  '316': { name: '316 / 316L', cr: 17, ni: 10, mo: 2, desc: 'Marine / chemical grade' },
  '430': { name: '430', cr: 17, ni: 0, mo: 0, desc: 'Ferritic, no nickel' },
  '409': { name: '409', cr: 11, ni: 0, mo: 0, desc: 'Automotive exhaust' },
};

// Process route emission factors (t CO2 / t crude steel)
export const PROCESS_ROUTES = {
  'EAF': { name: 'Electric Arc Furnace (EAF)', ef: 0.6, energyUse: 550 },   // kWh/t
  'BOF': { name: 'Blast Oxygen Furnace (BOF)', ef: 2.2, energyUse: 250 },    // kWh/t (less electricity, more coal)
  'IF':  { name: 'Induction Furnace (IF)', ef: 0.55, energyUse: 600 },       // kWh/t
};

// Grid emission factor (India CEA FY 2024-25)
export const GRID_EF = 0.710; // kg CO2 / kWh

// Ferroalloy emission factors (t CO2e / t alloy) — midpoint values
export const ALLOY_EF = {
  cr: 3.0,   // Ferrochrome
  ni: 6.0,   // Ferronickel (scrap-sourced)
  niNPI: 12.0, // Nickel Pig Iron route (extremely dirty)
  mo: 8.0,   // Ferromolybdenum
};

// Raw material emission factors (t CO2 / t steel input)
export const RAW_MATERIAL_EF = {
  virgin: 2.2,  // Iron ore based
  scrap: 0.35,  // Recycled scrap
};

/**
 * Calculate total CO2 emissions per tonne of stainless steel
 * 
 * @param {Object} params
 * @param {string} params.grade - Steel grade key (e.g., '304')
 * @param {number} params.scrapPercent - % of input that is scrap (0-100)
 * @param {string} params.processRoute - Process route key ('EAF', 'BOF', 'IF')
 * @param {number} params.renewablePercent - % of electricity from renewables (0-100)
 * @param {boolean} params.useNPI - Whether nickel is sourced from NPI
 * @returns {Object} Detailed emissions breakdown
 */
export function calculateEmissions({ grade, scrapPercent, processRoute, renewablePercent, useNPI }) {
  const gradeData = STEEL_GRADES[grade];
  const routeData = PROCESS_ROUTES[processRoute];
  
  const scrapFraction = scrapPercent / 100;
  const virginFraction = 1 - scrapFraction;
  const renewableFraction = renewablePercent / 100;

  // 1. Raw Material Emissions
  const rawMaterialEmissions = 
    (virginFraction * RAW_MATERIAL_EF.virgin) + 
    (scrapFraction * RAW_MATERIAL_EF.scrap);

  // 2. Process Emissions (route-dependent)
  const processEmissions = routeData.ef;

  // 3. Energy Emissions (electricity × grid factor × non-renewable fraction)
  const energyEmissions = 
    (routeData.energyUse * GRID_EF * (1 - renewableFraction)) / 1000; // convert kg to tonnes

  // 4. Alloy Emissions (stainless-specific)
  const niEF = useNPI ? ALLOY_EF.niNPI : ALLOY_EF.ni;
  // Alloy additions are partially offset by scrap (scrap already contains alloys)
  const alloyScrapOffset = scrapFraction * 0.7; // 70% of alloys come from scrap at high scrap %
  const alloyVirginFraction = 1 - alloyScrapOffset;
  
  const alloyEmissions = alloyVirginFraction * (
    (gradeData.cr / 100) * ALLOY_EF.cr +
    (gradeData.ni / 100) * niEF +
    (gradeData.mo / 100) * ALLOY_EF.mo
  );

  const totalEmissions = rawMaterialEmissions + processEmissions + energyEmissions + alloyEmissions;

  // Energy consumption (GJ/t)
  const energyGJ = (routeData.energyUse * 3.6) / 1000; // kWh to GJ
  // Add thermal energy for BOF
  const thermalGJ = processRoute === 'BOF' ? 14.0 : 2.5;
  const totalEnergyGJ = energyGJ + thermalGJ;

  return {
    total: Math.round(totalEmissions * 100) / 100,
    breakdown: {
      rawMaterials: Math.round(rawMaterialEmissions * 100) / 100,
      process: Math.round(processEmissions * 100) / 100,
      energy: Math.round(energyEmissions * 100) / 100,
      alloys: Math.round(alloyEmissions * 100) / 100,
    },
    scopes: {
      scope1: Math.round(processEmissions * 100) / 100,
      scope2: Math.round(energyEmissions * 100) / 100,
      scope3: Math.round((rawMaterialEmissions + alloyEmissions) * 100) / 100,
    },
    energyGJ: Math.round(totalEnergyGJ * 10) / 10,
    percentages: {
      rawMaterials: Math.round((rawMaterialEmissions / totalEmissions) * 100),
      process: Math.round((processEmissions / totalEmissions) * 100),
      energy: Math.round((energyEmissions / totalEmissions) * 100),
      alloys: Math.round((alloyEmissions / totalEmissions) * 100),
    },
    scopePercentages: {
      scope1: Math.round((processEmissions / totalEmissions) * 100),
      scope2: Math.round((energyEmissions / totalEmissions) * 100),
      scope3: Math.round(((rawMaterialEmissions + alloyEmissions) / totalEmissions) * 100),
    },
  };
}

/**
 * Get benchmark data for comparison
 */
export function getBenchmarks() {
  return [
    { name: 'Global Average', value: 2.18, color: '#EF4444' },
    { name: 'EU Average (SS)', value: 2.8, color: '#F59E4C' },
    { name: 'Outokumpu (Best)', value: 1.8, color: '#22C55E' },
    { name: 'India Avg (SS)', value: 3.5, color: '#EF4444' },
  ];
}

/**
 * Generate optimization suggestions
 */
export function getOptimizations(currentParams, currentTotal) {
  const suggestions = [];

  // Try increasing scrap
  if (currentParams.scrapPercent < 80) {
    const improved = calculateEmissions({ ...currentParams, scrapPercent: 80 });
    const saving = currentTotal - improved.total;
    if (saving > 0.1) {
      suggestions.push({
        action: `Increase scrap ratio to 80%`,
        saving: Math.round(saving * 100) / 100,
        savingPercent: Math.round((saving / currentTotal) * 100),
        icon: '♻️',
      });
    }
  }

  // Try switching to EAF
  if (currentParams.processRoute !== 'EAF') {
    const improved = calculateEmissions({ ...currentParams, processRoute: 'EAF' });
    const saving = currentTotal - improved.total;
    if (saving > 0.1) {
      suggestions.push({
        action: `Switch to EAF process route`,
        saving: Math.round(saving * 100) / 100,
        savingPercent: Math.round((saving / currentTotal) * 100),
        icon: '⚡',
      });
    }
  }

  // Try increasing renewables
  if (currentParams.renewablePercent < 60) {
    const improved = calculateEmissions({ ...currentParams, renewablePercent: 60 });
    const saving = currentTotal - improved.total;
    if (saving > 0.05) {
      suggestions.push({
        action: `Increase renewable energy to 60%`,
        saving: Math.round(saving * 100) / 100,
        savingPercent: Math.round((saving / currentTotal) * 100),
        icon: '☀️',
      });
    }
  }

  // Try switching from NPI
  if (currentParams.useNPI) {
    const improved = calculateEmissions({ ...currentParams, useNPI: false });
    const saving = currentTotal - improved.total;
    if (saving > 0.1) {
      suggestions.push({
        action: `Switch from NPI to scrap-sourced Nickel`,
        saving: Math.round(saving * 100) / 100,
        savingPercent: Math.round((saving / currentTotal) * 100),
        icon: '🔄',
      });
    }
  }

  return suggestions.sort((a, b) => b.saving - a.saving);
}
