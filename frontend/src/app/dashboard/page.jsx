'use client'
// import Suggestions from '@/component/Suggestions'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/component/Sidebar'
import axiosInstance from '@/utils/axiosInstance'

import axios from '@/utils/axiosInstance'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
} from 'chart.js'
import { Pie, Line } from 'react-chartjs-2'

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title
)

export default function DashboardPage() {




  const router = useRouter()
  // const [expenses, setExpenses] = useState([])


  const [loading, setLoading] = useState(true)
const [error, setError] = useState(null)
const [stats, setStats] = useState(null)
const [categorySpending, setCategorySpending] = useState(null)
const [topMethods, setTopMethods] = useState(null)
const [trendData, setTrendData] = useState(null)

  // const [stats, setStats] = useState({
  //   totalBudget: 0,
  //   totalSpent: 0,
  //   numberOfBudgets: 0,
  // })
  // const [loading, setLoading] = useState(true)
  // const [categoryData, setCategoryData] = useState({ labels: [], data: [] })
  // const [trendData, setTrendData] = useState({ labels: [], data: [] })
  // const [topMethods, setTopMethods] = useState([])

  useEffect(() => {
  const fetchDashboardData = async () => {
    try {
      const [
        statsRes,
        categorySpendingRes,
        topMethodsRes,
        trendRes
      ] = await Promise.all([
        axiosInstance.get('/api/budget/dashboardStats'),
        axiosInstance.get('/api/reports/categorySpending'),
        axiosInstance.get('/api/reports/topMethods'),
        axiosInstance.get('/api/reports/trend')
      ])

      setStats(statsRes.data)
      setCategorySpending(categorySpendingRes.data)
      setTopMethods(topMethodsRes.data)
      setTrendData(trendRes.data)
    } catch (err) {
      console.error('Dashboard API error:', err.message)
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  fetchDashboardData()
}, [])

    const fetchTopMethods = async () => {

      

      try {
        const res = await axiosInstance.get('/api/reports/topMethods')
            console.log("💳 Top Methods:", res.data)    // inside fetchTopMethods
        setTopMethods(res.data?.topMethods || [])
      } catch (err) {
        console.error('Failed to load top methods:', err)
      }
    }

      const fetchTrend = async () => {
      try {
        const res = await axiosInstance.get('/api/reports/trend')
        console.log("📈 Trend Data:", res.data)

        const trend = res.data.trend || []

        const labels = trend.map(entry => entry.month)
        const data = trend.map(entry => entry.total)

        setTrendData({ labels, data })
      } catch (err) {
        console.error('Failed to load trend data:', err)
      }
}
    fetchStats()
    fetchCategorySpending()
    fetchTopMethods()
    fetchTrend()
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

            {/* Reports Section */}
            <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="p-6 rounded-xl bg-muted border border-border">
                <h3 className="text-xl font-semibold mb-4">📊 Category-wise Spending</h3>
                <Pie
                  data={{
                    labels: categoryData.labels,
                    datasets: [
                      {
                        label: 'Spending by Category',
                        data: categoryData.data,
                        backgroundColor: [
                          '#F87171', '#FBBF24', '#34D399', '#60A5FA', '#A78BFA', '#F472B6'
                        ],
                      },
                    ],
                  }}
                  
                />
              </div>

              <div className="p-6 rounded-xl bg-muted border border-border">
                <h3 className="text-xl font-semibold mb-4">📈 Monthly Spending Trend</h3>
                <Line
                    data={{
                      labels: trendData.labels,
                      datasets: [
                        {
                          label: 'Spending Over Time',
                          data: trendData.data,
                          fill: false,
                          borderColor: '#EF4444', // 🔴 red line
                          backgroundColor: '#EF4444',
                          tension: 0.3,
                          pointRadius: 5,
                          pointHoverRadius: 7,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: {
                          labels: {
                            color: '#fff', // white for dark mode
                            font: {
                              size: 14,
                            },
                          },
                        },
                        title: {
                          display: true,
                          text: 'Monthly Spending',
                          color: '#fff',
                          font: {
                            size: 18,
                          },
                        },
                      },
                      scales: {
                        x: {
                          ticks: {
                            color: '#fff',
                            font: {
                              size: 14,
                            },
                          },
                          grid: {
                            color: '#444',
                          },
                        },
                        y: {
                          ticks: {
                            color: '#fff',
                            font: {
                              size: 14,
                            },
                          },
                          grid: {
                            color: '#444',
                          },
                        },
                      },
                    }}
                  />
              </div>
            </div>

            {/* Top Payment Methods */}
            <div className="mt-10 p-6 bg-muted border border-border rounded-xl">
              <h3 className="text-xl font-semibold mb-4">💳 Top 3 Payment Methods</h3>
              <ul className="list-disc pl-6">
                {topMethods.map((method, index) => (
                  <li key={index} className="text-lg">
                    {index + 1}. {method}
                  </li>
                ))}
              </ul>
            </div>


            {/* Smart Suggestions Component
            <Suggestions expenses={expenses} /> */}
          </>
        )}
      </div>
    </main>
  )
}
