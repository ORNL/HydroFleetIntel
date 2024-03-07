import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    if (`${process.env.API_HOST}` !== "undefined") {
        //If running app in docker
        return NextResponse.rewrite(`http://${process.env.API_HOST}:${process.env.API_PORT}${request.nextUrl.pathname}`)
    }
    else {
        //If developing locally
        return NextResponse.rewrite(`http://127.0.0.1:5000${request.nextUrl.pathname}`)
    }
}

export const config = {
    matcher: '/api/:path*'
}