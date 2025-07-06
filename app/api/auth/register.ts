import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, role, region, town, phone } = await req.json();
    
    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json({ 
        error: 'Missing required fields', 
        message: 'Name, email, and password are required' 
      }, { status: 400 });
    }
    
    // Check if JWT_SECRET is available
    if (!process.env.JWT_SECRET) {
      console.warn('JWT_SECRET not found in environment variables');
      return NextResponse.json({ 
        error: 'Server configuration error',
        message: 'JWT_SECRET environment variable is not set' 
      }, { status: 500 });
    }
    
    // Check if DATABASE_URL is available
    if (!process.env.DATABASE_URL) {
      console.warn('DATABASE_URL not found in environment variables');
      return NextResponse.json({ 
        error: 'Server configuration error',
        message: 'DATABASE_URL environment variable is not set' 
      }, { status: 500 });
    }
    
    // Check if user already exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ 
        error: 'Email already in use',
        message: 'An account with this email already exists' 
      }, { status: 409 });
    }
    
    // Hash password
    const hashed = await bcrypt.hash(password, 10);
    
    // Create user (store additional fields in name for now, or extend the schema later)
    const userData = {
      name: `${name}${region ? ` (${region})` : ''}${town ? ` - ${town}` : ''}`,
      email,
      password: hashed,
      role: role || 'customer'
    };
    
    const user = await prisma.user.create({
      data: userData,
    });
    
    // Generate JWT token
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    return NextResponse.json({ 
      token, 
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      message: 'Registration successful'
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    
    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes('connect')) {
        return NextResponse.json({ 
          error: 'Database connection failed',
          message: 'Unable to connect to database. Please check your DATABASE_URL.' 
        }, { status: 500 });
      }
      if (error.message.includes('schema')) {
        return NextResponse.json({ 
          error: 'Database schema error',
          message: 'Database schema is not set up. Please run database migrations.' 
        }, { status: 500 });
      }
    }
    
    return NextResponse.json({ 
      error: 'Internal server error',
      message: 'An unexpected error occurred during registration' 
    }, { status: 500 });
  }
}
