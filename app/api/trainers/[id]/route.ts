import { NextRequest, NextResponse } from 'next/server';
import { DataService } from '@/utils/dataService';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const updatedTrainer = await DataService.updateTrainer(params.id, { name });
    return NextResponse.json(updatedTrainer);
  } catch (error: any) {
    if (error.message === 'Trainer not found') {
      return NextResponse.json({ error: 'Trainer not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to update trainer' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await DataService.deleteTrainer(params.id);
    return NextResponse.json({ message: 'Trainer deleted successfully' });
  } catch (error: any) {
    if (error.message === 'Trainer not found') {
      return NextResponse.json({ error: 'Trainer not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to delete trainer' }, { status: 500 });
  }
} 