import { Trainer, Session, Race, RaceResult } from '@/types';

// Check if we're running in AMPT environment
const isAmptEnvironment = process.env.AMPT_ENV === 'true' || process.env.NODE_ENV === 'production';

// Data service using file storage locally and AMPT Data in production
export class DataService {
  // Trainers
  static async getTrainers(): Promise<Trainer[]> {
    try {
      if (isAmptEnvironment) {
        const { data } = await import('@ampt/data');
        const trainers = await data.get('trainers') as Trainer[];
        return trainers || [];
      } else {
        // Use file storage locally
        const { promises: fs } = require('fs');
        const path = require('path');
        const trainersPath = path.join(process.cwd(), 'public', 'trainers.json');
        const data = await fs.readFile(trainersPath, 'utf8');
        const trainers = JSON.parse(data);
        return trainers.trainers || [];
      }
    } catch (error) {
      console.error('Error fetching trainers:', error);
      return [];
    }
  }

  static async addTrainer(trainer: Omit<Trainer, 'id'>): Promise<Trainer> {
    try {
      const newTrainer: Trainer = {
        ...trainer,
        id: trainer.name.toLowerCase().replace(/\s+/g, '-')
      };

      const trainers = await this.getTrainers();
      const existingTrainer = trainers.find(t => t.name.toLowerCase() === trainer.name.toLowerCase());
      
      if (existingTrainer) {
        throw new Error('Trainer already exists');
      }

      trainers.push(newTrainer);

      if (isAmptEnvironment) {
        const { data } = await import('@ampt/data');
        await data.set('trainers', trainers);
      } else {
        // Use file storage locally
        const { promises: fs } = require('fs');
        const path = require('path');
        const trainersPath = path.join(process.cwd(), 'public', 'trainers.json');
        await fs.writeFile(trainersPath, JSON.stringify({ trainers }, null, 2));
      }
      
      return newTrainer;
    } catch (error) {
      console.error('Error adding trainer:', error);
      throw error;
    }
  }

  static async updateTrainer(id: string, updates: Partial<Trainer>): Promise<Trainer> {
    try {
      const trainers = await this.getTrainers();
      const index = trainers.findIndex(t => t.id === id);
      
      if (index === -1) {
        throw new Error('Trainer not found');
      }

      trainers[index] = { ...trainers[index], ...updates };

      if (isAmptEnvironment) {
        const { data } = await import('@ampt/data');
        await data.set('trainers', trainers);
      } else {
        // Use file storage locally
        const { promises: fs } = require('fs');
        const path = require('path');
        const trainersPath = path.join(process.cwd(), 'public', 'trainers.json');
        await fs.writeFile(trainersPath, JSON.stringify({ trainers }, null, 2));
      }
      
      return trainers[index];
    } catch (error) {
      console.error('Error updating trainer:', error);
      throw error;
    }
  }

  static async deleteTrainer(id: string): Promise<void> {
    try {
      const trainers = await this.getTrainers();
      const filteredTrainers = trainers.filter(t => t.id !== id);

      if (isAmptEnvironment) {
        const { data } = await import('@ampt/data');
        await data.set('trainers', filteredTrainers);
      } else {
        // Use file storage locally
        const { promises: fs } = require('fs');
        const path = require('path');
        const trainersPath = path.join(process.cwd(), 'public', 'trainers.json');
        await fs.writeFile(trainersPath, JSON.stringify({ trainers: filteredTrainers }, null, 2));
      }
    } catch (error) {
      console.error('Error deleting trainer:', error);
      throw error;
    }
  }

