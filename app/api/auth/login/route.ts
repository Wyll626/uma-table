import { NextRequest, NextResponse } from 'next/server';

// In a real application, you'd store these in environment variables
const VALID_USERNAME = 'bakushin';
const VALID_PASSWORD = 'bakushin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json({ 
        error: 'Username and password are required' 
      }, { status: 400 });
    }

    // Validate credentials
    if (username === VALID_USERNAME && password === VALID_PASSWORD) {
      // In a real application, you'd generate a JWT token here
      // For now, we'll return a simple success response
      return NextResponse.json({ 
        success: true, 
        message: 'Authentication successful' 
      });
    } else {
      return NextResponse.json({ 
        error: 'Invalid username or password' 
      }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ 
      error: 'Authentication failed' 
    }, { status: 500 });
  }
} 