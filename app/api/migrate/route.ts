import { NextRequest, NextResponse } from 'next/server';
import { DataService } from '@/utils/dataService';

export async function POST(request: NextRequest) {
  try {
    // Check if we're in AMPT environment
    const isAmptEnvironment = process.env.AMPT_ENV === 'true' || process.env.NODE_ENV === 'production';
    
    if (!isAmptEnvironment) {
      return NextResponse.json({ 
        message: 'Migration can only be performed in AMPT environment. Use file storage locally.',
        environment: 'local',
        storage: 'file'
      });
    }

    // Check if data already exists in AMPT Data
    const existingTrainers = await DataService.getTrainers();
    const existingSessions = await DataService.getSessions();
    
    if (existingTrainers.length > 0 || existingSessions.length > 0) {
      return NextResponse.json({ 
        message: 'Data already exists in AMPT Data. Migration skipped.',
        existingTrainers: existingTrainers.length,
        existingSessions: existingSessions.length,
        environment: 'ampt',
        storage: 'ampt-data'
      });
    }

    // Perform migration
    await DataService.migrateFromFiles();
    
    return NextResponse.json({ 
      message: 'Migration completed successfully',
      migrated: true,
      environment: 'ampt',
      storage: 'ampt-data'
    });
  } catch (error: any) {
    console.error('Migration failed:', error);
    return NextResponse.json({ 
      error: 'Migration failed',
      details: error.message 
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    const isAmptEnvironment = process.env.AMPT_ENV === 'true' || process.env.NODE_ENV === 'production';
    const trainers = await DataService.getTrainers();
    const sessions = await DataService.getSessions();
    
    return NextResponse.json({ 
      trainers: trainers.length,
      sessions: sessions.length,
      hasData: trainers.length > 0 || sessions.length > 0,
      environment: isAmptEnvironment ? 'ampt' : 'local',
      storage: isAmptEnvironment ? 'ampt-data' : 'file'
    });
  } catch (error) {
    return NextResponse.json({ 
      error: 'Failed to check migration status' 
    }, { status: 500 });
  }
} 