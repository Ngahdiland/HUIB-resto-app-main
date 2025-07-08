import { NextRequest, NextResponse } from 'next/server';
import { readJson, writeJson } from '@/lib/jsonDb';

export async function POST(req: NextRequest) {
  const { name, email, password } = await req.json();
  if (!name || !email || !password) {
    return NextResponse.json({ error: 'Missing required fields', message: 'Name, email, and password are required' }, { status: 400 });
  }
  const users = await readJson('users.json');
  if (users.find((u: any) => u.email === email)) {
    return NextResponse.json({ error: 'Email already in use', message: 'An account with this email already exists' }, { status: 409 });
  }
  const newUser = {
    id: Date.now().toString(),
    name,
    email,
    password,
    role: 'customer',
    createdAt: new Date().toISOString(),
  };
  users.push(newUser);
  await writeJson('users.json', users);
  return NextResponse.json({ user: { email: newUser.email, name: newUser.name, role: newUser.role }, message: 'Registration successful' });
}
