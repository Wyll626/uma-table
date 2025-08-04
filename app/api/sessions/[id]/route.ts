import { NextRequest, NextResponse } from 'next/server';
import { DataService } from '@/utils/dataService';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name, startDate, endDate, totalRaces } = body;

    if (!name || !totalRaces) {
      return NextResponse.json({ error: 'Name and totalRaces are required' }, { status: 400 });
    }

    const updatedSession = await DataService.updateSession(params.id, {
      name,
      startDate: startDate || undefined,
      endDate: endDate || null,
      totalRaces: parseInt(totalRaces)
    });

    return NextResponse.json(updatedSession);
  } catch (error: any) {
    if (error.message === 'Session not found') {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to update session' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await DataService.deleteSession(params.id);
    return NextResponse.json({ message: 'Session deleted successfully' });
  } catch (error: any) {
    if (error.message === 'Session not found') {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to delete session' }, { status: 500 });
  }
} 