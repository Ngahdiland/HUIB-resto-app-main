import { NextRequest, NextResponse } from 'next/server';
import { readJson, writeJson } from '@/lib/jsonDb';

export async function GET() {
  const products = await readJson('products.json');
  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  const { name, description, price, image, stock, category } = await req.json();
  if (!name || !price) {
    return NextResponse.json({ error: 'Missing required fields', message: 'Name and price are required' }, { status: 400 });
  }
  const products = await readJson('products.json');
  const newProduct = {
    id: Date.now().toString(),
    name,
    description,
    price,
    image,
    stock,
    category,
    createdAt: new Date().toISOString(),
  };
  products.push(newProduct);
  await writeJson('products.json', products);
  return NextResponse.json(newProduct);
}
