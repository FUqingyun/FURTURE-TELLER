'use client'

import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter, usePathname } from 'next/navigation'
import { motion } from 'framer-motion'

function NavLink({ 
  href, 
  children, 
  className = "px-4 py-2" 
}: { 
  href: string, 
  children: React.ReactNode,
  className?: string
}) {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <Link 
      href={href}
      className={`relative ${className} text-sm font-medium transition-colors duration-200`}
    >
      {isActive && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-warm-500 to-warm-600 rounded-lg shadow-lg"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        />
      )}
      <span className={`relative z-10 ${isActive ? 'text-white' : 'text-gray-600 hover:text-gray-900'}`}>
        {children}
      </span>
    </Link>
  )
}

export default function Header() {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  return (
    <header className="glass sticky top-0 z-50 border-b border-gray-200/50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link 
            href="/" 
            className="text-3xl font-semibold text-gray-900 tracking-tight hover:opacity-80 transition-opacity duration-200"
          >
            易玄宏
          </Link>
          <nav className="flex items-center space-x-4 md:space-x-6">
            {/* 根据角色显示左侧导航项 */}
            {user?.role === 'fortune_teller' ? (
              <>
                <NavLink href="/dashboard">工作台</NavLink>
                <NavLink href="/dashboard/orders">订单</NavLink>
                <NavLink href="/profile">服务</NavLink>
              </>
            ) : (
              <>
                <NavLink href="/fortune-tellers">命理师</NavLink>
                {user && <NavLink href="/orders">我的订单</NavLink>}
              </>
            )}

            {/* 右侧用户区域或登录注册 */}
            {user ? (
              <>
                <div className="flex items-center space-x-4 ml-2 pl-2 border-l border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-warm-400 to-warm-500 rounded-full flex items-center justify-center shadow-sm">
                      <span className="text-white font-medium text-xs">
                        {user.username[0].toUpperCase()}
                      </span>
                    </div>
                    <span className="text-gray-700 text-sm font-medium hidden md:block">
                      {user.username}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="btn-minimal px-4 py-2 rounded-lg text-sm font-medium"
                  >
                    退出
                  </button>
                </div>
              </>
            ) : (
              <>
                <NavLink href="/login" className="px-6 py-2.5">登录</NavLink>
                <NavLink href="/register" className="px-6 py-2.5">注册</NavLink>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
