'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import api from '@/lib/api'
import LoadingSpinner from '@/components/LoadingSpinner'
import toast from 'react-hot-toast'

interface FortuneTellerProfile {
  _id?: string
  name: string
  avatar: string
  bio: string
  specialties: string[]
  experience: number | ''
  pricePerSession: number | ''
  isAvailable: boolean
  rating?: number
  reviewCount?: number
}

export default function ProfilePage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [profile, setProfile] = useState<FortuneTellerProfile>({
    name: '',
    avatar: '',
    bio: '',
    specialties: [],
    experience: '',
    pricePerSession: '',
    isAvailable: true
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [specialtyInput, setSpecialtyInput] = useState('')

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login')
      } else if (user.role !== 'fortune_teller') {
        router.push('/')
      } else {
        fetchProfile()
      }
    }
  }, [user, authLoading])

  const fetchProfile = async () => {
    try {
      const response = await api.get('/fortune-tellers/me')
      setProfile(response.data.data)
    } catch (error: any) {
      if (error.response?.status === 404) {
        // 还没有创建资料，使用默认值
        setProfile(prev => ({ ...prev, name: user?.username || '' }))
      } else {
        toast.error('获取资料失败')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const toastId = toast.loading('正在上传头像...')
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      setProfile(prev => ({ ...prev, avatar: response.data.data.url }))
      toast.success('头像上传成功', { id: toastId })
    } catch (error: any) {
      toast.error(error.response?.data?.message || '上传失败', { id: toastId })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // 验证必填项
    if (profile.specialties.length === 0) {
      toast.error('请至少添加一个擅长领域')
      return
    }

    setSaving(true)

    try {
      if (profile._id) {
        // 更新
        await api.put(`/fortune-tellers/${profile._id}`, profile)
        toast.success('资料已更新')
      } else {
        // 创建
        const response = await api.post('/fortune-tellers', profile)
        setProfile(response.data.data)
        toast.success('资料已创建')
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || '保存失败')
    } finally {
      setSaving(false)
    }
  }

  const addSpecialty = () => {
    if (specialtyInput.trim() && !profile.specialties.includes(specialtyInput.trim())) {
      setProfile({
        ...profile,
        specialties: [...profile.specialties, specialtyInput.trim()]
      })
      setSpecialtyInput('')
    }
  }

  const removeSpecialty = (index: number) => {
    setProfile({
      ...profile,
      specialties: profile.specialties.filter((_, i) => i !== index)
    })
  }

  if (authLoading || loading) return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner /></div>

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">我的服务资料</h1>
            <p className="text-gray-600 mt-2">完善您的命理师资料，让更多客户了解您。</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-8">
            {/* 基本信息 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <span className="w-1 h-6 bg-warm-500 rounded-full mr-3"></span>
                基本信息
              </h2>
              <div className="grid gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    头像链接 <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-4 items-center">
                    <div className="relative group cursor-pointer">
                      <div className="w-20 h-20 rounded-full bg-gray-100 flex-shrink-0 overflow-hidden border border-gray-200">
                        {profile.avatar ? (
                          <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300 text-2xl font-bold">
                            {profile.name ? profile.name[0] : '?'}
                          </div>
                        )}
                      </div>
                      <label className="absolute inset-0 flex items-center justify-center bg-black/50 text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity rounded-full cursor-pointer">
                        更换
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={handleUpload}
                        />
                      </label>
                    </div>
                    <div className="flex-1">
                      <label className="btn-minimal px-4 py-2 rounded-lg text-sm font-medium cursor-pointer inline-block">
                        上传新头像
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={handleUpload}
                        />
                      </label>
                      <p className="text-xs text-gray-500 mt-2">支持 JPG, PNG 格式，最大 5MB。</p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    显示名称 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={profile.name}
                    onChange={e => setProfile({ ...profile, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-warm-500/20 focus:border-warm-500 transition-all outline-none"
                    placeholder="例如：易学大师"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    个人简介 <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={profile.bio}
                    onChange={e => setProfile({ ...profile, bio: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-warm-500/20 focus:border-warm-500 transition-all outline-none resize-none"
                    placeholder="介绍您的背景、经验和理念..."
                  />
                </div>
              </div>
            </section>

            <div className="h-px bg-gray-100"></div>

            {/* 专业能力 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <span className="w-1 h-6 bg-warm-500 rounded-full mr-3"></span>
                专业能力
              </h2>
              <div className="grid gap-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      从业年限 (年) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      required
                      value={profile.experience}
                      onChange={e => setProfile({ ...profile, experience: e.target.value === '' ? '' : Number(e.target.value) })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-warm-500/20 focus:border-warm-500 transition-all outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      咨询价格 (元/次) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      required
                      value={profile.pricePerSession}
                      onChange={e => setProfile({ ...profile, pricePerSession: e.target.value === '' ? '' : Number(e.target.value) })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-warm-500/20 focus:border-warm-500 transition-all outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    擅长领域 <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={specialtyInput}
                      onChange={e => setSpecialtyInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSpecialty())}
                      className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-warm-500/20 focus:border-warm-500 transition-all outline-none"
                      placeholder="输入领域后按回车添加（如：八字、塔罗）"
                    />
                    <button
                      type="button"
                      onClick={addSpecialty}
                      className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 font-medium transition-colors"
                    >
                      添加
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {profile.specialties.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-lg bg-warm-50 text-warm-700 text-sm font-medium"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeSpecialty(index)}
                          className="ml-2 text-warm-400 hover:text-warm-600"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <div className="h-px bg-gray-100"></div>

            {/* 服务状态 */}
            <section>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">接单状态</h2>
                  <p className="text-sm text-gray-500 mt-1">开启后，客户可以在列表中看到您并下单</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={profile.isAvailable}
                    onChange={e => setProfile({ ...profile, isAvailable: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-warm-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-warm-500"></div>
                </label>
              </div>
            </section>

            <div className="pt-6">
              <button
                type="submit"
                disabled={saving}
                className="w-full btn-warm py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {saving ? '保存中...' : '保存资料'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}

