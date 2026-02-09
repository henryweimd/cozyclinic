
import React from 'react';
import { PatientCase, Item, Choice } from './types';

// Parses text like "Check for [Tachycardia|Rapid heart rate] now."
// Returns an array of strings and React nodes.
export const parseMedicalText = (text: string): (string | React.ReactNode)[] => {
  const parts = text.split(/(\[[^\]]+\])/g);
  
  return parts.map((part, index) => {
    if (part.startsWith('[') && part.endsWith(']')) {
      const content = part.slice(1, -1);
      const [term, definition] = content.split('|');
      
      return React.createElement(
        'span',
        {
          key: index,
          className: "group relative inline-block cursor-help font-semibold text-teal-600 border-b-2 border-teal-200 border-dotted"
        },
        term,
        React.createElement(
          'span',
          {
            className: "pointer-events-none absolute bottom-full left-1/2 mb-2 w-48 -translate-x-1/2 translate-y-2 opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100 z-50"
          },
          React.createElement(
            'span',
            {
              className: "block rounded-lg bg-gray-800 p-2 text-xs text-white shadow-xl text-center"
            },
            definition,
            React.createElement(
              'svg',
              {
                className: "absolute left-1/2 top-full -ml-1 h-2 w-2 text-gray-800",
                x: "0px",
                y: "0px",
                viewBox: "0 0 255 255"
              },
              React.createElement('polygon', {
                className: "fill-current",
                points: "0,0 127.5,127.5 255,0"
              })
            )
          )
        )
      );
    }
    return part;
  });
};

/**
 * Predictive Shop Algorithm
 */
export const getRecommendedItems = (
  upcomingCases: PatientCase[],
  playerInventory: string[],
  allDatabaseItems: Item[],
  maxSlots: number = 4
): Item[] => {
  const recommendations: Item[] = [];
  
  const neededToolIds = new Set<string>();
  const upcomingThemes = new Set<string>();

  upcomingCases.forEach(c => {
    if (c.requiredToolId && !playerInventory.includes(c.requiredToolId)) {
      neededToolIds.add(c.requiredToolId);
    }
    if (c.medicalTheme) {
      upcomingThemes.add(c.medicalTheme.toLowerCase());
    }
  });

  neededToolIds.forEach(id => {
    const item = allDatabaseItems.find(i => i.id === id);
    if (item) recommendations.push(item);
  });

  const relevantConsumables = allDatabaseItems.filter(i => 
    i.type === 'CONSUMABLE' && 
    (i.tags?.some(tag => upcomingThemes.has(tag)) || i.tags?.includes('general'))
  );

  const shuffledConsumables = [...relevantConsumables].sort(() => 0.5 - Math.random());

  for (const item of shuffledConsumables) {
    if (recommendations.length >= maxSlots) break;
    if (!recommendations.some(r => r.id === item.id)) {
      recommendations.push(item);
    }
  }

  if (recommendations.length < maxSlots) {
    const others = allDatabaseItems.filter(i => 
      !playerInventory.includes(i.id) && 
      !recommendations.some(r => r.id === i.id)
    ).sort(() => 0.5 - Math.random());
    
    for (const item of others) {
      if (recommendations.length >= maxSlots) break;
      recommendations.push(item);
    }
  }

  return recommendations.slice(0, maxSlots);
};

export const getRandomCase = (cases: PatientCase[]): PatientCase | null => {
    if (cases.length === 0) return null;

    const weightedCases = cases.filter(c => c.randomWeight !== undefined && c.randomWeight > 0);
    
    if (weightedCases.length === 0) {
        return cases[Math.floor(Math.random() * cases.length)];
    }

    const totalWeight = weightedCases.reduce((sum, c) => sum + (c.randomWeight || 0), 0);
    let randomNum = Math.random() * totalWeight;

    for (const pCase of weightedCases) {
        randomNum -= (pCase.randomWeight || 0);
        if (randomNum <= 0) {
            return pCase;
        }
    }

    return weightedCases[weightedCases.length - 1];
};

/**
 * Shuffles choices for a case while keeping Regular and Cozy variants synchronized.
 * If Choice A is at index 0 in Regular, its corresponding Cozy translation must also move to the same new index.
 */
export const shuffleCaseChoices = (pCase: PatientCase): PatientCase => {
    // Clone to avoid mutation
    const newCase = JSON.parse(JSON.stringify(pCase));
    
    // We base the shuffle on the fallback/default choices array length
    const choiceCount = newCase.choices.length;
    if (choiceCount === 0) return newCase;

    // Create an array of indices [0, 1, 2, 3]
    const indices = Array.from({ length: choiceCount }, (_, i) => i);
    
    // Shuffle indices (Fisher-Yates)
    for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
    }

    // Helper to reorder an array based on shuffled indices
    const reorder = (arr: Choice[]) => {
        if (!arr || arr.length !== choiceCount) return arr;
        return indices.map(i => arr[i]);
    };

    // Apply to base choices
    newCase.choices = reorder(newCase.choices);

    // Apply to variants if they exist
    if (newCase.variants) {
        if (newCase.variants.regular) {
            newCase.variants.regular.choices = reorder(newCase.variants.regular.choices);
        }
        if (newCase.variants.cozy) {
            newCase.variants.cozy.choices = reorder(newCase.variants.cozy.choices);
        }
    }

    return newCase;
};
