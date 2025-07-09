import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const ordersFile = path.join(process.cwd(), 'data', 'orders.json');
const VALID_STATUSES = ['pending', 'preparing', 'delivering', 'delivered', 'cancelled'];

export async function POST(req: NextRequest) {
  try {
    const { id, status } = await req.json();
    if (!id || !status) {
      return NextResponse.json({ error: 'Order id and status are required.' }, { status: 400 });
    }
    
    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json({ error: 'Invalid status. Allowed statuses: pending, preparing, delivering, delivered, cancelled.' }, { status: 400 });
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
    
    // Update the order status
    orders[idx].status = status;
    
    // If status is being set to delivered, add delivery date
    if (status === 'delivered' && !orders[idx].deliveryDate) {
      orders[idx].deliveryDate = new Date().toISOString();
    }
    
    fs.writeFileSync(ordersFile, JSON.stringify(orders, null, 2));
    return NextResponse.json({ message: 'Order status updated.', order: orders[idx] }, { status: 200 });
  } catch (error) {
    console.error('Error updating order status:', error);
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
} 