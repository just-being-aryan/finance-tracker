'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import axiosInstance from '@/utils/axiosInstance'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ThemeToggle } from './theme-toggle'

export default function RegisterPage() {
  const router = useRouter()

  const [formData, setFormData] = useState({
    username: '',
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
      const res = await axiosInstance.post('/api/users/register', formData)
      alert('Registration successful! Please login.')
      router.push('/login')
    } catch (err) {
      console.error(err)
      alert(err?.response?.data?.message || 'Registration failed')
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

      {/* Centered Content */}
      <div className="flex items-center justify-center h-full px-4 py-20">
        <div className="w-full max-w-md space-y-6">

          {/* Tagline + Subheading */}
          <div className="text-center space-y-2">
            <h2 className="text-4xl font-semibold mt-20 mb-4">
              Manage your expenses with <span className="text-primary font-extrabold">TrackIt</span>
            </h2>
            <p className="text-muted-foreground">Start creating a budget now!</p>
          </div>

          {/* Register Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-4 bg-white dark:bg-zinc-900 shadow-xl p-8 rounded-xl border border-border"
          >
            <div>
              <label htmlFor="username" className="block text-sm font-medium mb-1">
                Username
              </label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="Enter username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>

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
              {loading ? 'Registering...' : 'Register'}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Already have an account? <a href="/login" className="underline">Login</a>
            </p>
          </form>
        </div>
      </div>
    </main>
  )
}
