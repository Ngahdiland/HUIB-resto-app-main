import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const usersFile = path.join(process.cwd(), 'data', 'users.json');

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, password, address, region } = body;

    // Validate required fields
    if (!name || !email || !phone || !password || !address || !region) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    // Read users.json
    let users = [];
    if (fs.existsSync(usersFile)) {
      const fileData = fs.readFileSync(usersFile, 'utf-8');
      users = fileData ? JSON.parse(fileData) : [];
    }

    // Check for existing user
    const userExists = users.some(
      (user: any) => user.email === email || user.phone === phone
    );
    if (userExists) {
      return NextResponse.json({ error: 'User already exists.' }, { status: 409 });
    }

    // Add new user
    const newUser = { name, email, phone, password, address, region };
    users.push(newUser);
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));

    return NextResponse.json({ message: 'Successfully registered.' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
} 