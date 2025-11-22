'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import FortuneTellerList from '@/components/FortuneTellerList'
import Link from 'next/link'

export default function Home() {
  const router = useRouter()
  const { user, loading } = useAuth()

  return (
    <div className="min-h-screen bg-white">
      <main className="container mx-auto px-6 py-20">
        {/* Hero Section - Apple风格 */}
        <div className="text-center mb-24 animate-fade-in">
          <h1 className="text-6xl md:text-7xl font-semibold text-gray-900 mb-6 tracking-tight leading-tight">
            探索未来
            <br />
            <span className="text-warm-500">遇见可能</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
            专业的算命咨询服务，为您揭示人生的无限可能
          </p>
          {!user && (
            <div className="flex justify-center gap-4 animate-slide-up">
              <Link
                href="/register"
                className="btn-warm px-8 py-4 rounded-xl text-base font-medium"
              >
                立即开始
              </Link>
              <Link
                href="/fortune-tellers"
                className="btn-minimal px-8 py-4 rounded-xl text-base font-medium"
              >
                浏览命理师
              </Link>
            </div>
          )}
        </div>
        
        {/* Features - Apple风格卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
          <div className="card-apple p-8 text-center animate-scale-in">
            <div className="text-5xl mb-6">✨</div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">专业服务</h3>
            <p className="text-gray-600 leading-relaxed">经验丰富的命理师为您提供专业咨询</p>
          </div>
          <div className="card-apple p-8 text-center animate-scale-in" style={{ animationDelay: '0.1s' }}>
            <div className="text-5xl mb-6">🔒</div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">安全支付</h3>
            <p className="text-gray-600 leading-relaxed">安全可靠的支付系统保障您的权益</p>
          </div>
          <div className="card-apple p-8 text-center animate-scale-in" style={{ animationDelay: '0.2s' }}>
            <div className="text-5xl mb-6">💬</div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">实时沟通</h3>
            <p className="text-gray-600 leading-relaxed">与命理师实时聊天，获得即时解答</p>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-4xl font-semibold text-gray-900 mb-12 text-center tracking-tight">
            精选命理师
          </h2>
          <FortuneTellerList />
        </div>
      </main>
    </div>
  )
}



