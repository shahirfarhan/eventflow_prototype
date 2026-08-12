import type { NextAuthConfig } from "next-auth"

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;

      // Define protected routes
      const protectedRoutes = ['/dashboard', '/vendors']
      const isProtectedRoute = protectedRoutes.some(route =>
        nextUrl.pathname.startsWith(route)
      )

      // Define auth routes (logged in users shouldn't see these)
      const authRoutes = ['/login', '/register']
      const isAuthRoute = authRoutes.some(route =>
        nextUrl.pathname.startsWith(route)
      )

      if (isProtectedRoute && !isLoggedIn) {
        // Not logged in → redirect to login
        return Response.redirect(new URL('/login', nextUrl))
      }

      if (isAuthRoute && isLoggedIn) {
        // Already logged in → redirect to home
        return Response.redirect(new URL('/', nextUrl))
      }

      return true
    },

    jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.id = user.id
      }
      return token
    },

    session({ session, token }) {
      if (token && session.user) {
        session.user.role = token.role as string
        session.user.id = token.id as string
      }
      return session
    }
  },
  providers: [], // Configured in auth.ts
} satisfies NextAuthConfig