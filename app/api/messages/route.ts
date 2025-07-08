import { NextRequest, NextResponse } from 'next/server';
import { readJson, writeJson } from '@/lib/jsonDb';

export async function GET() {
  const messages = await readJson('messages.json');
  return NextResponse.json(messages);
}

export async function POST(req: NextRequest) {
  const { userId, content, type, status, response } = await req.json();
  if (!userId || !content) {
    return NextResponse.json({ error: 'Missing required fields', message: 'userId and content are required' }, { status: 400 });
  }
  const messages = await readJson('messages.json');
  const newMessage = {
    id: Date.now().toString(),
    userId,
    content,
    type: type || 'support',
    status: status || 'open',
    response,
    createdAt: new Date().toISOString(),
  };
  messages.push(newMessage);
  await writeJson('messages.json', messages);
  return NextResponse.json(newMessage);
}
