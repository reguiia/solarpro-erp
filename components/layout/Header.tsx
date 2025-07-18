'use client'

import React from 'react'
import { Bell, Search, Globe, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { signOut } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl';
import { getCurrentUserProfile, isAdmin } from '@/lib/auth-client';
import { useEffect, useState } from 'react';

export default function Header() {
  const t = useTranslations('Header');
  const router = useRouter()
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    getCurrentUserProfile().then(setUserProfile);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push('/login')
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  return (
    <header className="bg-white border-b border-gray-200 h-16 px-6 flex items-center justify-between">
      <div className="flex items-center flex-1">
        <div className="max-w-lg w-full">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search..."
              className="pl-10"
            />
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <Globe className="h-4 w-4 mr-2" />
              EN
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>English</DropdownMenuItem>
            <DropdownMenuItem>Français</DropdownMenuItem>
            <DropdownMenuItem>العربية</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Button variant="ghost" size="sm">
          <Bell className="h-4 w-4" />
        </Button>
        
        <Button variant="ghost" size="sm" onClick={handleSignOut}>
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>
      {/* Only show Admin Panel if admin */}
      {userProfile && isAdmin(userProfile.role) && (
        <a href="/settings">Admin Panel</a>
      )}
    </header>
  )
}
