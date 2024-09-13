import { NextResponse } from 'next/server';

export async function GET() {
  // Replace this with actual logic to fetch files from your database or storage
  const files = [
    { id: '1', name: 'example1.jpg', url: 'https://example.com/files/example1.jpg' },
    { id: '2', name: 'example2.pdf', url: 'https://example.com/files/example2.pdf' },
  ];

  return NextResponse.json(files);
}