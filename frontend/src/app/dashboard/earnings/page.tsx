'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function EarningsPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading) {
      if (!user || user.role !== 'fortune_teller') {
        router.push('/')
      } else {
        setLoading(false)
      }
    }
  }, [user, authLoading])

  if (authLoading || loading) return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner /></div>

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">收益中心</h1>
          <p className="text-gray-600 mt-1">查看您的收入和提现记录。</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-warm-500 to-warm-600 p-6 rounded-2xl text-white shadow-lg">
            <div className="text-white/80 text-sm font-medium mb-2">可提现金额</div>
            <div className="text-4xl font-bold">¥0.00</div>
            <button className="mt-6 w-full py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors backdrop-blur-sm">
              申请提现
            </button>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="text-gray-500 text-sm font-medium mb-2">本月预估收入</div>
            <div className="text-3xl font-bold text-gray-900">¥0.00</div>
            <div className="text-xs text-gray-400 mt-2">上月同期: ¥0.00</div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="text-gray-500 text-sm font-medium mb-2">累计总收入</div>
            <div className="text-3xl font-bold text-gray-900">¥0.00</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">收支明细</h3>
          </div>
          <div className="p-12 text-center text-gray-500">
            暂无收支记录
          </div>
        </div>
      </main>
    </div>
  )
}

