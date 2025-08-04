import { NextRequest, NextResponse } from 'next/server';
import { DataService } from '@/utils/dataService';

export async function GET() {
  try {
    const sessions = await DataService.getSessions();
    return NextResponse.json({ sessions });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read races' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, raceNumber, results } = body;

    if (!sessionId || !raceNumber || !results || !Array.isArray(results)) {
      return NextResponse.json({ 
        error: 'sessionId, raceNumber, and results array are required' 
      }, { status: 400 });
    }

    const newRace = await DataService.addRace(sessionId, {
      sessionId,
      raceNumber,
      date: new Date().toISOString().split('T')[0],
      results: results.map((result: any, index: number) => ({
        trainerId: result.trainerId,
        position: result.position || index + 1,
        points: result.points || 0
      }))
    });

    return NextResponse.json(newRace, { status: 201 });
  } catch (error: any) {
    if (error.message === 'Session not found') {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }
    if (error.message === 'Race already exists for this session') {
      return NextResponse.json({ error: 'Race already exists for this session' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to add race' }, { status: 500 });
  }
} 