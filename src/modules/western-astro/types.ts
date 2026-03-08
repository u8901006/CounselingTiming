export interface PlanetData {
  name: string;
  nameEn: string;
  symbol: string;
  longitude: number;
  sign: string;
  signEn: string;
  degree: number;
  minute: number;
  house?: number;
  retrograde: boolean;
}

export interface HouseData {
  number: number;
  cuspLongitude: number;
  sign: string;
  signEn: string;
}

export interface WesternAstroChart {
  planets: PlanetData[];
  houses: HouseData[];
  ascendant: PlanetData;
  midheaven: PlanetData;
  aspects: AspectData[];
}

export interface AspectData {
  planet1: string;
  planet2: string;
  type: string;
  orb: number;
}
