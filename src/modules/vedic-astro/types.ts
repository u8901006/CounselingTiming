export interface NakshatraData {
  number: number;
  name: string;
  nameEn: string;
  lord: string;
  pada: number;
}

export interface DashaPeriod {
  planet: string;
  startYear: number;
  duration: number;
}

export interface VedicAstroChart {
  moonSign: string;
  moonNakshatra: NakshatraData;
  ascendant: string;
  sunSign: string;
  dashas: DashaPeriod[];
  moonDegree: number;
}
