import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const reviewsFile = path.join(process.cwd(), 'data', 'reviews.json');

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    if (!fs.existsSync(reviewsFile)) {
      return NextResponse.json({ error: 'Reviews file not found' }, { status: 404 });
    }
    
    const reviewsData = fs.readFileSync(reviewsFile, 'utf-8');
    const reviews = JSON.parse(reviewsData);
    
    const reviewIndex = reviews.findIndex((review: any) => review.id === id);
    
    if (reviewIndex === -1) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }
    
    // Update the review to rejected
    reviews[reviewIndex].rejected = true;
    reviews[reviewIndex].approved = false;
    
    fs.writeFileSync(reviewsFile, JSON.stringify(reviews, null, 2));
    
    return NextResponse.json({ 
      message: 'Review rejected successfully',
      review: reviews[reviewIndex]
    }, { status: 200 });
  } catch (error) {
    console.error('Error rejecting review:', error);
    return NextResponse.json({ error: 'Failed to reject review' }, { status: 500 });
  }
} 