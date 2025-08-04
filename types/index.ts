export interface Trainer {
  id: string;
  name: string;
  active: boolean;
  joinedDate: string;
}

export interface RaceResult {
  trainerId: string;
  position: number;
  points: number;
}

export interface RaceData {
  name: string;
  distance: number;
  track: number;
  terrain: number;
  grade: number;
}

export interface Race {
  id: string;
  sessionId: string;
  raceNumber: number;
  date: string;
  results: RaceResult[];
  raceData?: RaceData;
}

export interface Session {
  id: string;
  name: string;
  startDate: string;
  endDate: string | null;
  totalRaces: number;
  races: Race[];
}

export interface TrainersData {
  trainers: Trainer[];
}

export interface RacesData {
  sessions: Session[];
}

// API Request/Response types
export interface AddTrainerRequest {
  name: string;
}

export interface AddSessionRequest {
  name: string;
  startDate?: string;
  endDate?: string;
  totalRaces: number;
}

export interface AddRaceRequest {
  sessionId: string;
  raceNumber: number;
  results: RaceResult[];
  raceData?: RaceData;
} 