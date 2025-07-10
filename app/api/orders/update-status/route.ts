import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const ordersFile = path.join(process.cwd(), 'data', 'orders.json');

export async function PUT(req: NextRequest) {
  try {
    const { orderId, newStatus } = await req.json();

    if (!orderId || !newStatus) {
      return NextResponse.json({ error: 'Order ID and new status are required.' }, { status: 400 });
    }

    // Read current orders
    let orders = [];
    if (fs.existsSync(ordersFile)) {
      const fileData = fs.readFileSync(ordersFile, 'utf-8');
      orders = fileData ? JSON.parse(fileData) : [];
    }

    // Find and update the order
    const orderIndex = orders.findIndex((o: any) => o.id === orderId);
    if (orderIndex === -1) {
      return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
    }

    // Update the status
    orders[orderIndex].status = newStatus;
    if (newStatus === 'delivered' && !orders[orderIndex].deliveryDate) {
      orders[orderIndex].deliveryDate = new Date().toISOString();
    }

    // Write back to file
    fs.writeFileSync(ordersFile, JSON.stringify(orders, null, 2));

    return NextResponse.json({
      success: true,
      message: 'Order status updated successfully.',
      order: orders[orderIndex]
    }, { status: 200 });

  } catch (error) {
    console.error('Error updating order status:', error);
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
} 