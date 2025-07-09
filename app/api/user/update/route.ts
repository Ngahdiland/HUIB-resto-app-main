import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const usersFile = path.join(process.cwd(), 'data', 'users.json');

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, ...updates } = body;
    if (!email) {
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
    }
    let users = [];
    if (fs.existsSync(usersFile)) {
      const fileData = fs.readFileSync(usersFile, 'utf-8');
      users = fileData ? JSON.parse(fileData) : [];
    }
    const userIndex = users.findIndex((user: any) => user.email === email);
    if (userIndex === -1) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }
    // Update user fields (except password unless provided)
    users[userIndex] = { ...users[userIndex], ...updates };
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
    const { password, ...userWithoutPassword } = users[userIndex];
    return NextResponse.json({ message: 'Profile updated.', user: userWithoutPassword }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
} 