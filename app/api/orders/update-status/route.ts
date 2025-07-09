import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const ordersFile = path.join(process.cwd(), 'data', 'orders.json');
const ALLOWED_STATUSES = ['pending', 'preparing', 'delivering'];

export async function POST(req: NextRequest) {
  try {
    const { id, status } = await req.json();
    if (!id || !status) {
      return NextResponse.json({ error: 'Order id and status are required.' }, { status: 400 });
    }
    let orders = [];
    if (fs.existsSync(ordersFile)) {
      const fileData = fs.readFileSync(ordersFile, 'utf-8');
      orders = fileData ? JSON.parse(fileData) : [];
    }
    const idx = orders.findIndex((o: any) => o.id === id);
    if (idx === -1) {
      return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
    }
    const currentStatus = orders[idx].status;
    if (!ALLOWED_STATUSES.includes(currentStatus)) {
      return NextResponse.json({ error: 'Order status cannot be updated.' }, { status: 403 });
    }
    orders[idx].status = status;
    fs.writeFileSync(ordersFile, JSON.stringify(orders, null, 2));
    return NextResponse.json({ message: 'Order status updated.', order: orders[idx] }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
} 