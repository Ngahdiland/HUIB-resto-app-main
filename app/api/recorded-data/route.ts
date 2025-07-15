import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data', 'recorded-data.json');

export async function GET() {
  try {
    const data = fs.readFileSync(dataFilePath, 'utf-8');
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read orders.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const order = await req.json();
    const data = fs.readFileSync(dataFilePath, 'utf-8');
    const orders = JSON.parse(data);
    orders.push(order);
    fs.writeFileSync(dataFilePath, JSON.stringify(orders, null, 2));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save order.' }, { status: 500 });
  }
} 