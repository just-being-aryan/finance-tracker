'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import axiosInstance from '@/utils/axiosInstance'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ThemeToggle } from '../theme-toggle'

export default function LoginPage() {
  const router = useRouter()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await axiosInstance.post('/api/users/login', formData)

       
  console.log("🔍 Full login response:", res.data) // Add this
  console.log("🔍 Token from response:", res.data.token) // Add this
  console.log("🔍 User object:", res.data.user) // Add this
  console.log("🔍 User token:", res.data.user?.token) // Add this

      localStorage.setItem('token', res.data.user.token)

      alert('Login successful!')
      router.push('/dashboard')
    } catch (err) {
      console.error(err)
      alert(err?.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-white dark:bg-black text-black dark:text-white transition-all duration-300 relative">

      {/* Theme Toggle - Top Right */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      {/* App Name - Top Left */}
      <div className="absolute top-4 left-4">
        <h1 className="text-4xl font-extrabold text-primary tracking-tight">TrackIt</h1>
      </div>

      {/* Centered Login Form */}
      <div className="flex items-center justify-center h-full px-4 py-20">
        <div className="w-full max-w-md space-y-6">

          <div className="text-center space-y-2">
            <h2 className="text-4xl font-semibold mt-20 mb-4">
              Welcome back to <span className="text-primary font-extrabold">TrackIt</span>
            </h2>
            <p className="text-muted-foreground">Log in to access your dashboard</p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-4 bg-white dark:bg-zinc-900 shadow-xl p-8 rounded-xl border border-border"
          >
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <Button type="submit" className="w-full mt-2" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Don't have an account? <a href="/" className="underline">Register</a>
            </p>
          </form>
        </div>
      </div>
    </main>
  )
}
