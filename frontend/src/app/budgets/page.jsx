'use client'

import { useEffect, useState } from 'react'
import Sidebar from '@/component/Sidebar'
import axiosInstance from '@/utils/axiosInstance'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'

const months = [
  'July', 'August', 'September', 'October', 'November', 'December'
]

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({ name: '', limit: '', month: '', nameType: '' })
  const [alerts, setAlerts] = useState([])
  const [editingBudget, setEditingBudget] = useState(null)

  const fetchBudgets = async () => {
    try {
      const res = await axiosInstance.get('/api/budget')
      console.log("📦 Raw Budget API response:", res.data)

      console.log("📦 Budget array:", res.data.budget)
    console.log("📦 Is array?", Array.isArray(res.data.budget))

      const extractedBudgets = Array.isArray(res.data.budget) ? res.data.budget : []
      console.log("📦 Extracted budgets:", extractedBudgets)
      setBudgets(extractedBudgets)
    } catch (err) {
      console.error('Failed to fetch budgets:', err)
      setBudgets([])
    }
  }

  const fetchAlerts = async () => {
    try {
      const res = await axiosInstance.get('/api/budget/getBudgetAlerts')
      const alertData = res.data?.alerts || []

      // Process each alert
        alertData.forEach(alertItem => {
        if (alertItem.status === 'overbudget') {
          alert(`🔴 Budget Alert: ${alertItem.name} has exceeded its limit! Spent: ₹${alertItem.spent} / ₹${alertItem.budget} (${alertItem.usagePercent}%)`)
        } else if (alertItem.status === 'warning') {
          alert(`🟠 Budget Warning: ${alertItem.name} is at ${alertItem.usagePercent}% of its limit. Spent: ₹${alertItem.spent} / ₹${alertItem.budget}`)
        }

      })
      
      setAlerts(alertData)
    } catch (err) {
      console.error('Failed to fetch alerts:', err)
    }
  }

  useEffect(() => {
    fetchBudgets()
    fetchAlerts()
  }, [])

  const openAddOrEditModal = (budget = null) => {
    if (budget) {
      setFormData({ 
        name: budget.name, 
        limit: budget.limit || '', 
        month: budget.month,
        nameType: months.includes(budget.name) ? budget.name : 'Custom'
      })
      setEditingBudget(budget)
    } else {
      setFormData({ name: '', limit: '', month: '', nameType: '' })
      setEditingBudget(null)
    }
    setIsModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Prepare the final form data
    const submitData = {
      name: formData.nameType === 'Custom' ? formData.name : formData.nameType,
      limit: formData.limit,
      month: formData.month
    }
     if (editingBudget) {
      submitData.budgetId = editingBudget._id
    }
    
    try {
      await axiosInstance.post('/api/budget/createOrUpdateBudget', submitData)
      alert(editingBudget ? 'Budget updated' : 'Budget added')
      fetchBudgets()
      fetchAlerts()
      setIsModalOpen(false)
    } catch (err) {
      console.error('Failed to save budget:', err)
      alert('Error saving budget')
    }
  }

  const handleDeleteBudget = async (budgetId) => {
    if (!confirm('Are you sure you want to delete this budget?')) return
    
    try {
      await axiosInstance.delete(`/api/budget/${budgetId}`)
      alert('Budget deleted successfully')
      fetchBudgets()
      fetchAlerts()
    } catch (err) {
      console.error('Failed to delete budget:', err)
      alert('Error deleting budget')
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
                  key={budget._id || budget.name}
                  className="border border-border rounded-xl p-4 shadow-sm"
                >
                  <h2 className="text-xl font-semibold mb-2">{budget.name}</h2>
                  <p className="text-sm text-muted-foreground mb-2">{budget.month}</p>
                  <p>Limit: ₹ {budget.limit}</p>
                  <p>Spent: ₹ {budget.spent}</p>
                  <p>Remaining: ₹ {budget.remaining}</p>
                  <p className={`font-bold ${color}`}>
                    Used: {Math.min(percentage, 100).toFixed(1)}%
                  </p>
                  <Button
                    size="sm"
                    className="mt-3"
                    onClick={() => openAddOrEditModal(budget)}
                  >
                    Update Budget
                  </Button>

                  <Button
                    size="sm"
                    variant="destructive"
                    className="mt-3 ml-2"
                    onClick={() => handleDeleteBudget(budget._id)}
                  >
                    Delete Budget
                  </Button>

                  
                </div>
              )
            })}
          </div>
        )}

        {/* Add/Edit Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent>
            <DialogTitle>{editingBudget ? 'Update Budget' : 'Add Budget'}</DialogTitle>
              <DialogDescription>
              {editingBudget ? 'Update your existing budget details.' : 'Create a new budget to track your expenses.'}
            </DialogDescription>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Budget Name Type Selection */}
              <div>
                <label className="block text-sm font-medium mb-1">Budget Name</label>
                <select
                  className="w-full p-2 border rounded dark:bg-black dark:border-gray-700"
                  value={formData.nameType}
                  onChange={(e) => setFormData({ ...formData, nameType: e.target.value })}
                  required
                >
                  <option value="">Select Month or Custom</option>
                  {months.map(month => (
                    <option key={month} value={month}>{month}</option>
                  ))}
                  <option value="Custom">Custom</option>
                </select>
              </div>

              {/* Custom Name Input - Show only when Custom is selected */}
              {formData.nameType === 'Custom' && (
                <div>
                  <label className="block text-sm font-medium mb-1">Custom Budget Name</label>
                  <Input
                    type="text"
                    placeholder="Enter custom budget name (e.g., january-budget)"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
              )}

              {/* Month Selection */}
              <div>
                <label className="block text-sm font-medium mb-1">Month</label>
                <select
                  className="w-full p-2 border rounded dark:bg-black dark:border-gray-700"
                  value={formData.month}
                  onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                  required
                >
                  <option value="">Select Month</option>
                  <option value="2024-07">July 2024</option>
                  <option value="2024-08">August 2024</option>
                  <option value="2024-09">September 2024</option>
                  <option value="2024-10">October 2024</option>
                  <option value="2024-11">November 2024</option>
                  <option value="2024-12">December 2024</option>
                </select>
              </div>

              {/* Budget Limit */}
              <div>
                <label className="block text-sm font-medium mb-1">Budget Limit</label>
                <Input
                  type="number"
                  placeholder="Monthly Limit (₹)"
                  value={formData.limit}
                  onChange={(e) => setFormData({ ...formData, limit: e.target.value })}
                  required
                />
              </div>
              
              <Button type="submit">{editingBudget ? 'Update' : 'Save'}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </main>
  )
}