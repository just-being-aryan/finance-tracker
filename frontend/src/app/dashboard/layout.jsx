// src/app/(dashboard)/layout.jsx
'use client'

import Sidebar from '@/component/Sidebar'
import { ThemeToggle } from '../theme-toggle'

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      

      {/* Main Content */}
      <main className="flex-1 bg-black text-white relative">
        {/* Theme Toggle */}
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>

        {children}
      </main>
    </div>
  )
}
