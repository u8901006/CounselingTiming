import { calculateJulianDay, getZodiacSign, getAyanamsa } from '../../utils/astro-calculator';
import { NakshatraData, DashaPeriod, VedicAstroChart } from './types';

const NAKSHATRAS: { name: string; nameEn: string; lord: string }[] = [
  { name: 'Ashwini', nameEn: 'Ashwini', lord: 'Ketu' },
  { name: 'Bharani', nameEn: 'Bharani', lord: 'Venus' },
  { name: 'Krittika', nameEn: 'Krittika', lord: 'Sun' },
  { name: 'Rohini', nameEn: 'Rohini', lord: 'Moon' },
  { name: 'Mrigashira', nameEn: 'Mrigashira', lord: 'Mars' },
  { name: 'Ardra', nameEn: 'Ardra', lord: 'Rahu' },
  { name: 'Punarvasu', nameEn: 'Punarvasu', lord: 'Jupiter' },
  { name: 'Pushya', nameEn: 'Pushya', lord: 'Saturn' },
  { name: 'Ashlesha', nameEn: 'Ashlesha', lord: 'Mercury' },
  { name: 'Magha', nameEn: 'Magha', lord: 'Ketu' },
  { name: 'Purva Phalguni', nameEn: 'Purva Phalguni', lord: 'Venus' },
  { name: 'Uttara Phalguni', nameEn: 'Uttara Phalguni', lord: 'Sun' },
  { name: 'Hasta', nameEn: 'Hasta', lord: 'Moon' },
  { name: 'Chitra', nameEn: 'Chitra', lord: 'Mars' },
  { name: 'Swati', nameEn: 'Swati', lord: 'Rahu' },
  { name: 'Vishakha', nameEn: 'Vishakha', lord: 'Jupiter' },
  { name: 'Anuradha', nameEn: 'Anuradha', lord: 'Saturn' },
  { name: 'Jyeshtha', nameEn: 'Jyeshtha', lord: 'Mercury' },
  { name: 'Mula', nameEn: 'Mula', lord: 'Ketu' },
  { name: 'Purva Ashadha', nameEn: 'Purva Ashadha', lord: 'Venus' },
  { name: 'Uttara Ashadha', nameEn: 'Uttara Ashadha', lord: 'Sun' },
  { name: 'Shravana', nameEn: 'Shravana', lord: 'Moon' },
  { name: 'Dhanishta', nameEn: 'Dhanishta', lord: 'Mars' },
  { name: 'Shatabhisha', nameEn: 'Shatabhisha', lord: 'Rahu' },
  { name: 'Purva Bhadrapada', nameEn: 'Purva Bhadrapada', lord: 'Jupiter' },
  { name: 'Uttara Bhadrapada', nameEn: 'Uttara Bhadrapada', lord: 'Saturn' },
  { name: 'Revati', nameEn: 'Revati', lord: 'Mercury' },
];

const DASHA_ORDER = ['Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury'];
const DASHA_YEARS = [7, 20, 6, 10, 7, 18, 16, 19, 17];

export function getNakshatra(moonLongitude: number): NakshatraData {
  const nakshatraNumber = Math.floor(moonLongitude / (360 / 27)) % 27;
  const pada = Math.floor((moonLongitude % (360 / 27)) / (360 / 27 / 4)) + 1;
  const nakshatra = NAKSHATRAS[nakshatraNumber];
  
  return {
    number: nakshatraNumber + 1,
    name: nakshatra.name,
    nameEn: nakshatra.nameEn,
    lord: nakshatra.lord,
    pada,
  };
}

export function calculateDasha(nakshatra: NakshatraData, birthYear: number): DashaPeriod[] {
  const lordIndex = DASHA_ORDER.indexOf(nakshatra.lord);
  const dashas: DashaPeriod[] = [];
  let totalYears = 0;

  for (let i = 0; i < DASHA_ORDER.length; i++) {
    const index = (lordIndex + i) % DASHA_ORDER.length;
    const duration = DASHA_YEARS[index];
    
    dashas.push({
      planet: DASHA_ORDER[index],
      startYear: birthYear + totalYears,
      duration,
    });
    
    totalYears += duration;
  }

  return dashas;
}

export function calculateVedicAstrology(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  lat: number,
  lng: number
): VedicAstroChart {
  const jd = calculateJulianDay(year, month, day, hour, minute);
  const ayanamsa = getAyanamsa(jd);

  const T = (jd - 2451545.0) / 36525;
  const tropicalMoon = (218.3164477 + 481267.88123421 * T) % 360;
  const siderealMoon = (tropicalMoon - ayanamsa + 360) % 360;

  const tropicalSun = (280.46646 + 36000.76983 * T) % 360;
  const siderealSun = (tropicalSun - ayanamsa + 360) % 360;

  const asc = (siderealMoon + 90 - lat + 360) % 360;

  const moonNakshatra = getNakshatra(siderealMoon);
  const dashas = calculateDasha(moonNakshatra, year);

  return {
    moonSign: getZodiacSign(siderealMoon),
    moonNakshatra,
    ascendant: getZodiacSign(asc),
    sunSign: getZodiacSign(siderealSun),
    dashas,
    moonDegree: siderealMoon,
  };
}
