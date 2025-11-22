'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import api from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'

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
  fortuneTellerId: {
    name: string
    avatar: string
  }
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  paid: 'bg-green-100 text-green-800',
  completed: 'bg-blue-100 text-blue-800',
  cancelled: 'bg-red-100 text-red-800',
  refunded: 'bg-gray-100 text-gray-800'
}

const statusText: Record<string, string> = {
  pending: '待支付',
  paid: '已支付',
  completed: '已完成',
  cancelled: '已取消',
  refunded: '已退款'
}

export default function OrdersPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login')
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
      console.error('获取订单列表失败:', error)
    } finally {
      setLoading(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-8 text-center">加载中...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <main className="container mx-auto px-6 py-12">
        <div className="mb-12 animate-fade-in">
          <h1 className="text-5xl font-semibold text-gray-900 mb-3 tracking-tight">我的订单</h1>
          <p className="text-gray-600 text-lg">查看和管理您的所有订单</p>
        </div>
        
        {orders.length === 0 ? (
          <div className="card-apple p-16 text-center animate-scale-in">
            <div className="text-7xl mb-6">📋</div>
            <p className="text-gray-700 text-xl mb-8 font-medium">您还没有订单</p>
            <Link
              href="/fortune-tellers"
              className="inline-block btn-warm px-10 py-4 rounded-xl text-base font-medium"
            >
              浏览命理师
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, index) => (
              <div
                key={order._id}
                className="card-apple p-6 animate-scale-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-4">
                      <h3 className="text-xl font-semibold text-gray-900 tracking-tight">订单 {order.orderNumber}</h3>
                      <span
                        className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                          statusColors[order.status] || statusColors.pending
                        }`}
                      >
                        {statusText[order.status] || order.status}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <p className="text-gray-700 text-sm">
                        <span className="font-medium">{user?.role === 'customer' ? '命理师' : '客户'}:</span>{' '}
                        <span className="text-gray-900">{user?.role === 'customer'
                          ? order.fortuneTellerId.name
                          : order.customerId.username}</span>
                      </p>
                      <p className="text-gray-700 text-sm">
                        <span className="font-medium">金额:</span>{' '}
                        <span className="text-warm-600 font-semibold text-xl">¥{order.amount}</span>
                      </p>
                      <p className="text-gray-500 text-xs">
                        创建时间: {new Date(order.createdAt).toLocaleString('zh-CN')}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    {order.status === 'pending' && (
                      <Link
                        href={`/orders/${order._id}/payment`}
                        className="btn-warm px-6 py-3 rounded-xl text-sm font-medium text-center"
                      >
                        去支付
                      </Link>
                    )}
                    {(order.status === 'paid' || order.status === 'completed') && (
                      <Link
                        href={`/orders/${order._id}/chat`}
                        className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-green-700 transition-all font-medium text-center shadow-lg hover:shadow-xl"
                      >
                        开始聊天
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}



