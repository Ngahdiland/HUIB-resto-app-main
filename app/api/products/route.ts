import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyJWT } from '@/middleware/jwt';

// GET all products
export async function GET() {
  const products = await prisma.product.findMany();
  return NextResponse.json(products);
}

// POST create product (admin only)
export async function POST(req: NextRequest) {
  const auth = verifyJWT(req, ['admin']);
  if ((auth as any).error) return auth;
  const { name, description, price, image, stock } = await req.json();
  const product = await prisma.product.create({
    data: { name, description, price, image, stock },
  });
  return NextResponse.json(product);
}
