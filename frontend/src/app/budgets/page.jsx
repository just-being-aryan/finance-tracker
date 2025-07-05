'use client'

import { useEffect, useState } from 'react'
import axiosInstance from '@/utils/axiosInstance'
import Sidebar from '@/component/sidebar'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

export default function BudgetsPage() {
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBudgetAlerts = async () => {
      try {
        const res = await axiosInstance.get('/api/budget/getBudgetAlerts')
        setAlerts(res.data.alerts || [])
      } catch (err) {
        console.error('Failed to fetch budget alerts:', err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchBudgetAlerts()
  }, [])

  return (
    <main className="flex min-h-screen bg-white dark:bg-black text-black dark:text-white transition-all duration-300">
      {/* Sidebar on the left */}
      <Sidebar />

      {/* Right main content */}
      <div className="flex-1 p-10">
        <h1 className="text-3xl font-bold mb-6 text-primary">Budgets</h1>

        {loading ? (
          <p>Loading budgets...</p>
        ) : alerts.length === 0 ? (
          <p className="text-muted-foreground">No budget data found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {alerts.map((alert, index) => (
              <Card key={index} className="bg-muted border border-border shadow">
                <CardContent className="p-6 space-y-4">
                  <h2 className="text-xl font-semibold text-primary">{alert.category}</h2>

                  <div className="text-sm">
                    <p>Month: <span className="font-medium">{alert.month}</span></p>
                    <p>Budget: ₹{alert.budget}</p>
                    <p>Spent: ₹{alert.spent}</p>
                    <p>Status:{' '}
                      <span
                        className={
                          alert.status === 'overbudget'
                            ? 'text-red-600 font-semibold'
                            : alert.status === 'warning'
                            ? 'text-yellow-500 font-semibold'
                            : 'text-green-600 font-semibold'
                        }
                      >
                        {alert.status.toUpperCase()}
                      </span>
                    </p>
                  </div>

                  <div>
                    <Progress value={alert.usagePercent} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">
                      {alert.usagePercent}% used
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
