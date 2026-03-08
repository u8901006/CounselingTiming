import { describe, it, expect } from 'vitest';
import { calculateJulianDay, getZodiacSign, getZodiacSignEn } from './astro-calculator';

describe('astro-calculator', () => {
  it('should calculate Julian Day correctly', () => {
    const jd = calculateJulianDay(1990, 1, 15, 10, 30);
    expect(jd).toBeCloseTo(2447906.9375, 1);
  });

  it('should return correct zodiac sign for given degree', () => {
    expect(getZodiacSign(0)).toBe('白羊座');
    expect(getZodiacSign(30)).toBe('金牛座');
    expect(getZodiacSign(180)).toBe('天秤座');
    expect(getZodiacSign(330)).toBe('雙魚座');
  });

  it('should return correct English zodiac sign for given degree', () => {
    expect(getZodiacSignEn(0)).toBe('Aries');
    expect(getZodiacSignEn(30)).toBe('Taurus');
    expect(getZodiacSignEn(180)).toBe('Libra');
    expect(getZodiacSignEn(330)).toBe('Pisces');
  });

  it('should normalize negative degrees', () => {
    expect(getZodiacSign(-30)).toBe('雙魚座');
    expect(getZodiacSign(390)).toBe('金牛座');
  });
});
