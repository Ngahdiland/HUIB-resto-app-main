import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const usersFile = path.join(process.cwd(), 'data', 'users.json');

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    let users = [];
    if (fs.existsSync(usersFile)) {
      const fileData = fs.readFileSync(usersFile, 'utf-8');
      users = fileData ? JSON.parse(fileData) : [];
    }

    const user = users.find((user: any) => user.email === email && user.password === password);
    if (!user) {
      return NextResponse.json({ error: 'Wrong email or password.' }, { status: 401 });
    }

    // Exclude password from response
    const { password: _pw, ...userWithoutPassword } = user;
    return NextResponse.json({ message: 'Login successful.', user: userWithoutPassword }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
} 