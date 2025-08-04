import { NextRequest, NextResponse } from 'next/server';
import { DataService } from '@/utils/dataService';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { sessionId, raceNumber, results } = body;

    if (!sessionId || !raceNumber || !results || !Array.isArray(results)) {
      return NextResponse.json({ 
        error: 'sessionId, raceNumber, and results array are required' 
      }, { status: 400 });
    }

    const updatedRace = await DataService.updateRace(sessionId, params.id, {
      sessionId,
      raceNumber,
      results: results.map((result: any, index: number) => ({
        trainerId: result.trainerId,
        position: result.position || index + 1,
        points: result.points || 0
      }))
    });

    return NextResponse.json(updatedRace);
  } catch (error: any) {
    if (error.message === 'Session not found') {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }
    if (error.message === 'Race not found') {
      return NextResponse.json({ error: 'Race not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to update race' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sessions = await DataService.getSessions();
    const session = sessions.find(s => s.races.some(r => r.id === params.id));
    
    if (!session) {
      return NextResponse.json({ error: 'Race not found' }, { status: 404 });
    }

    await DataService.deleteRace(session.id, params.id);
    return NextResponse.json({ message: 'Race deleted successfully' });
  } catch (error: any) {
    if (error.message === 'Race not found') {
      return NextResponse.json({ error: 'Race not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to delete race' }, { status: 500 });
  }
} 