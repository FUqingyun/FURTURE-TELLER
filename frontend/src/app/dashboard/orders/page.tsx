'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import LoadingSpinner from '@/components/LoadingSpinner'
import api from '@/lib/api'
import toast from 'react-hot-toast'

interface Order {
  _id: string
  orderNumber: string
  amount: number
  status: string
  createdAt: string
  customerId: {
    username: string
    email: string
  }
}

const statusColors: Record<string, string> = {
  paid: 'bg-blue-100 text-blue-800', // 已支付=待接单
  in_progress: 'bg-yellow-100 text-yellow-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  refunded: 'bg-gray-100 text-gray-800'
}

const statusText: Record<string, string> = {
  paid: '待接单',
  in_progress: '进行中',
  completed: '已完成',
  cancelled: '已取消',
  refunded: '已退款'
}

export default function FortuneTellerOrders() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    if (!authLoading) {
      if (!user || user.role !== 'fortune_teller') {
        router.push('/')
      } else {
        fetchOrders()
      }
    }
  }, [user, authLoading])

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders')
      setOrders(response.data.data)
    } catch (error) {
      console.error('获取订单失败', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAcceptOrder = async (orderId: string) => {
    try {
      await api.patch(`/orders/${orderId}/status`, { status: 'in_progress' })
      toast.success('接单成功')
      router.push(`/orders/${orderId}/chat`)
    } catch (error) {
      console.error('接单失败', error)
      toast.error('接单失败，请重试')
    }
  }

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(o => o.status === filter)

  if (authLoading || loading) return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner /></div>

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">客户订单</h1>
            <p className="text-gray-600 mt-1">管理您的所有咨询订单。</p>
          </div>
          
          {/* 筛选器 */}
          <div className="flex bg-white p-1 rounded-lg border border-gray-200">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                filter === 'all' ? 'bg-warm-500 text-white' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              全部
            </button>
            <button
              onClick={() => setFilter('paid')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                filter === 'paid' ? 'bg-warm-500 text-white' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              待接单
            </button>
            <button
              onClick={() => setFilter('in_progress')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                filter === 'in_progress' ? 'bg-warm-500 text-white' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              进行中
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                filter === 'completed' ? 'bg-warm-500 text-white' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              已完成
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-2xl border border-gray-100">
              <div className="text-5xl mb-4">📭</div>
              <p className="text-gray-500">暂无订单数据</p>
            </div>
          ) : (
            filteredOrders.map(order => (
              <div key={order._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[order.status] || 'bg-gray-100'}`}>
                        {statusText[order.status] || order.status}
                      </span>
                      <span className="text-sm text-gray-400">#{order.orderNumber}</span>
                      <span className="text-sm text-gray-400">{new Date(order.createdAt).toLocaleString('zh-CN')}</span>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">
                      客户: {order.customerId.username}
                    </h3>
                    <p className="text-sm text-gray-600">
                      咨询费用: <span className="font-medium text-warm-600">${order.amount}</span>
                    </p>
                  </div>
                  
                  <div className="flex gap-3">
                    {order.status === 'paid' && (
                      <button
                        onClick={() => handleAcceptOrder(order._id)}
                        className="px-6 py-2 bg-warm-500 text-white rounded-lg text-sm font-medium hover:bg-warm-600 transition-colors"
                      >
                        立即接单
                      </button>
                    )}
                    {order.status === 'in_progress' && (
                      <Link
                        href={`/orders/${order._id}/chat`}
                        className="px-6 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors"
                      >
                        进入咨询
                      </Link>
                    )}
                    {order.status === 'completed' && (
                      <Link
                        href={`/orders/${order._id}/chat`}
                        className="px-6 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                      >
                        查看记录
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  )
}
