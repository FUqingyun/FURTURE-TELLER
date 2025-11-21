'use client'

import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

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
            className="text-2xl font-semibold text-gray-900 tracking-tight hover:opacity-80 transition-opacity duration-200"
          >
            Future Teller
          </Link>
          <nav className="flex items-center space-x-8">
            <Link 
              href="/fortune-tellers" 
              className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors duration-200"
            >
              命理师
            </Link>
            {user ? (
              <>
                <Link 
                  href="/orders" 
                  className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors duration-200"
                >
                  我的订单
                </Link>
                <div className="flex items-center space-x-4">
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
                <Link 
                  href="/login" 
                  className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors duration-200"
                >
                  登录
                </Link>
                <Link
                  href="/register"
                  className="btn-warm px-6 py-2.5 rounded-lg text-sm font-medium"
                >
                  注册
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}

