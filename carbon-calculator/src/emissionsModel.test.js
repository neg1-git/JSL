import { describe, it, expect } from 'vitest';
import { calculateEmissions, getOptimizations } from './emissionsModel';

describe('Emissions Model Engine', () => {
  // Baseline setup for our tests
  const baselineParams = {
    grade: '304',
    scrapPercent: 40,
    processRoute: 'EAF',
    renewablePercent: 10,
    useNPI: false,
  };

  it('should return a valid emissions calculation structure', () => {
    const result = calculateEmissions(baselineParams);
    
    // Check if the structure exists
    expect(result).toHaveProperty('total');
    expect(result).toHaveProperty('breakdown');
    expect(result).toHaveProperty('scopes');
    expect(result).toHaveProperty('energyGJ');
    
    // Check if total is a positive number
    expect(result.total).toBeGreaterThan(0);
  });

  it('should calculate LOWER emissions when scrap percentage INCREASES', () => {
    const lowScrap = calculateEmissions(baselineParams); // 40% scrap
    
    const highScrapParams = { ...baselineParams, scrapPercent: 80 };
    const highScrap = calculateEmissions(highScrapParams); // 80% scrap
    
    expect(highScrap.total).toBeLessThan(lowScrap.total);
  });

  it('should calculate HIGHER emissions when using Nickel Pig Iron (NPI)', () => {
    const withoutNPI = calculateEmissions(baselineParams);
    
    const withNPIParams = { ...baselineParams, useNPI: true };
    const withNPI = calculateEmissions(withNPIParams);
    
    expect(withNPI.total).toBeGreaterThan(withoutNPI.total);
  });

  it('should suggest increasing scrap if current scrap is low', () => {
    const result = calculateEmissions(baselineParams);
    const suggestions = getOptimizations(baselineParams, result.total);
    
    // We expect the first or second suggestion to be about increasing scrap
    const scrapSuggestion = suggestions.find(s => s.action.includes('scrap'));
    expect(scrapSuggestion).toBeDefined();
    expect(scrapSuggestion.saving).toBeGreaterThan(0);
  });
});
