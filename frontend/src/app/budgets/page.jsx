'use client'

import { useEffect, useState } from 'react'
import Sidebar from '@/component/Sidebar'
import axiosInstance from '@/utils/axiosInstance'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'

const categories = [
  'Food', 'Rent', 'Healthcare', 'Shopping', 'EMIs', 'Travel', 'Other'
]

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({ category: '', limit: '' })
  const [alerts, setAlerts] = useState([])
  const [editingCategory, setEditingCategory] = useState(null)

 const fetchBudgets = async () => {
  try {
    const res = await axiosInstance.get('/api/budget')
    console.log("📦 Raw Budget API response:", res.data)

    // Use the correct key: res.data.budget
    const extractedBudgets = Array.isArray(res.data.budget) ? res.data.budget : []

    setBudgets(extractedBudgets)
  } catch (err) {
    console.error('Failed to fetch budgets:', err)
    setBudgets([])
  }
}


  const fetchAlerts = async () => {
    try {
      const res = await axiosInstance.get('/api/budget/getBudgetAlerts')
      const alertMessage = res.data?.alert

      if (alertMessage && alertMessage.length > 0) {
        if (alertMessage.includes('100%') && alertMessage.includes('exceeded')) {
          alert(`🔴 ${alertMessage}`)
        } else if (alertMessage.includes('80%')) {
          alert(`🟠 ${alertMessage}`)
        }
      }
    } catch (err) {
      console.error('Failed to fetch alerts:', err)
    }
  }

  useEffect(() => {
    fetchBudgets()
    fetchAlerts()
  }, [])

  const openAddOrEditModal = (category = '') => {
    if (category) {
      const existing = budgets.find(b => b.category === category)
      setFormData({ category, limit: existing?.limit || '' })
      setEditingCategory(category)
    } else {
      setFormData({ category: '', limit: '' })
      setEditingCategory(null)
    }
    setIsModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axiosInstance.post('/api/budget/createOrUpdateBudget', formData)
      alert(editingCategory ? 'Budget updated' : 'Budget added')
      fetchBudgets()
      fetchAlerts()
      setIsModalOpen(false)
    } catch (err) {
      console.error('Failed to save budget:', err)
      alert('Error saving budget')
    }
  }

  return (
    <main className="flex min-h-screen bg-white dark:bg-black text-black dark:text-white transition-all duration-300">
      <Sidebar />
      <div className="flex-1 p-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-primary">Budgets</h1>
          <Button variant="secondary" onClick={() => openAddOrEditModal()}>
            Add Budget
          </Button>
        </div>

        {/* Budget Cards Grid */}
        {budgets.length === 0 ? (
          <p className="text-muted-foreground text-sm">No budgets set yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {budgets.map((budget) => {
              const percentage = (budget.spent / budget.limit) * 100
              let color = 'text-green-600'
              if (percentage >= 100) color = 'text-red-600'
              else if (percentage >= 80) color = 'text-yellow-500'

              return (
                <div
                  key={budget._id || budget.category}
                  className="border border-border rounded-xl p-4 shadow-sm"
                >
                  <h2 className="text-xl font-semibold mb-2">{budget.category}</h2>
                  <p>Limit: ₹ {budget.limit}</p>
                  <p>Spent: ₹ {budget.spent}</p>
                  <p className={`font-bold ${color}`}>
                    Used: {Math.min(percentage, 100).toFixed(1)}%
                  </p>
                  <Button
                    size="sm"
                    className="mt-3"
                    onClick={() => openAddOrEditModal(budget.category)}
                  >
                    {percentage ? 'Update Budget' : 'Set Budget'}
                  </Button>
                </div>
              )
            })}
          </div>
        )}

        {/* Add/Edit Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent>
            <DialogTitle>{editingCategory ? 'Update Budget' : 'Add Budget'}</DialogTitle>
            <form onSubmit={handleSubmit} className="space-y-4">
              <select
                className="w-full p-2 border rounded dark:bg-black dark:border-gray-700"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
                disabled={!!editingCategory}
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              <Input
                type="number"
                placeholder="Monthly Limit (₹)"
                value={formData.limit}
                onChange={(e) => setFormData({ ...formData, limit: e.target.value })}
                required
              />
              <Button type="submit">{editingCategory ? 'Update' : 'Save'}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </main>
  )
}
