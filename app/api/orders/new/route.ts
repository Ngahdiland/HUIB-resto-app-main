import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const ordersFile = path.join(process.cwd(), 'data', 'orders.json');

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, items, total } = body;
    if (!email || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Invalid order data.' }, { status: 400 });
    }
    // Read existing orders
    let orders = [];
    if (fs.existsSync(ordersFile)) {
      const fileData = fs.readFileSync(ordersFile, 'utf-8');
      orders = fileData ? JSON.parse(fileData) : [];
    }
    // Create new order
    const newOrder = {
      id: `ORD-${Date.now()}`,
      email,
      items,
      total,
      status: 'pending',
      date: new Date().toISOString(),
    };
    orders.push(newOrder);
    fs.writeFileSync(ordersFile, JSON.stringify(orders, null, 2));
    return NextResponse.json({ message: 'Order placed.', order: newOrder }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
} 