import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const feedbacksFile = path.join(process.cwd(), 'data', 'feedbacks.json');

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    if (!fs.existsSync(feedbacksFile)) {
      return NextResponse.json({ error: 'Feedbacks file not found' }, { status: 404 });
    }
    
    const feedbacksData = fs.readFileSync(feedbacksFile, 'utf-8');
    const feedbacks = JSON.parse(feedbacksData);
    
    const feedbackIndex = feedbacks.findIndex((feedback: any) => feedback.id === id);
    
    if (feedbackIndex === -1) {
      return NextResponse.json({ error: 'Feedback not found' }, { status: 404 });
    }
    
    // Update the feedback to rejected
    feedbacks[feedbackIndex].rejected = true;
    feedbacks[feedbackIndex].approved = false;
    
    fs.writeFileSync(feedbacksFile, JSON.stringify(feedbacks, null, 2));
    
    return NextResponse.json({ 
      message: 'Feedback rejected successfully',
      feedback: feedbacks[feedbackIndex]
    }, { status: 200 });
  } catch (error) {
    console.error('Error rejecting feedback:', error);
    return NextResponse.json({ error: 'Failed to reject feedback' }, { status: 500 });
  }
} 