import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../components/Navbar'

const BASE_URL = 'https://edututor-mbl4.onrender.com'

function StatCard({ label, value, icon, color }) {
  return (
    <div className="card flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-ink-muted text-xs font-medium uppercase tracking-wide">{label}</p>
        <p className="font-display text-2xl font-bold text-ink mt-0.5">{value ?? '—'}</p>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const email = localStorage.getItem('email') || ''
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await axios.post(`${BASE_URL}/student_dashboard/`, { email })
        setData(res.data)
      } catch (err) {
        setError('Failed to load dashboard data.')
      } finally {
        setLoading(false)
      }
    }
    fetchDashboard()
  }, [email])

  return (
    <div className="flex min-h-screen bg-bg text-slate-800">
      <Navbar />

      <main className="flex-1 px-6 md:px-10 py-8 overflow-y-auto">
        <div className="mb-8 space-y-3">
          <p className="section-heading">Dashboard</p>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-slate-900">
            Welcome back, {data?.name || email.split('@')[0]} 👋
          </h1>
          <p className="text-slate-500 text-sm md:text-base">{email}</p>
        </div>

        {loading && (
          <div className="flex items-center gap-3 text-ink-muted text-sm py-12">
            <svg className="animate-spin w-5 h-5 text-accent" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Loading your dashboard…
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm mb-6">
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <StatCard
                label="Tests Attended"
                value={data?.total_tests}
                icon="📝"
                color="bg-blue-50"
              />
              <StatCard
                label="Average Score"
                value={data?.average_score != null ? `${data.average_score}%` : null}
                icon="📊"
                color="bg-green-50"
              />
              <StatCard
                label="Latest Score"
                value={data?.latest_score != null ? `${data.latest_score}%` : null}
                icon="🏆"
                color="bg-accent-light"
              />
            </div>

            {/* Quick Actions */}
            <h2 className="font-display text-lg font-semibold text-ink mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link to="/mcq" className="card hover:shadow-md transition-all group flex items-start gap-4 no-underline">
                <div className="w-12 h-12 rounded-xl bg-accent-light flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition-transform">
                  📋
                </div>
                <div>
                  <h3 className="font-display font-semibold text-ink group-hover:text-accent transition-colors">Take a Test</h3>
                  <p className="text-ink-muted text-sm mt-0.5">Generate AI-powered MCQs on any subject</p>
                </div>
              </Link>

              <Link to="/chatbot" className="card hover:shadow-md transition-all group flex items-start gap-4 no-underline">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition-transform">
                  🤖
                </div>
                <div>
                  <h3 className="font-display font-semibold text-ink group-hover:text-blue-600 transition-colors">AI Tutor</h3>
                  <p className="text-ink-muted text-sm mt-0.5">Ask your AI tutor any study question</p>
                </div>
              </Link>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
