import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const paymentsFile = path.join(process.cwd(), 'data', 'payments.json');

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    if (!email) {
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
    }
    let payments = [];
    if (fs.existsSync(paymentsFile)) {
      const fileData = fs.readFileSync(paymentsFile, 'utf-8');
      payments = fileData ? JSON.parse(fileData) : [];
    }
    // Filter payments by email
    const userPayments = payments.filter((p: any) => p.email?.toLowerCase() === email.toLowerCase());
    return NextResponse.json({ payments: userPayments }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
} 