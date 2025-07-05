'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/component/sidebar'
import axiosInstance from '@/utils/axiosInstance'

export default function DashboardPage() {
  const router = useRouter()
  const [stats, setStats] = useState({
    totalBudget: 0,
    totalSpent: 0,
    numberOfBudgets: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const statsRes = await axiosInstance.get('/api/budget/dashboardStats')

        const { totalBudget, totalSpent, numberOfBudgets } = statsRes.data

        setStats({ totalBudget, totalSpent, numberOfBudgets })
      } catch (err) {
        console.error('Failed to load stats:', err.message)

        if (err.response?.status === 401) {
          router.push('/login')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [router])

  const usagePercent = stats.totalBudget > 0
    ? Math.round((stats.totalSpent / stats.totalBudget) * 100)
    : 0

  return (
    <main className="flex min-h-screen bg-white dark:bg-black text-black dark:text-white transition-all duration-300">
      {/* Sidebar */}
      <Sidebar />

      {/* Right Content */}
      <div className="flex-1 p-10">
        <h1 className="text-3xl font-bold mb-6 text-primary">Dashboard</h1>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-xl bg-muted shadow border border-border">
                <h2 className="text-xl font-semibold mb-2">Total Budget</h2>
                <p className="text-2xl font-bold text-primary">₹ {stats.totalBudget}</p>
              </div>

              <div className="p-6 rounded-xl bg-muted shadow border border-border">
                <h2 className="text-xl font-semibold mb-2">Total Spent</h2>
                <p className="text-2xl font-bold text-primary">₹ {stats.totalSpent}</p>
              </div>

              <div className="p-6 rounded-xl bg-muted shadow border border-border">
                <h2 className="text-xl font-semibold mb-2">Number of Budgets</h2>
                <p className="text-2xl font-bold text-primary">{stats.numberOfBudgets}</p>
              </div>
            </div>

            {/* Progress Summary */}
            <div className="mt-10 space-y-4">
              <p className="text-lg font-medium">
                You've spent <span className="text-primary font-bold">₹{stats.totalSpent}</span> out of a total budget of <span className="text-primary font-bold">₹{stats.totalBudget}</span>
              </p>

              {/* Progress Bar */}
              <div className="w-full bg-muted h-4 rounded-full overflow-hidden border border-border">
                <div
                  className="h-full bg-primary transition-all duration-500"
                  style={{ width: `${usagePercent}%` }}
                ></div>
              </div>

              <p className="text-sm text-muted-foreground">{usagePercent}% used</p>
            </div>
          </>
        )}
      </div>
    </main>
  )
}
