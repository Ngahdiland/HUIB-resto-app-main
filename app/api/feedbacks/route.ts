import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const feedbacksFile = path.join(process.cwd(), 'data', 'feedbacks.json');

// Ensure feedbacks file exists
const ensureFeedbacksFile = () => {
  if (!fs.existsSync(feedbacksFile)) {
    fs.writeFileSync(feedbacksFile, JSON.stringify([], null, 2));
  }
};

export async function GET() {
  try {
    ensureFeedbacksFile();
    const feedbacksData = fs.readFileSync(feedbacksFile, 'utf-8');
    const feedbacks = feedbacksData ? JSON.parse(feedbacksData) : [];
    
    return NextResponse.json({ feedbacks }, { status: 200 });
  } catch (error) {
    console.error('Error fetching feedbacks:', error);
    return NextResponse.json({ error: 'Failed to fetch feedbacks' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, topic, feedback, orderId } = await req.json();
    
    // Validation
    if (!name || !topic || !feedback || !orderId) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }
    
    ensureFeedbacksFile();
    const feedbacksData = fs.readFileSync(feedbacksFile, 'utf-8');
    const feedbacks = feedbacksData ? JSON.parse(feedbacksData) : [];
    
    const newFeedback = {
      id: `FB-${Date.now()}`,
      name,
      topic,
      feedback,
      orderId,
      date: new Date().toISOString(),
      approved: false // Feedbacks need admin approval
    };
    
    feedbacks.push(newFeedback);
    fs.writeFileSync(feedbacksFile, JSON.stringify(feedbacks, null, 2));
    
    return NextResponse.json({ 
      message: 'Feedback submitted successfully and pending approval',
      feedback: newFeedback 
    }, { status: 201 });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    return NextResponse.json({ error: 'Failed to submit feedback' }, { status: 500 });
  }
} 