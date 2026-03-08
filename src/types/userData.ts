export interface BirthTime {
  hour: number;
  minute: number;
}

export interface Location {
  city: string;
  lat: number;
  lng: number;
}

export interface UserData {
  name: string;
  gender: 'male' | 'female';
  birthDate: Date;
  birthTime: BirthTime;
  location: Location;
}

export interface UserDataInput {
  name: string;
  gender: 'male' | 'female';
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  birthHour: number;
  birthMinute: number;
  city: string;
  lat: number;
  lng: number;
}

export function toUserData(input: UserDataInput): UserData {
  return {
    name: input.name,
    gender: input.gender,
    birthDate: new Date(input.birthYear, input.birthMonth - 1, input.birthDay),
    birthTime: { hour: input.birthHour, minute: input.birthMinute },
    location: { city: input.city, lat: input.lat, lng: input.lng },
  };
}
