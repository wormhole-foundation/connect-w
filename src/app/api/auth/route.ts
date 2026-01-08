import { NextResponse } from 'next/server';

const PASSWORD = process.env.SITE_PASSWORD;
const TEST_PASSWORD = process.env.TEST_PASSWORD;

export async function POST(request: Request) {
    const { password } = await request.json();

    // Check test password first (only works if TEST_PASSWORD env var is set)
    const isTestAuth = TEST_PASSWORD && password === TEST_PASSWORD;
    const isRealAuth = PASSWORD && password === PASSWORD;

    if (!isTestAuth && !isRealAuth) {
        return NextResponse.json(
            { error: 'Invalid password' },
            { status: 401 }
        );
    }

    // Use the matching password for cookie value
    const cookieValue = isTestAuth ? TEST_PASSWORD : PASSWORD;

    const response = NextResponse.json({ success: true });
    response.cookies.set('site-auth', cookieValue!, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    return response;
}
