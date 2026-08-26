import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'messages.json');

function ensureFile() {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, '[]');
}

export async function GET() {
  try {
    ensureFile();
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    return NextResponse.json(data);
  } catch {
    return NextResponse.json([]);
  }
}

export async function PATCH(request) {
  try {
    ensureFile();
    const { id } = await request.json();
    const messages = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    const updated = messages.map(m => m.id === id ? { ...m, read: true } : m);
    fs.writeFileSync(DATA_FILE, JSON.stringify(updated, null, 2));
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    ensureFile();
    const { id } = await request.json();
    const messages = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    const updated = messages.filter(m => m.id !== id);
    fs.writeFileSync(DATA_FILE, JSON.stringify(updated, null, 2));
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
