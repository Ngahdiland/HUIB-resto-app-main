import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const filePath = path.join(process.cwd(), 'data', 'products.json');
  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    const products = JSON.parse(data);
    return NextResponse.json({ products });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read products.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const filePath = path.join(process.cwd(), 'data', 'products.json');
    
    // Read existing products
    let products = [];
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      products = JSON.parse(fileContent);
    }

    // Generate new product ID
    const newId = `PROD-${String(products.length + 1).padStart(3, '0')}`;
    
    // Create new product with current timestamp
    const newProduct = {
      ...body,
      id: newId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      image: body.image || [],
      tags: body.tags || [],
      ingredients: body.ingredients || [],
      allergens: body.allergens || []
    };

    // Add to products array
    products.unshift(newProduct);

    // Write back to file
    fs.writeFileSync(filePath, JSON.stringify(products, null, 2));

    return NextResponse.json({ 
      message: 'Product created successfully',
      product: newProduct 
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
} 