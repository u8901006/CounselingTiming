declare module 'astronomia' {
  export namespace julian {
    function CalendarGregorianToJD(year: number, month: number, day: number): number;
    function JDtoCalendarGregorian(jd: number): { year: number; month: number; day: number };
  }
  
  export namespace planetposition {
    function Mercury(jd: number): { lon: number; lat: number; range: number };
    function Venus(jd: number): { lon: number; lat: number; range: number };
    function Mars(jd: number): { lon: number; lat: number; range: number };
    function Jupiter(jd: number): { lon: number; lat: number; range: number };
    function Saturn(jd: number): { lon: number; lat: number; range: number };
    function Uranus(jd: number): { lon: number; lat: number; range: number };
    function Neptune(jd: number): { lon: number; lat: number; range: number };
    function Pluto(jd: number): { lon: number; lat: number; range: number };
  }
  
  export namespace moonposition {
    function position(jd: number): { lon: number; lat: number; range: number };
  }
  
  export namespace sunposition {
    function position(jd: number): { lon: number; lat: number; range: number };
  }
  
  export namespace house {
    function Placidus(jd: number, lat: number, lon: number): number[];
  }
}
