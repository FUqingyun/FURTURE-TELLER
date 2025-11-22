'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('customer')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await register(username, email, password, role)
      toast.success('注册成功')
      router.push('/')
    } catch (error: any) {
      toast.error(error.message || '注册失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-6 py-20">
        <div className="max-w-md w-full animate-fade-in">
          <div className="card-apple p-10">
            <div className="text-center mb-10">
              <h2 className="text-4xl font-semibold text-gray-900 mb-3 tracking-tight">创建账号</h2>
              <p className="text-gray-600 text-lg">加入我们，开启您的未来之旅</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="username">
                  用户名
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-warm-500 focus:border-transparent transition-all bg-white text-gray-900 placeholder-gray-400"
                  placeholder="请输入用户名"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="email">
                  邮箱地址
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-warm-500 focus:border-transparent transition-all bg-white text-gray-900 placeholder-gray-400"
                  placeholder="请输入您的邮箱"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="password">
                  密码
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-warm-500 focus:border-transparent transition-all bg-white text-gray-900 placeholder-gray-400"
                  placeholder="请输入密码（至少6位）"
                  required
                  minLength={6}
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="role">
                  注册身份
                </label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-warm-500 focus:border-transparent transition-all bg-white text-gray-900"
                >
                  <option value="customer">客户 - 寻求咨询服务</option>
                  <option value="fortune_teller">命理师 - 提供咨询服务</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-warm py-3.5 px-4 rounded-xl text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                    注册中...
                  </span>
                ) : (
                  '立即注册'
                )}
              </button>
            </form>
            <p className="mt-8 text-center text-gray-600 text-sm">
              已有账号？{' '}
              <Link href="/login" className="text-warm-600 hover:text-warm-700 font-medium hover:underline">
                立即登录
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}



