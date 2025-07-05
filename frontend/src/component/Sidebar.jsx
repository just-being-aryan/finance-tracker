'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 min-h-screen bg-white dark:bg-black border-r border-border p-6">
      <div className="space-y-6">
        {/* App Name */}
        <h1 className="text-3xl font-extrabold text-primary">TrackIt</h1>

        {/* Navigation */}
        <nav className="space-y-2">
          {['dashboard', 'budgets', 'expenses'].map((route) => (
            <Link
              key={route}
              href={`/${route}`}
              className={clsx(
                'block px-4 py-2 rounded-lg font-medium transition',
                pathname === `/${route}`
                  ? 'bg-primary text-white'
                  : 'hover:bg-muted text-foreground'
              )}
            >
              {route.charAt(0).toUpperCase() + route.slice(1)}
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  )
}
