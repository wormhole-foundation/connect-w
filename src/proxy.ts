import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PASSWORD = process.env.SITE_PASSWORD;
const TEST_PASSWORD = process.env.TEST_PASSWORD;

export function proxy(request: NextRequest) {
    // Skip if no password is set (and no test password)
    if (!PASSWORD && !TEST_PASSWORD) {
        return NextResponse.next();
    }

    // Allow login page and API
    if (
        request.nextUrl.pathname === '/login' ||
        request.nextUrl.pathname === '/api/auth'
    ) {
        return NextResponse.next();
    }

    // Check for auth cookie (matches either real or test password)
    const authCookie = request.cookies.get('site-auth');
    const isValidAuth =
        (PASSWORD && authCookie?.value === PASSWORD) ||
        (TEST_PASSWORD && authCookie?.value === TEST_PASSWORD);

    if (isValidAuth) {
        return NextResponse.next();
    }

    // Redirect to login
    return NextResponse.redirect(new URL('/login', request.url));
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
