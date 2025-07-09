import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const feedbacksFile = path.join(process.cwd(), 'data', 'feedbacks.json');

export async function DELETE(
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
    
    // Remove the feedback
    const deletedFeedback = feedbacks.splice(feedbackIndex, 1)[0];
    
    fs.writeFileSync(feedbacksFile, JSON.stringify(feedbacks, null, 2));
    
    return NextResponse.json({ 
      message: 'Feedback deleted successfully',
      feedback: deletedFeedback
    }, { status: 200 });
  } catch (error) {
    console.error('Error deleting feedback:', error);
    return NextResponse.json({ error: 'Failed to delete feedback' }, { status: 500 });
  }
} 