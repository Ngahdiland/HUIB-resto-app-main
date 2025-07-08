import { NextRequest, NextResponse } from 'next/server';
import { readJson } from '@/lib/jsonDb';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    const users = await readJson('users.json');
    const user = users.find((u: any) => u.email === email && u.password === password);
    if (user) {
      const cookieValue = JSON.stringify({ email: user.email, role: user.role });
      const response = NextResponse.json({ user: { email: user.email, name: user.name, role: user.role }, message: 'Login successful' });
      response.cookies.set('auth_user', cookieValue, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
        sameSite: 'lax',
      });
      return response;
    } else {
      return NextResponse.json({ error: 'Invalid credentials', message: 'Invalid email or password.' }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Server error', message: 'Something went wrong.' }, { status: 500 });
  }
}
