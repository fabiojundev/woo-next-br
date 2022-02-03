import { NextResponse, NextRequest } from 'next/server'
export async function middleware(req, ev) {
    const { pathname } = req.nextUrl;

    if (pathname == '/loja/') {
        return NextResponse.redirect('/');
    }
    return NextResponse.next();
}