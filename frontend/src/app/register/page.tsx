'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'
import toast from 'react-hot-toast'
import api from '@/lib/api'

export default function RegisterPage() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [role, setRole] = useState('customer')
  const [loading, setLoading] = useState(false)
  const [sendingCode, setSendingCode] = useState(false)
  const [countdown, setCountdown] = useState(0)
  
  const { register } = useAuth()
  const router = useRouter()

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown(prev => prev - 1)
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [countdown])

  const handleSendCode = async () => {
    if (!email) {
      toast.error('请输入邮箱')
      return
    }

    setSendingCode(true)
    try {
      await api.post('/auth/send-code', {
        target: email,
        type: 'email'
      })
      toast.success('验证码已发送')
      setCountdown(60)
    } catch (error: any) {
      toast.error(error.response?.data?.message || '发送失败')
    } finally {
      setSendingCode(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await api.post('/auth/register', {
        username,
        email,
        password,
        code,
        role
      })
      
      const { token, user } = response.data
      localStorage.setItem('token', token)
      window.location.href = '/'
      toast.success('注册成功')
    } catch (error: any) {
      if (error.response?.data?.errors) {
        const msgs = error.response.data.errors.map((e: any) => e.msg).join(', ')
        toast.error(msgs)
      } else {
        toast.error(error.response?.data?.message || '注册失败')
      }
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
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  用户名
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-warm-500 focus:border-transparent transition-all bg-white text-gray-900 placeholder-gray-400"
                  placeholder="请输入用户名"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  邮箱地址
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-warm-500 focus:border-transparent transition-all bg-white text-gray-900 placeholder-gray-400"
                  placeholder="请输入您的邮箱"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  验证码
                </label>
                <div className="flex gap-3 items-center">
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="flex-[7] px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-warm-500 focus:border-transparent transition-all bg-white text-gray-900 placeholder-gray-400"
                    placeholder="6位数字"
                    required
                    maxLength={6}
                  />
                  <button
                    type="button"
                    onClick={handleSendCode}
                    disabled={sendingCode || countdown > 0}
                    className="flex-[3] py-3.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap px-2"
                  >
                    {countdown > 0 ? `${countdown}s` : (sendingCode ? '发送中' : '获取验证码')}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  密码
                </label>
                <input
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
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  注册身份
                </label>
                <select
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
                className="w-full btn-warm py-3.5 px-4 rounded-xl text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all"
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
