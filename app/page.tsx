'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth-server'
import { Link } from 'next-intl';

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const user = await getCurrentUser()
      if (user) {
        router.push('/dashboard')
      } else {
        router.push('/login')
      }
    }
    
    checkAuth()
  }, [router])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <div className="flex gap-2 my-4">
        <Link href="/" locale="en">English</Link>
        <Link href="/" locale="fr">Français</Link>
        <Link href="/" locale="ar">العربية</Link>
      </div>
    </div>
  )
}
