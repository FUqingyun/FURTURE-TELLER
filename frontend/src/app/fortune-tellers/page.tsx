'use client'

import FortuneTellerList from '@/components/FortuneTellerList'
import Header from '@/components/Header'

export default function FortuneTellersPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">算命师列表</h1>
        <FortuneTellerList />
      </main>
    </div>
  )
}



