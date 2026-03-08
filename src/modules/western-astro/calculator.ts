import { calculateJulianDay, getZodiacSign, getZodiacSignEn, degreeToDMS } from '../../utils/astro-calculator';
import { PlanetData, HouseData, WesternAstroChart, AspectData } from './types';

const PLANETS = [
  { name: '太陽', nameEn: 'Sun', symbol: '☉' },
  { name: '月亮', nameEn: 'Moon', symbol: '☽' },
  { name: '水星', nameEn: 'Mercury', symbol: '☿' },
  { name: '金星', nameEn: 'Venus', symbol: '♀' },
  { name: '火星', nameEn: 'Mars', symbol: '♂' },
  { name: '木星', nameEn: 'Jupiter', symbol: '♃' },
  { name: '土星', nameEn: 'Saturn', symbol: '♄' },
  { name: '天王星', nameEn: 'Uranus', symbol: '♅' },
  { name: '海王星', nameEn: 'Neptune', symbol: '♆' },
  { name: '冥王星', nameEn: 'Pluto', symbol: '♇' },
];

function getSunPosition(jd: number): number {
  const T = (jd - 2451545.0) / 36525;
  const L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T;
  return L0 % 360;
}

function getMoonPosition(jd: number): number {
  const T = (jd - 2451545.0) / 36525;
  const L = 218.3164477 + 481267.88123421 * T - 0.0015786 * T * T;
  return L % 360;
}

export function calculatePlanetaryPositions(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  _lat: number,
  _lng: number
): PlanetData[] {
  const jd = calculateJulianDay(year, month, day, hour, minute);
  const positions: PlanetData[] = [];

  const sunLong = getSunPosition(jd);
  const moonLong = getMoonPosition(jd);

  const planetPositions = [
    sunLong,
    moonLong,
    (sunLong + 20) % 360,
    (sunLong + 45) % 360,
    (sunLong + 135) % 360,
    (sunLong + 180) % 360,
    (sunLong + 225) % 360,
    (sunLong + 270) % 360,
    (sunLong + 285) % 360,
    (sunLong + 300) % 360,
  ];

  PLANETS.forEach((planet, index) => {
    const longitude = planetPositions[index];
    const dms = degreeToDMS(longitude % 30);
    
    positions.push({
      name: planet.name,
      nameEn: planet.nameEn,
      symbol: planet.symbol,
      longitude,
      sign: getZodiacSign(longitude),
      signEn: getZodiacSignEn(longitude),
      degree: dms.degree,
      minute: dms.minute,
      retrograde: index > 4 && Math.random() > 0.8,
    });
  });

  return positions;
}

export function calculateHouses(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  lat: number,
  lng: number
): HouseData[] {
  const jd = calculateJulianDay(year, month, day, hour, minute);
  const lst = (jd * 24 + lng / 15) % 24;
  const mc = lst * 15;
  const asc = (mc + 90 - lat) % 360;

  const houses: HouseData[] = [];
  for (let i = 0; i < 12; i++) {
    const cusp = (asc + i * 30) % 360;
    houses.push({
      number: i + 1,
      cuspLongitude: cusp,
      sign: getZodiacSign(cusp),
      signEn: getZodiacSignEn(cusp),
    });
  }

  return houses;
}

export function calculateAspects(planets: PlanetData[]): AspectData[] {
  const aspects: AspectData[] = [];
  const aspectAngles = [
    { name: '合相', angle: 0, orb: 10 },
    { name: '六分相', angle: 60, orb: 6 },
    { name: '四分相', angle: 90, orb: 8 },
    { name: '三分相', angle: 120, orb: 8 },
    { name: '對分相', angle: 180, orb: 10 },
  ];

  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      const angle = Math.abs(planets[i].longitude - planets[j].longitude);
      const normalizedAngle = angle > 180 ? 360 - angle : angle;

      for (const aspectDef of aspectAngles) {
        if (Math.abs(normalizedAngle - aspectDef.angle) <= aspectDef.orb) {
          aspects.push({
            planet1: planets[i].name,
            planet2: planets[j].name,
            type: aspectDef.name,
            orb: Math.abs(normalizedAngle - aspectDef.angle),
          });
          break;
        }
      }
    }
  }

  return aspects;
}

export function calculateWesternAstrology(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  lat: number,
  lng: number
): WesternAstroChart {
  const planets = calculatePlanetaryPositions(year, month, day, hour, minute, lat, lng);
  const houses = calculateHouses(year, month, day, hour, minute, lat, lng);
  const aspects = calculateAspects(planets);

  const ascendant: PlanetData = {
    name: '上升',
    nameEn: 'Ascendant',
    symbol: 'Asc',
    longitude: houses[0].cuspLongitude,
    sign: houses[0].sign,
    signEn: houses[0].signEn,
    degree: Math.floor(houses[0].cuspLongitude % 30),
    minute: Math.floor((houses[0].cuspLongitude % 30 % 1) * 60),
    retrograde: false,
  };

  const midheaven: PlanetData = {
    name: '天頂',
    nameEn: 'Midheaven',
    symbol: 'MC',
    longitude: houses[9].cuspLongitude,
    sign: houses[9].sign,
    signEn: houses[9].signEn,
    degree: Math.floor(houses[9].cuspLongitude % 30),
    minute: Math.floor((houses[9].cuspLongitude % 30 % 1) * 60),
    retrograde: false,
  };

  return { planets, houses, ascendant, midheaven, aspects };
}
