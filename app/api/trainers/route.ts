import { NextRequest, NextResponse } from 'next/server';
import { DataService } from '@/utils/dataService';

export async function GET() {
  try {
    const trainers = await DataService.getTrainers();
    return NextResponse.json({ trainers });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read trainers' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const newTrainer = await DataService.addTrainer({
      name,
      active: true,
      joinedDate: new Date().toISOString().split('T')[0]
    });

    return NextResponse.json(newTrainer, { status: 201 });
  } catch (error: any) {
    if (error.message === 'Trainer already exists') {
      return NextResponse.json({ error: 'Trainer already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to add trainer' }, { status: 500 });
  }
} 