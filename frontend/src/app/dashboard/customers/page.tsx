'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import LoadingSpinner from '@/components/LoadingSpinner'
import api from '@/lib/api'

interface Customer {
  id: string
  username: string
  email: string
  orderCount: number
  lastOrderDate: string
}

export default function CustomersPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading) {
      if (!user || user.role !== 'fortune_teller') {
        router.push('/')
      } else {
        fetchCustomers()
      }
    }
  }, [user, authLoading])

  const fetchCustomers = async () => {
    try {
      const response = await api.get('/orders')
      const orders = response.data.data
      
      // 从订单中聚合客户数据
      const customerMap = new Map<string, Customer>()
      
      orders.forEach((order: any) => {
        const customer = order.customerId
        if (!customerMap.has(customer._id)) {
          customerMap.set(customer._id, {
            id: customer._id,
            username: customer.username,
            email: customer.email,
            orderCount: 0,
            lastOrderDate: order.createdAt
          })
        }
        
        const existing = customerMap.get(customer._id)!
        existing.orderCount += 1
        if (new Date(order.createdAt) > new Date(existing.lastOrderDate)) {
          existing.lastOrderDate = order.createdAt
        }
      })
      
      setCustomers(Array.from(customerMap.values()))
    } catch (error) {
      console.error('获取客户失败', error)
    } finally {
      setLoading(false)
    }
  }

  if (authLoading || loading) return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner /></div>

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">客户管理</h1>
          <p className="text-gray-600 mt-1">共 {customers.length} 位客户。</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {customers.map(customer => (
            <div key={customer.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-warm-100 rounded-full flex items-center justify-center text-warm-600 font-bold text-lg">
                  {customer.username[0].toUpperCase()}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{customer.username}</h3>
                  <p className="text-xs text-gray-500">{customer.email}</p>
                </div>
              </div>
              <div className="flex justify-between text-sm text-gray-600 border-t border-gray-50 pt-4">
                <div>
                  <span className="block text-xs text-gray-400">咨询次数</span>
                  <span className="font-medium">{customer.orderCount} 次</span>
                </div>
                <div className="text-right">
                  <span className="block text-xs text-gray-400">最近咨询</span>
                  <span className="font-medium">{new Date(customer.lastOrderDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

