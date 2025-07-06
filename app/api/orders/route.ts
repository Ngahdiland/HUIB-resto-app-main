import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyJWT } from '@/middleware/jwt';

// GET all orders (admin) or user orders
export async function GET(req: NextRequest) {
  const auth = verifyJWT(req);
  if ((auth as any).error) return auth;
  const user = auth as any;
  let orders;
  if (user.role === 'admin') {
    orders = await prisma.order.findMany();
  } else {
    orders = await prisma.order.findMany({ where: { userId: user.id } });
  }
  return NextResponse.json(orders);
}

// POST create order (user)
export async function POST(req: NextRequest) {
  const auth = verifyJWT(req, ['customer']);
  if ((auth as any).error) return auth;
  const { items, total } = await req.json();
  const order = await prisma.order.create({
    data: { userId: (auth as any).id, items, total, status: 'pending' },
  });
  return NextResponse.json(order);
}
