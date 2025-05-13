import { NextRequest, NextResponse } from "next/server";
const authRoutes = ['dashboard']
const unauthRoutes = ['signIn', 'signup'];

export default function middleware(req: NextRequest) {
    if (req.nextUrl.pathname === '/') {
        return NextResponse.redirect(new URL('/sign-in', req.url))
    }
}
