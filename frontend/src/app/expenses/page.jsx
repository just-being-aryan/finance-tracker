'use client'

import { useEffect, useState } from 'react'
import axiosInstance from '@/utils/axiosInstance'
import Sidebar from '@/component/Sidebar'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select'
import {
  Popover, PopoverContent, PopoverTrigger
} from '@/components/ui/popover'
import { Dialog, DialogContent, DialogTitle} from '@/components/ui/dialog'
import { Calendar } from '@/components/ui/calendar'
import { format } from 'date-fns'

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('')
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [loading, setLoading] = useState(true)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editExpense, setEditExpense] = useState(null)
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    date: '',
    paymentMethod: '',
    notes: ''
  })

  const fetchExpenses = async () => {
    try {
      setLoading(true)
      const params = {}

      if (search) params.search = search
      if (category) params.category = category
      if (paymentMethod) params.paymentMethod = paymentMethod
      if (startDate) params.startDate = startDate.toISOString()
      if (endDate) params.endDate = endDate.toISOString()

      const res = await axiosInstance.get('/api/expenses/getExpense', { params })
      setExpenses(res.data.expenses || [])
    } catch (err) {
      console.error('Failed to fetch expenses:', err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchExpenses()
  }, [])

  const openAddModal = () => {
    setFormData({ amount: '', category: '', date: '', paymentMethod: '', notes: '' })
    setEditExpense(null)
    setIsModalOpen(true)
  }

  const openEditModal = (expense) => {
    setFormData({
      amount: expense.amount,
      category: expense.category,
      date: expense.date.split('T')[0],
      paymentMethod: expense.paymentMethod,
      notes: expense.notes || ''
    })
    setEditExpense(expense)
    setIsModalOpen(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this expense?')) return

    try {
      await axiosInstance.delete(`/api/expenses/${id}`)
      alert('Expense deleted')
      fetchExpenses()
    } catch (err) {
      console.error(err)
      alert('Failed to delete expense')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editExpense) {
        await axiosInstance.put(`/api/expenses/${editExpense._id}`, formData)
        alert('Expense updated')
      } else {
        await axiosInstance.post('/api/expenses/addExpense', formData)
        alert('Expense added')
      }
      setIsModalOpen(false)
      fetchExpenses()
    } catch (err) {
      console.error(err)
      alert('Error saving expense')
    }
  }

  return (
    <main className="flex min-h-screen bg-white dark:bg-black text-black dark:text-white transition-all duration-300">
      <Sidebar />

      <div className="flex-1 p-10">
        <h1 className="text-3xl font-bold text-primary mb-6">Expenses</h1>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Input
            placeholder="Search notes, category, method..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <Select onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              {['Food', 'Rent', 'Healthcare', 'Shopping', 'EMIs', 'Travel', 'other'].map((cat) => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>

           <Select onValueChange={setPaymentMethod}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Payment Method" />
              </SelectTrigger>
              <SelectContent>
                {['UPI', 'Credit Card', 'Debit Card', 'Cash', 'Net Banking'].map((method) => (
                  <SelectItem key={method} value={method}>{method}</SelectItem>
                ))}
              </SelectContent>
            </Select>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mb-6">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left">
                {startDate ? format(startDate, 'PPP') : 'Start Date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={startDate} onSelect={setStartDate} />
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left">
                {endDate ? format(endDate, 'PPP') : 'End Date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={endDate} onSelect={setEndDate} />
            </PopoverContent>
          </Popover>
        </div>

        <Button className="mb-6" onClick={fetchExpenses}>
          Search
        </Button>
        <Button variant="secondary" onClick={openAddModal} className="ml-2 mb-6">
          Add Expense
        </Button>

        {/* Table */}
        {loading ? (
          <p>Loading...</p>
        ) : expenses.length === 0 ? (
          <p>No expenses found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-border">
              <thead className="bg-muted text-left">
                <tr>
                  <th className="px-4 py-2">Amount</th>
                  <th className="px-4 py-2">Category</th>
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">Method</th>
                  <th className="px-4 py-2">Notes</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((exp) => (
                  <tr key={exp._id} className="border-t border-border">
                    <td className="px-4 py-2">₹ {exp.amount}</td>
                    <td className="px-4 py-2">{exp.category}</td>
                    <td className="px-4 py-2">{new Date(exp.date).toLocaleDateString()}</td>
                    <td className="px-4 py-2">{exp.paymentMethod}</td>
                    <td className="px-4 py-2">{exp.notes || '-'}</td>
                    <td className="px-4 py-2 space-x-2">
                      <Button size="sm" variant="outline" onClick={() => openEditModal(exp)}>Edit</Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(exp._id)}>Delete</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
<Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
  <DialogContent>
    <DialogTitle>{editExpense ? 'Edit Expense' : 'Add Expense'}</DialogTitle>
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="number"
        placeholder="Amount"
        value={formData.amount}
        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
        required
      />

      {/* Category Select using ShadCN */}
      <Select
        value={formData.category}
        onValueChange={(value) => setFormData({ ...formData, category: value })}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select Category" />
        </SelectTrigger>
        <SelectContent>
          {['Food', 'Rent', 'Healthcare', 'Shopping', 'EMIs', 'Travel', 'other'].map((cat) => (
            <SelectItem key={cat} value={cat}>
              {cat}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Input
        type="date"
        value={formData.date}
        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
        required
      />

      {/* Payment Method Select using ShadCN */}
      <Select
        value={formData.paymentMethod}
        onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select Payment Method" />
        </SelectTrigger>
        <SelectContent>
          {['UPI', 'Credit Card', 'Debit Card', 'Cash', 'Net Banking'].map((method) => (
            <SelectItem key={method} value={method}>
              {method}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Input
        placeholder="Notes (optional)"
        value={formData.notes}
        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
      />

      <Button type="submit">
        {editExpense ? 'Update Expense' : 'Add Expense'}
      </Button>
    </form>
  </DialogContent>
</Dialog>
      </div>
    </main>
  )
}
