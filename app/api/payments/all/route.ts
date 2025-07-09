import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const paymentsFile = path.join(process.cwd(), 'data', 'payments.json');

export async function GET(req: NextRequest) {
  try {
    let payments = [];
    if (fs.existsSync(paymentsFile)) {
      const fileData = fs.readFileSync(paymentsFile, 'utf-8');
      payments = fileData ? JSON.parse(fileData) : [];
    }
    return NextResponse.json({ payments }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
} 