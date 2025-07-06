import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export function verifyJWT(req: NextRequest, roles: string[] = []) {
  const auth = req.headers.get('authorization');
  if (!auth) return NextResponse.json({ error: 'No token' }, { status: 401 });
  
  try {
    const token = auth.replace('Bearer ', '');
    
    // Check if JWT_SECRET is available
    if (!process.env.JWT_SECRET) {
      console.warn('JWT_SECRET not found in environment variables');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (roles.length && !roles.includes((decoded as any).role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    return decoded;
  } catch (error) {
    console.error('JWT verification error:', error);
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}
