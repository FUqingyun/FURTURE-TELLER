'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import api from '@/lib/api'
import SkeletonCard from './SkeletonCard'
import LoadingSpinner from './LoadingSpinner'

interface FortuneTeller {
  _id: string
  name: string
  bio: string
  specialties: string[]
  rating: number
  reviewCount: number
  pricePerSession: number
  avatar: string
  isAvailable: boolean
}

export default function FortuneTellerList() {
  const [fortuneTellers, setFortuneTellers] = useState<FortuneTeller[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFortuneTellers()
  }, [])

  const fetchFortuneTellers = async () => {
    try {
      const response = await api.get('/fortune-tellers')
      setFortuneTellers(response.data.data)
    } catch (error) {
      console.error('获取命理师列表失败:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    )
  }

  if (fortuneTellers.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🔮</div>
        <p className="text-gray-600 text-lg">暂无命理师，请稍后再试</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {fortuneTellers.map((teller, index) => (
        <Link
          key={teller._id}
          href={`/fortune-tellers/${teller._id}`}
          className="card-apple p-6 group"
          style={{ animationDelay: `${index * 0.05}s` }}
        >
          <div className="flex items-center mb-5">
            <div className="w-16 h-16 bg-gradient-to-br from-warm-400 to-warm-500 rounded-full flex items-center justify-center mr-4 shadow-sm ring-2 ring-warm-100 group-hover:ring-warm-200 transition-all duration-300">
              {teller.avatar ? (
                <img 
                  src={teller.avatar} 
                  alt={teller.name} 
                  className="w-16 h-16 rounded-full object-cover" 
                />
              ) : (
                <span className="text-2xl text-white font-semibold">{teller.name[0]}</span>
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-warm-600 transition-colors duration-200">
                {teller.name}
              </h3>
              <div className="flex items-center mt-1.5">
                <div className="flex items-center bg-yellow-50 px-2 py-0.5 rounded">
                  <span className="text-yellow-500 text-sm">★</span>
                  <span className="ml-1 text-gray-800 font-medium text-sm">{teller.rating.toFixed(1)}</span>
                </div>
                <span className="ml-2 text-gray-500 text-xs">({teller.reviewCount})</span>
              </div>
            </div>
          </div>
          <p className="text-gray-600 mb-5 line-clamp-2 min-h-[3rem] text-sm leading-relaxed">{teller.bio || '专业命理师，为您提供咨询服务'}</p>
          <div className="flex flex-wrap gap-2 mb-5">
            {teller.specialties.slice(0, 3).map((specialty, index) => (
              <span
                key={index}
                className="bg-warm-50 text-warm-700 px-3 py-1 rounded-full text-xs font-medium border border-warm-100"
              >
                {specialty}
              </span>
            ))}
          </div>
          <div className="flex items-center justify-between pt-5 border-t border-gray-100">
            <div>
              <span className="text-2xl font-semibold text-gray-900">
                ¥{teller.pricePerSession}
              </span>
              <span className="text-gray-500 text-xs ml-1">/次</span>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                teller.isAvailable
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-gray-50 text-gray-500 border border-gray-200'
              }`}
            >
              {teller.isAvailable ? '可预约' : '不可用'}
            </span>
          </div>
        </Link>
      ))}
    </div>
  )
}

