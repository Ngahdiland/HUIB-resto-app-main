import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const paymentsFile = path.join(process.cwd(), 'data', 'payments.json');

export async function PUT(req: NextRequest) {
  try {
    const { paymentId, newStatus } = await req.json();

    if (!paymentId || !newStatus) {
      return NextResponse.json({ error: 'Payment ID and new status are required.' }, { status: 400 });
    }

    // Read current payments
    let payments = [];
    if (fs.existsSync(paymentsFile)) {
      const fileData = fs.readFileSync(paymentsFile, 'utf-8');
      payments = fileData ? JSON.parse(fileData) : [];
    }

    // Find and update the payment
    const paymentIndex = payments.findIndex((p: any) => p.paymentId === paymentId);
    
    if (paymentIndex === -1) {
      return NextResponse.json({ error: 'Payment not found.' }, { status: 404 });
    }

    // Update the status
    payments[paymentIndex].status = newStatus;

    // Write back to file
    fs.writeFileSync(paymentsFile, JSON.stringify(payments, null, 2));

    return NextResponse.json({ 
      success: true, 
      message: 'Payment status updated successfully.',
      payment: payments[paymentIndex]
    }, { status: 200 });

  } catch (error) {
    console.error('Error updating payment status:', error);
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
} 