  // Sessions
  static async getSessions(): Promise<Session[]> {
    try {
      if (isAmptEnvironment) {
        const { data } = await import('@ampt/data');
        const sessions = await data.get('sessions') as Session[];
        return sessions || [];
      } else {
        // Use file storage locally
        const { promises: fs } = require('fs');
        const path = require('path');
        const racesPath = path.join(process.cwd(), 'public', 'races.json');
        const data = await fs.readFile(racesPath, 'utf8');
        const races = JSON.parse(data);
        return races.sessions || [];
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
      return [];
    }
  }

  static async addSession(session: Omit<Session, 'id' | 'races'>): Promise<Session> {
    try {
      const sessions = await this.getSessions();
      const newSession: Session = {
        ...session,
        id: `session-${sessions.length + 1}`,
        races: []
      };

      const existingSession = sessions.find(s => s.name.toLowerCase() === session.name.toLowerCase());
      if (existingSession) {
        throw new Error('Session already exists');
      }

      sessions.push(newSession);

      if (isAmptEnvironment) {
        const { data } = await import('@ampt/data');
        await data.set('sessions', sessions);
      } else {
        // Use file storage locally
        const { promises: fs } = require('fs');
        const path = require('path');
        const racesPath = path.join(process.cwd(), 'public', 'races.json');
        await fs.writeFile(racesPath, JSON.stringify({ sessions }, null, 2));
      }
      
      return newSession;
    } catch (error) {
      console.error('Error adding session:', error);
      throw error;
    }
  }

  static async updateSession(id: string, updates: Partial<Session>): Promise<Session> {
    try {
      const sessions = await this.getSessions();
      const index = sessions.findIndex(s => s.id === id);
      
      if (index === -1) {
        throw new Error('Session not found');
      }

      sessions[index] = { ...sessions[index], ...updates };

      if (isAmptEnvironment) {
        const { data } = await import('@ampt/data');
        await data.set('sessions', sessions);
      } else {
        // Use file storage locally
        const { promises: fs } = require('fs');
        const path = require('path');
        const racesPath = path.join(process.cwd(), 'public', 'races.json');
        await fs.writeFile(racesPath, JSON.stringify({ sessions }, null, 2));
      }
      
      return sessions[index];
    } catch (error) {
      console.error('Error updating session:', error);
      throw error;
    }
  }

  static async deleteSession(id: string): Promise<void> {
    try {
      const sessions = await this.getSessions();
      const filteredSessions = sessions.filter(s => s.id !== id);

      if (isAmptEnvironment) {
        const { data } = await import('@ampt/data');
        await data.set('sessions', filteredSessions);
      } else {
        // Use file storage locally
        const { promises: fs } = require('fs');
        const path = require('path');
        const racesPath = path.join(process.cwd(), 'public', 'races.json');
        await fs.writeFile(racesPath, JSON.stringify({ sessions: filteredSessions }, null, 2));
      }
    } catch (error) {
      console.error('Error deleting session:', error);
      throw error;
    }
  }

  // Races
  static async addRace(sessionId: string, race: Omit<Race, 'id'>): Promise<Race> {
    try {
      const sessions = await this.getSessions();
      const sessionIndex = sessions.findIndex(s => s.id === sessionId);
      
      if (sessionIndex === -1) {
        throw new Error('Session not found');
      }

      const newRace: Race = {
        ...race,
        id: `${sessionId}-${race.raceNumber}`
      };

      // Check if race already exists
      const existingRace = sessions[sessionIndex].races.find(r => r.raceNumber === race.raceNumber);
      if (existingRace) {
        throw new Error('Race already exists for this session');
      }

      sessions[sessionIndex].races.push(newRace);

      if (isAmptEnvironment) {
        const { data } = await import('@ampt/data');
        await data.set('sessions', sessions);
      } else {
        // Use file storage locally
        const { promises: fs } = require('fs');
        const path = require('path');
        const racesPath = path.join(process.cwd(), 'public', 'races.json');
        await fs.writeFile(racesPath, JSON.stringify({ sessions }, null, 2));
      }
      
      return newRace;
    } catch (error) {
      console.error('Error adding race:', error);
      throw error;
    }
  }

  static async updateRace(sessionId: string, raceId: string, updates: Partial<Race>): Promise<Race> {
    try {
      const sessions = await this.getSessions();
      const sessionIndex = sessions.findIndex(s => s.id === sessionId);
      
      if (sessionIndex === -1) {
        throw new Error('Session not found');
      }

      const raceIndex = sessions[sessionIndex].races.findIndex(r => r.id === raceId);
      if (raceIndex === -1) {
        throw new Error('Race not found');
      }

      sessions[sessionIndex].races[raceIndex] = {
        ...sessions[sessionIndex].races[raceIndex],
        ...updates
      };

      if (isAmptEnvironment) {
        const { data } = await import('@ampt/data');
        await data.set('sessions', sessions);
      } else {
        // Use file storage locally
        const { promises: fs } = require('fs');
        const path = require('path');
        const racesPath = path.join(process.cwd(), 'public', 'races.json');
        await fs.writeFile(racesPath, JSON.stringify({ sessions }, null, 2));
      }
      
      return sessions[sessionIndex].races[raceIndex];
    } catch (error) {
      console.error('Error updating race:', error);
      throw error;
    }
  }

  static async deleteRace(sessionId: string, raceId: string): Promise<void> {
    try {
      const sessions = await this.getSessions();
      const sessionIndex = sessions.findIndex(s => s.id === sessionId);
      
      if (sessionIndex === -1) {
        throw new Error('Session not found');
      }

      sessions[sessionIndex].races = sessions[sessionIndex].races.filter(r => r.id !== raceId);

      if (isAmptEnvironment) {
        const { data } = await import('@ampt/data');
        await data.set('sessions', sessions);
      } else {
        // Use file storage locally
        const { promises: fs } = require('fs');
        const path = require('path');
        const racesPath = path.join(process.cwd(), 'public', 'races.json');
        await fs.writeFile(racesPath, JSON.stringify({ sessions }, null, 2));
      }
    } catch (error) {
      console.error('Error deleting race:', error);
      throw error;
    }
  }

  // Migration helper - to migrate existing data from JSON files to AMPT Data
  static async migrateFromFiles(): Promise<void> {
    try {
      if (!isAmptEnvironment) {
        throw new Error('Migration can only be performed in AMPT environment');
      }

      const { data } = await import('@ampt/data');
      const { promises: fs } = require('fs');
      const path = require('path');

      // Migrate trainers
      const trainersPath = path.join(process.cwd(), 'public', 'trainers.json');
      const trainersData = await fs.readFile(trainersPath, 'utf8');
      const trainers = JSON.parse(trainersData);
      await data.set('trainers', trainers.trainers);

      // Migrate sessions and races
      const racesPath = path.join(process.cwd(), 'public', 'races.json');
      const racesData = await fs.readFile(racesPath, 'utf8');
      const races = JSON.parse(racesData);
      await data.set('sessions', races.sessions);

      console.log('Migration completed successfully');
    } catch (error) {
      console.error('Migration failed:', error);
      throw error;
    }
  }
} 