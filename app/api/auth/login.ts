import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    
    if (!email || !password) {
      return NextResponse.json({ 
        error: 'Missing fields',
        message: 'Email and password are required' 
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
    
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ 
        error: 'Invalid credentials',
        message: 'Email or password is incorrect' 
      }, { status: 401 });
    }
    
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return NextResponse.json({ 
        error: 'Invalid credentials',
        message: 'Email or password is incorrect' 
      }, { status: 401 });
    }
    
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    return NextResponse.json({ 
      token, 
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      message: 'Login successful'
    });
  } catch (error) {
    console.error('Login error:', error);
    
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
      message: 'An unexpected error occurred during login' 
    }, { status: 500 });
  }
}
