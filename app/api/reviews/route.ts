import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const reviewsFile = path.join(process.cwd(), 'data', 'reviews.json');

// Ensure reviews file exists
const ensureReviewsFile = () => {
  if (!fs.existsSync(reviewsFile)) {
    fs.writeFileSync(reviewsFile, JSON.stringify([], null, 2));
  }
};

export async function GET() {
  try {
    ensureReviewsFile();
    const reviewsData = fs.readFileSync(reviewsFile, 'utf-8');
    const reviews = reviewsData ? JSON.parse(reviewsData) : [];
    
    return NextResponse.json({ reviews }, { status: 200 });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, email, rating, comment } = await req.json();
    
    // Validation
    if (!name || !email || !rating || !comment) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }
    
    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 });
    }
    
    ensureReviewsFile();
    const reviewsData = fs.readFileSync(reviewsFile, 'utf-8');
    const reviews = reviewsData ? JSON.parse(reviewsData) : [];
    
    const newReview = {
      id: `REV-${Date.now()}`,
      name,
      email,
      rating: parseInt(rating),
      comment,
      date: new Date().toISOString(),
      approved: false // Reviews need admin approval
    };
    
    reviews.push(newReview);
    fs.writeFileSync(reviewsFile, JSON.stringify(reviews, null, 2));
    
    return NextResponse.json({ 
      message: 'Review submitted successfully and pending approval',
      review: newReview 
    }, { status: 201 });
  } catch (error) {
    console.error('Error submitting review:', error);
    return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 });
  }
} 