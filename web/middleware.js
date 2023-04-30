import { cyan, gray, yellow } from "ansi-colors"


/**
 * @export
 * @param {import("next/server").NextRequest} req
 */
export async function middleware(req) {
    // log method & endpoint
    console.log(`${yellow(req.method)} ${cyan(req.nextUrl.pathname)}`)

    // log search params
    const params = [...req.nextUrl.searchParams.entries()]
    params.forEach(([key, value]) => console.log(`${gray(key)} = ${yellow(value)}`))
}


// only match on API routes
export const config = {
    matcher: "/api/:path*",
}