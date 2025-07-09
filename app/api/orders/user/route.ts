import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const ordersFile = path.join(process.cwd(), 'data', 'orders.json');

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    if (!email) {
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
    }
    let orders = [];
    if (fs.existsSync(ordersFile)) {
      const fileData = fs.readFileSync(ordersFile, 'utf-8');
      orders = fileData ? JSON.parse(fileData) : [];
    }
    const userOrders = orders.filter((order: any) => order.email === email);
    return NextResponse.json({ orders: userOrders }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
} 