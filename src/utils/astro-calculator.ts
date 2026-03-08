import { julian } from 'astronomia';

export const ZODIAC_SIGNS = [
  '白羊座', '金牛座', '雙子座', '巨蟹座', 
  '獅子座', '處女座', '天秤座', '天蠍座',
  '射手座', '摩羯座', '水瓶座', '雙魚座'
];

export const ZODIAC_SIGNS_EN = [
  'Aries', 'Taurus', 'Gemini', 'Cancer',
  'Leo', 'Virgo', 'Libra', 'Scorpio',
  'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

export function calculateJulianDay(
  year: number, 
  month: number, 
  day: number, 
  hour: number, 
  minute: number
): number {
  return julian.CalendarGregorianToJD(year, month, day + hour / 24 + minute / 1440);
}

export function getZodiacSign(degree: number): string {
  const normalizedDegree = ((degree % 360) + 360) % 360;
  const signIndex = Math.floor(normalizedDegree / 30);
  return ZODIAC_SIGNS[signIndex];
}

export function getZodiacSignEn(degree: number): string {
  const normalizedDegree = ((degree % 360) + 360) % 360;
  const signIndex = Math.floor(normalizedDegree / 30);
  return ZODIAC_SIGNS_EN[signIndex];
}

export function getZodiacDegreeInSign(degree: number): number {
  const normalizedDegree = ((degree % 360) + 360) % 360;
  return normalizedDegree % 30;
}

export interface PlanetPosition {
  name: string;
  nameEn: string;
  longitude: number;
  sign: string;
  signEn: string;
  degreeInSign: number;
}

export interface HousePosition {
  number: number;
  cuspDegree: number;
  sign: string;
}

export function getAyanamsa(jd: number): number {
  const year = 2000 + (jd - 2451545.0) / 365.25;
  return 23.85 + 0.0139 * (year - 1900);
}

export function degreeToDMS(degree: number): { degree: number; minute: number; second: number } {
  const d = Math.floor(degree);
  const mFloat = (degree - d) * 60;
  const m = Math.floor(mFloat);
  const s = Math.floor((mFloat - m) * 60);
  return { degree: d, minute: m, second: s };
}
