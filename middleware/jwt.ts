import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export function verifyJWT(req: NextRequest, roles: string[] = []) {
  const auth = req.headers.get('authorization');
  if (!auth) return NextResponse.json({ error: 'No token' }, { status: 401 });
  try {
    const token = auth.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    if (roles.length && !roles.includes((decoded as any).role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return decoded;
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}
