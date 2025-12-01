'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import LoadingSpinner from '@/components/LoadingSpinner'
import api from '@/lib/api'

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState({
    pendingOrders: 0,
    todayEarnings: 0,
    newCustomers: 0,
    activeOrders: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading) {
      if (!user || user.role !== 'fortune_teller') {
        router.push('/')
      } else {
        fetchStats()
      }
    }
  }, [user, authLoading])

  const fetchStats = async () => {
    try {
      // 这里可以调用后端 API 获取真实数据
      // 暂时用模拟数据或简单的 API 调用
      const response = await api.get('/orders')
      const orders = response.data.data || []
      
      // 简单统计
      const pending = orders.filter((o: any) => o.status === 'paid').length
      const active = orders.filter((o: any) => o.status === 'completed').length // 假设 completed 是活跃的，实际应为 processing
      
      setStats({
        pendingOrders: pending,
        todayEarnings: 0, // 需要后端支持
        newCustomers: 0, // 需要后端支持
        activeOrders: active
      })
    } catch (error) {
      console.error('获取数据失败', error)
    } finally {
      setLoading(false)
    }
  }

  if (authLoading || loading) return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner /></div>

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">工作台</h1>
          <p className="text-gray-600 mt-1">欢迎回来，{user?.username} 师傅。祝您今日开卦大吉。</p>
        </div>

        {/* 核心数据卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="text-gray-500 text-sm font-medium mb-2">待处理订单</div>
            <div className="text-3xl font-bold text-warm-600">{stats.pendingOrders}</div>
            <div className="text-xs text-gray-400 mt-2">需要尽快回复</div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="text-gray-500 text-sm font-medium mb-2">今日收入</div>
            <div className="text-3xl font-bold text-gray-900">${stats.todayEarnings}</div>
            <div className="text-xs text-gray-400 mt-2">本周累计: $0</div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="text-gray-500 text-sm font-medium mb-2">新客户</div>
            <div className="text-3xl font-bold text-gray-900">{stats.newCustomers}</div>
            <div className="text-xs text-gray-400 mt-2">较昨日 +0</div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="text-gray-500 text-sm font-medium mb-2">进行中咨询</div>
            <div className="text-3xl font-bold text-blue-600">{stats.activeOrders}</div>
            <div className="text-xs text-gray-400 mt-2">当前活跃会话</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 快捷入口 */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">快捷入口</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/dashboard/orders" className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors group">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl mb-3 group-hover:bg-blue-200 transition-colors">📋</div>
                <span className="text-sm font-medium text-gray-700">订单管理</span>
              </Link>
              <Link href="/profile" className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-xl hover:bg-purple-50 transition-colors group">
                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-2xl mb-3 group-hover:bg-purple-200 transition-colors">⚙️</div>
                <span className="text-sm font-medium text-gray-700">服务设置</span>
              </Link>
              <Link href="/dashboard/customers" className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-xl hover:bg-green-50 transition-colors group">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-2xl mb-3 group-hover:bg-green-200 transition-colors">👥</div>
                <span className="text-sm font-medium text-gray-700">客户管理</span>
              </Link>
            </div>
          </div>

          {/* 系统公告 */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">平台公告</h2>
            <div className="space-y-4">
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                <div className="text-sm font-medium text-gray-800 mb-1">结算通知</div>
                <p className="text-xs text-gray-600">上周收益已结算，请前往收益中心查看。</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

