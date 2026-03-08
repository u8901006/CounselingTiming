import { NumerologyResult } from './types';

const LETTER_VALUES: { [key: string]: number } = {
  a: 1, j: 1, s: 1,
  b: 2, k: 2, t: 2,
  c: 3, l: 3, u: 3,
  d: 4, m: 4, v: 4,
  e: 5, n: 5, w: 5,
  f: 6, o: 6, x: 6,
  g: 7, p: 7, y: 7,
  h: 8, q: 8, z: 8,
  i: 9, r: 9,
};

const VOWELS = ['a', 'e', 'i', 'o', 'u'];

export function reduceToSingleDigit(num: number, keepMasterNumbers = true): number {
  if (keepMasterNumbers && (num === 11 || num === 22 || num === 33)) {
    return num;
  }
  
  while (num > 9) {
    let sum = 0;
    while (num > 0) {
      sum += num % 10;
      num = Math.floor(num / 10);
    }
    num = sum;
    
    if (keepMasterNumbers && (num === 11 || num === 22 || num === 33)) {
      return num;
    }
  }
  
  return num;
}

export function calculateLifePathNumber(year: number, month: number, day: number): number {
  const yearSum = String(year).split('').reduce((sum, d) => sum + parseInt(d), 0);
  const monthSum = reduceToSingleDigit(month, false);
  const daySum = reduceToSingleDigit(day, false);
  
  return reduceToSingleDigit(yearSum + monthSum + daySum);
}

export function calculateDestinyNumber(name: string): number {
  const cleanName = name.toLowerCase().replace(/[^a-z]/g, '');
  let sum = 0;
  
  for (const char of cleanName) {
    if (LETTER_VALUES[char]) {
      sum += LETTER_VALUES[char];
    }
  }
  
  return reduceToSingleDigit(sum);
}

export function calculateSoulNumber(name: string): number {
  const cleanName = name.toLowerCase().replace(/[^a-z]/g, '');
  let sum = 0;
  
  for (const char of cleanName) {
    if (VOWELS.includes(char) && LETTER_VALUES[char]) {
      sum += LETTER_VALUES[char];
    }
  }
  
  return reduceToSingleDigit(sum);
}

export function calculatePersonalityNumber(name: string): number {
  const cleanName = name.toLowerCase().replace(/[^a-z]/g, '');
  let sum = 0;
  
  for (const char of cleanName) {
    if (!VOWELS.includes(char) && LETTER_VALUES[char]) {
      sum += LETTER_VALUES[char];
    }
  }
  
  return reduceToSingleDigit(sum);
}

export function calculateBirthdayNumber(day: number): number {
  return reduceToSingleDigit(day, false);
}

export function calculateExpressionNumber(name: string): number {
  return calculateDestinyNumber(name);
}

export function calculateNumerology(
  name: string, 
  year: number, 
  month: number, 
  day: number
): NumerologyResult {
  return {
    lifePathNumber: calculateLifePathNumber(year, month, day),
    destinyNumber: calculateDestinyNumber(name),
    soulNumber: calculateSoulNumber(name),
    personalityNumber: calculatePersonalityNumber(name),
    birthdayNumber: calculateBirthdayNumber(day),
    expressionNumber: calculateExpressionNumber(name),
  };
}
