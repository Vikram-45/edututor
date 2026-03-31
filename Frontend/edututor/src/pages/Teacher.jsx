import React from 'react'
import Navbar from '../components/Navbar'

export default function Teacher() {
  return (
    <div className="flex min-h-screen bg-bg text-slate-800">
      <Navbar />
      <main className="flex-1 px-4 md:px-8 py-8">
        <p className="section-heading">Teacher</p>
        <h1 className="font-display text-3xl font-bold text-slate-900">Teacher Dashboard</h1>
        <p className="text-slate-500 mt-2">This section is under construction. Teacher access is currently supported on backend.</p>
      </main>
    </div>
  )
}
