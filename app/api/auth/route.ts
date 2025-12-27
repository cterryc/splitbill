import { NextResponse } from 'next/server'
import { auth, clerkClient } from '@clerk/nextjs/server'

export async function GET() {
  const { isAuthenticated, userId } = await auth()

  if (!isAuthenticated) {
    return new Response('Unauthorized', { status: 401 })
  }

  const client = await clerkClient()
  const user = await client.users.getUser(userId)

  return NextResponse.json({ user })
}
