'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import api from '@/lib/api'
import Header from '@/components/Header'
import { useAuth } from '@/contexts/AuthContext'
import toast from 'react-hot-toast'

interface FortuneTeller {
  _id: string
  name: string
  bio: string
  specialties: string[]
  rating: number
  reviewCount: number
  pricePerSession: number
  avatar: string
  experience: number
  languages: string[]
}

export default function FortuneTellerDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [fortuneTeller, setFortuneTeller] = useState<FortuneTeller | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      fetchFortuneTeller()
    }
  }, [params.id])

  const fetchFortuneTeller = async () => {
    try {
      const response = await api.get(`/fortune-tellers/${params.id}`)
      setFortuneTeller(response.data.data)
    } catch (error) {
      toast.error('获取算命师信息失败')
    } finally {
      setLoading(false)
    }
  }

  const handleBook = async () => {
    if (!user) {
      toast.error('请先登录')
      router.push('/login')
      return
    }

    try {
      const response = await api.post('/orders', {
        fortuneTellerId: params.id,
        amount: fortuneTeller?.pricePerSession,
        sessionDuration: 60
      })
      toast.success('订单创建成功')
      router.push(`/orders/${response.data.data._id}/payment`)
    } catch (error: any) {
      toast.error(error.response?.data?.message || '创建订单失败')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">加载中...</div>
      </div>
    )
  }

  if (!fortuneTeller) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">算命师不存在</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-6 py-12">
        <div className="card-apple p-10 md:p-16 animate-fade-in">
          <div className="flex flex-col md:flex-row gap-12">
            <div className="flex-shrink-0 flex justify-center md:justify-start">
              <div className="w-48 h-48 bg-gradient-to-br from-warm-400 to-warm-500 rounded-full flex items-center justify-center ring-8 ring-warm-100 shadow-xl">
                {fortuneTeller.avatar ? (
                  <img 
                    src={fortuneTeller.avatar} 
                    alt={fortuneTeller.name} 
                    className="w-48 h-48 rounded-full object-cover" 
                  />
                ) : (
                  <span className="text-6xl text-white font-semibold">{fortuneTeller.name[0]}</span>
                )}
              </div>
            </div>
            <div className="flex-1">
              <h1 className="text-5xl md:text-6xl font-semibold text-gray-900 mb-6 tracking-tight">{fortuneTeller.name}</h1>
              <div className="flex items-center mb-8">
                <div className="flex items-center bg-yellow-50 px-4 py-2 rounded-full">
                  <span className="text-yellow-500 text-2xl">★</span>
                  <span className="ml-2 text-2xl text-gray-900 font-semibold">{fortuneTeller.rating.toFixed(1)}</span>
                </div>
                <span className="ml-4 text-gray-600 text-lg">({fortuneTeller.reviewCount} 条评价)</span>
              </div>
              <p className="text-gray-700 text-xl mb-10 leading-relaxed font-light">{fortuneTeller.bio || '专业算命师，为您提供咨询服务'}</p>
              
              <div className="mb-10">
                <h3 className="font-semibold text-gray-900 mb-5 text-xl tracking-tight">专长领域</h3>
                <div className="flex flex-wrap gap-3">
                  {fortuneTeller.specialties.map((specialty, index) => (
                    <span
                      key={index}
                      className="bg-warm-50 text-warm-700 px-5 py-2.5 rounded-full text-sm font-medium border border-warm-200"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="mb-10 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-gray-600 text-sm mb-2 font-medium">经验年限</p>
                    <p className="text-gray-900 font-semibold text-2xl">{fortuneTeller.experience} 年</p>
                  </div>
                  {fortuneTeller.languages.length > 0 && (
                    <div>
                      <p className="text-gray-600 text-sm mb-2 font-medium">语言</p>
                      <p className="text-gray-900 font-semibold text-xl">{fortuneTeller.languages.join(', ')}</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-8 border-t border-gray-200">
                <div>
                  <p className="text-5xl font-semibold text-gray-900 mb-2 tracking-tight">
                    ¥{fortuneTeller.pricePerSession}
                  </p>
                  <p className="text-gray-500 text-sm">每次咨询</p>
                </div>
                <button
                  onClick={handleBook}
                  className="w-full sm:w-auto btn-warm px-12 py-4 rounded-xl text-lg font-medium"
                >
                  立即预约
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}



