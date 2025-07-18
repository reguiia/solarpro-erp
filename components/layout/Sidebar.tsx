'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { 
  Home, 
  Users, 
  FolderOpen, 
  Calculator, 
  CheckSquare, 
  Package, 
  DollarSign, 
  BarChart3, 
  Settings,
  Sun,
  User
} from 'lucide-react'
import { UserProfile } from '@/lib/supabase'
import { getCurrentUserProfile, isAdmin } from '@/lib/auth-client';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

interface SidebarProps {
  userProfile: UserProfile | null
}

const menuItems = [
  { icon: Home, label: 'Dashboard', href: '/dashboard', roles: ['admin', 'manager', 'technician', 'sales_rep'] },
  { icon: Users, label: 'CRM', href: '/crm', roles: ['admin', 'manager', 'sales_rep'] },
  { icon: FolderOpen, label: 'Projects', href: '/projects', roles: ['admin', 'manager', 'technician'] },
  { icon: Calculator, label: 'Design & Simulation', href: '/design', roles: ['admin', 'manager', 'technician'] },
  { icon: CheckSquare, label: 'Compliance', href: '/compliance', roles: ['admin', 'manager', 'technician'] },
  { icon: Package, label: 'Procurement', href: '/procurement', roles: ['admin', 'manager'] },
  { icon: DollarSign, label: 'Finance', href: '/finance', roles: ['admin', 'manager'] },
  { icon: BarChart3, label: 'Reports', href: '/reports', roles: ['admin', 'manager'] },
  { icon: Settings, label: 'Settings', href: '/settings', roles: ['admin'] },
]

export default function Sidebar({ userProfile }: SidebarProps) {
  const pathname = usePathname()
  const t = useTranslations('Sidebar');
  const [userProfileState, setUserProfileState] = useState(null);

  useEffect(() => {
    getCurrentUserProfile().then(setUserProfileState);
  }, []);

  const visibleItems = menuItems.filter(item => 
    hasRole(userProfileState?.role, item.roles)
  )

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full">
      <div className="p-6">
        <div className="flex items-center mb-8">
          <Sun className="h-8 w-8 text-blue-600 mr-3" />
          <div>
            <h2 className="text-lg font-semibold text-gray-900">SolarPro ERP</h2>
            <p className="text-sm text-gray-500">Tunisia</p>
          </div>
        </div>
        
        <nav className="space-y-2">
          {visibleItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive 
                    ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600" 
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <Icon className="mr-3 h-5 w-5" />
                {t(item.label)}
              </Link>
            )
          })}
        </nav>
      </div>
      
      {userProfileState && (
        <div className="absolute bottom-0 w-64 p-4 border-t border-gray-200">
          <div className="flex items-center">
            <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-white" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">{userProfileState.full_name}</p>
              <p className="text-xs text-gray-500 capitalize">{userProfileState.role}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
