import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const paymentsFile = path.join(process.cwd(), 'data', 'payments.json');

export async function POST(req: NextRequest) {
  try {
    const { amountPaid, paymentId, userName, paymentMethod, phoneNumber, status, date, action, email } = await req.json();
    if (!amountPaid || !paymentId || !userName || !paymentMethod || !phoneNumber || !status || !date || !action || !email) {
      return NextResponse.json({ error: 'Missing required payment fields.' }, { status: 400 });
    }
    let payments = [];
    if (fs.existsSync(paymentsFile)) {
      const fileData = fs.readFileSync(paymentsFile, 'utf-8');
      payments = fileData ? JSON.parse(fileData) : [];
    }
    const newPayment = { amountPaid, paymentId, userName, paymentMethod, phoneNumber, status, date, action, email };
    payments.push(newPayment);
    fs.writeFileSync(paymentsFile, JSON.stringify(payments, null, 2));
    return NextResponse.json({ message: 'Payment recorded.', payment: newPayment }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
} 