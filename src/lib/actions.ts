'use server'
 
import { signIn, auth } from '@/auth'
import { AuthError } from 'next-auth'
import { redirect } from 'next/navigation'  
import { prisma } from '@/lib/prisma'

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', {
      email: formData.get('email'),
      password: formData.get('password'),
      redirect: false,  
    })
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.'
        default:
          return 'Something went wrong.'
      }
    }
    throw error
  }
  const email = formData.get('email') as string
  const user = await prisma.user.findUnique({
    where: { email },
    select: { role: true }
  })

  console.log("role:", user?.role)
  if (user?.role === 'VENDOR') {
    redirect('/dashboard')
  } else if (user?.role === 'ORGANIZER') {
    redirect('/')
  } else {
    redirect('/')
  }
}