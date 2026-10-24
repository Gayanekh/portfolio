import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Keeps the visitor signed in: on every request, checks their session and,
// when its token has expired, refreshes it and writes the new cookies to both
// the request (so this request's server code sees the fresh session) and the
// response (so the browser keeps it). Without this, the server stops seeing a
// signed-in visitor about an hour after they signed in, while the page still
// looks signed in, and Save or Publish fail.
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        // Never cache a response carrying one visitor's session.
        Object.entries(headers).forEach(([key, value]) => response.headers.set(key, value));
      },
    },
  });

  // Nothing may run between creating the client and this call: it is what
  // checks the session and refreshes an expired token.
  await supabase.auth.getClaims();

  return response;
}
