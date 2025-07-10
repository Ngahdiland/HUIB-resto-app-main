import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const settingsFile = path.join(process.cwd(), 'data', 'settings.json');

export async function GET() {
  try {
    let settings = {};
    if (fs.existsSync(settingsFile)) {
      const fileData = fs.readFileSync(settingsFile, 'utf-8');
      settings = fileData ? JSON.parse(fileData) : {};
    }
    return NextResponse.json(settings, { status: 200 });
  } catch (error) {
    console.error('Error reading settings:', error);
    return NextResponse.json({ error: 'Failed to load settings.' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const newSettings = await req.json();
    fs.writeFileSync(settingsFile, JSON.stringify(newSettings, null, 2));
    return NextResponse.json({ success: true, settings: newSettings }, { status: 200 });
  } catch (error) {
    console.error('Error saving settings:', error);
    return NextResponse.json({ error: 'Failed to save settings.' }, { status: 500 });
  }
} 