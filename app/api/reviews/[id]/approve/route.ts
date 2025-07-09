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
    
    // Update the review to approved
    reviews[reviewIndex].approved = true;
    reviews[reviewIndex].rejected = false;
    
    fs.writeFileSync(reviewsFile, JSON.stringify(reviews, null, 2));
    
    return NextResponse.json({ 
      message: 'Review approved successfully',
      review: reviews[reviewIndex]
    }, { status: 200 });
  } catch (error) {
    console.error('Error approving review:', error);
    return NextResponse.json({ error: 'Failed to approve review' }, { status: 500 });
  }
} 