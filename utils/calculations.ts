import { Trainer, Session, Race, RaceResult } from '@/types';

export interface TrainerStats {
  trainerId: string;
  trainerName: string;
  totalPoints: number;
  wins: number;
  podiums: number;
  races: number;
  averagePoints: number;
  position: number;
}

export interface RaceMatrixRow {
  raceNumber: number;
  results: { [trainerId: string]: number | string };
}

export function calculateTrainerStats(
  trainers: Trainer[],
  sessions: Session[]
): TrainerStats[] {
  const statsMap = new Map<string, TrainerStats>();

  // Initialize stats for all trainers
  trainers.forEach(trainer => {
    statsMap.set(trainer.id, {
      trainerId: trainer.id,
      trainerName: trainer.name,
      totalPoints: 0,
      wins: 0,
      podiums: 0,
      races: 0,
      averagePoints: 0,
      position: 0 // Initialize position
    });
  });

  // Calculate stats from all races
  sessions.forEach(session => {
    session.races.forEach(race => {
      race.results.forEach(result => {
        const stats = statsMap.get(result.trainerId);
        if (stats) {
          stats.totalPoints += result.points;
          stats.races += 1;
          
          if (result.position === 1) {
            stats.wins += 1;
          }
          if (result.position <= 3) {
            stats.podiums += 1;
          }
        }
      });
    });
  });

  // Calculate average points
  statsMap.forEach(stats => {
    stats.averagePoints = stats.races > 0 ? Math.round((stats.totalPoints / stats.races) * 100) / 100 : 0;
  });

  // Convert to array and sort by total points (descending)
  const sortedStats = Array.from(statsMap.values()).sort((a, b) => b.totalPoints - a.totalPoints);

  // Assign positions with proper tie handling
  let currentPosition = 1;
  let currentPoints = sortedStats[0]?.totalPoints;
  
  sortedStats.forEach((stats, index) => {
    if (index === 0) {
      stats.position = 1;
    } else {
      if (stats.totalPoints === currentPoints) {
        // Same points as previous trainer - same position
        stats.position = currentPosition;
      } else {
        // Different points - next position
        currentPosition = index + 1;
        currentPoints = stats.totalPoints;
        stats.position = currentPosition;
      }
    }
  });

  return sortedStats;
}

export function getCurrentSession(sessions: Session[]): Session | null {
  // Get the most recent session that hasn't ended
  const currentSession = sessions
    .filter(session => !session.endDate || new Date(session.endDate) >= new Date())
    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())[0];
  
  return currentSession || sessions[sessions.length - 1] || null;
}

export function createRaceMatrix(session: Session, trainers: Trainer[]): RaceMatrixRow[] {
  const matrix: RaceMatrixRow[] = [];
  
  // Create rows for all races in the session (including not yet run)
  for (let raceNumber = 1; raceNumber <= session.totalRaces; raceNumber++) {
    const race = session.races.find(r => r.raceNumber === raceNumber);
    const row: RaceMatrixRow = {
      raceNumber,
      results: {}
    };
    
    // Initialize all trainers with "-" for not run races
    trainers.forEach(trainer => {
      if (race) {
        // Race exists, get actual results
        const result = race.results.find(r => r.trainerId === trainer.id);
        row.results[trainer.id] = result ? result.points : 0;
      } else {
        // Race hasn't been run yet
        row.results[trainer.id] = "-";
      }
    });
    
    matrix.push(row);
  }
  
  return matrix;
}

export function getLastSessionResults(sessions: Session[], trainers: Trainer[]): TrainerStats[] {
  const lastSession = sessions[sessions.length - 1];
  if (!lastSession) return [];
  
  const statsMap = new Map<string, TrainerStats>();
  
  // Initialize stats for all trainers
  trainers.forEach(trainer => {
    statsMap.set(trainer.id, {
      trainerId: trainer.id,
      trainerName: trainer.name,
      totalPoints: 0,
      wins: 0,
      podiums: 0,
      races: 0,
      averagePoints: 0,
      position: 0 // Initialize position
    });
  });
  
  // Calculate stats from last session only
  lastSession.races.forEach(race => {
    race.results.forEach(result => {
      const stats = statsMap.get(result.trainerId);
      if (stats) {
        stats.totalPoints += result.points;
        stats.races += 1;
        
        if (result.position === 1) {
          stats.wins += 1;
        }
        if (result.position <= 3) {
          stats.podiums += 1;
        }
      }
    });
  });
  
  // Calculate average points
  statsMap.forEach(stats => {
    stats.averagePoints = stats.races > 0 ? Math.round((stats.totalPoints / stats.races) * 100) / 100 : 0;
  });

  // Convert to array and sort by total points (descending)
  const sortedStats = Array.from(statsMap.values()).sort((a, b) => b.totalPoints - a.totalPoints);
  
  // Assign positions with proper tie handling
  let currentPosition = 1;
  let currentPoints = sortedStats[0]?.totalPoints;
  
  sortedStats.forEach((stats, index) => {
    if (index === 0) {
      stats.position = 1;
    } else {
      if (stats.totalPoints === currentPoints) {
        // Same points as previous trainer - same position
        stats.position = currentPosition;
      } else {
        // Different points - next position
        currentPosition = index + 1;
        currentPoints = stats.totalPoints;
        stats.position = currentPosition;
      }
    }
  });
  
  return sortedStats;
} 