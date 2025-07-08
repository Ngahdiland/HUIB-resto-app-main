import { NextRequest, NextResponse } from 'next/server';
import { readJson, writeJson } from '@/lib/jsonDb';

export async function GET() {
  const orders = await readJson('orders.json');
  return NextResponse.json(orders);
}

export async function POST(req: NextRequest) {
  const { userId, items, total, status, address } = await req.json();
  if (!userId || !items || !total) {
    return NextResponse.json({ error: 'Missing required fields', message: 'userId, items, and total are required' }, { status: 400 });
  }
  const orders = await readJson('orders.json');
  const newOrder = {
    id: Date.now().toString(),
    userId,
    items,
    total,
    status: status || 'pending',
    address,
    createdAt: new Date().toISOString(),
  };
  orders.push(newOrder);
  await writeJson('orders.json', orders);
  return NextResponse.json(newOrder);
}
