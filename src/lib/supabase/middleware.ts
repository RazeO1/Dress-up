import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

const MIDDLEWARE_TIMEOUT = 3000

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Use Promise.race with a timeout to prevent the request from hanging
  const sessionPromise = supabase.auth.getUser()
  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error("Supabase session timeout")), MIDDLEWARE_TIMEOUT)
  )

  // Race: either get the session or reject on timeout
  let authResponse
  try {
    authResponse = await Promise.race([sessionPromise, timeoutPromise])
  } catch {
    // On timeout, proceed without session validation
    return supabaseResponse
  }

  const { data: { user } = {} } = authResponse

  const { pathname } = request.nextUrl

  // Redirect unauthenticated users away from protected routes
  if (!user && pathname.startsWith("/wardrobe")) {
    const url = request.nextUrl.clone()
    url.pathname = "/login"
    return NextResponse.redirect(url)
  }

  if (!user && pathname.startsWith("/settings")) {
    const url = request.nextUrl.clone()
    url.pathname = "/login"
    return NextResponse.redirect(url)
  }

  // Redirect authenticated users away from public auth routes
  if (user && (pathname === "/" || pathname === "/login" || pathname === "/signup")) {
    const url = request.nextUrl.clone()
    url.pathname = "/wardrobe"
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
