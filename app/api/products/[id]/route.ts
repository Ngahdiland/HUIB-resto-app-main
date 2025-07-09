import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const filePath = path.join(process.cwd(), 'data', 'products.json');
    
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: 'Products file not found' },
        { status: 404 }
      );
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8');
    let products = JSON.parse(fileContent);

    // Find the product to update
    const productIndex = products.findIndex((p: any) => p.id === params.id);
    
    if (productIndex === -1) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Update the product with new data and timestamp
    const updatedProduct = {
      ...products[productIndex],
      ...body,
      updatedAt: new Date().toISOString()
    };

    products[productIndex] = updatedProduct;

    // Write back to file
    fs.writeFileSync(filePath, JSON.stringify(products, null, 2));

    return NextResponse.json({ 
      message: 'Product updated successfully',
      product: updatedProduct 
    }, { status: 200 });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const filePath = path.join(process.cwd(), 'data', 'products.json');
    
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: 'Products file not found' },
        { status: 404 }
      );
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8');
    let products = JSON.parse(fileContent);

    // Find the product to delete
    const productIndex = products.findIndex((p: any) => p.id === params.id);
    
    if (productIndex === -1) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Remove the product
    const deletedProduct = products.splice(productIndex, 1)[0];

    // Write back to file
    fs.writeFileSync(filePath, JSON.stringify(products, null, 2));

    return NextResponse.json({ 
      message: 'Product deleted successfully',
      product: deletedProduct 
    }, { status: 200 });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
} 