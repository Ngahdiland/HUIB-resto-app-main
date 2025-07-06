import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyJWT } from '@/middleware/jwt';

// GET all messages (admin) or user messages
export async function GET(req: NextRequest) {
  const auth = verifyJWT(req);
  if ((auth as any).error) return auth;
  const user = auth as any;
  let messages;
  if (user.role === 'admin') {
    messages = await prisma.message.findMany();
  } else {
    messages = await prisma.message.findMany({ where: { userId: user.id } });
  }
  return NextResponse.json(messages);
}

// POST create message (user)
export async function POST(req: NextRequest) {
  const auth = verifyJWT(req, ['customer']);
  if ((auth as any).error) return auth;
  const { content } = await req.json();
  const message = await prisma.message.create({
    data: { userId: (auth as any).id, content, status: 'open' },
  });
  return NextResponse.json(message);
}
