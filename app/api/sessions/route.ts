import { NextRequest, NextResponse } from 'next/server';
import { DataService } from '@/utils/dataService';

export async function GET() {
  try {
    const sessions = await DataService.getSessions();
    return NextResponse.json({ sessions });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read sessions' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, startDate, endDate, totalRaces } = body;

    if (!name || !totalRaces) {
      return NextResponse.json({ error: 'Name and totalRaces are required' }, { status: 400 });
    }

    const newSession = await DataService.addSession({
      name,
      startDate: startDate || new Date().toISOString().split('T')[0],
      endDate: endDate || null,
      totalRaces: parseInt(totalRaces)
    });

    return NextResponse.json(newSession, { status: 201 });
  } catch (error: any) {
    if (error.message === 'Session already exists') {
      return NextResponse.json({ error: 'Session already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to add session' }, { status: 500 });
  }
} 