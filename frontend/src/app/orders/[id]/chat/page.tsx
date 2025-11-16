'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { io, Socket } from 'socket.io-client'
import api from '@/lib/api'
import Header from '@/components/Header'
import { useAuth } from '@/contexts/AuthContext'
import toast from 'react-hot-toast'

interface Message {
  _id: string
  senderId: {
    _id: string
    username: string
    avatar: string
  }
  receiverId: {
    _id: string
    username: string
  }
  content: string
  messageType: string
  createdAt: string
  isRead: boolean
}

interface Order {
  _id: string
  orderNumber: string
  status: string
  customerId: {
    _id: string
    username: string
  }
  fortuneTellerId: {
    _id: string
    name: string
  }
}

export default function ChatPage() {
  const params = useParams()
  const { user } = useAuth()
  const [order, setOrder] = useState<Order | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [socket, setSocket] = useState<Socket | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchOrder()
    fetchMessages()
    initializeSocket()

    return () => {
      if (socket) {
        socket.disconnect()
      }
    }
  }, [params.id])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const fetchOrder = async () => {
    try {
      const response = await api.get(`/orders/${params.id}`)
      setOrder(response.data.data)
    } catch (error) {
      toast.error('获取订单信息失败')
    }
  }

  const fetchMessages = async () => {
    try {
      const response = await api.get(`/messages/order/${params.id}`)
      setMessages(response.data.data)
    } catch (error) {
      toast.error('获取消息失败')
    } finally {
      setLoading(false)
    }
  }

  const initializeSocket = () => {
    const newSocket = io(process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000')
    
    newSocket.on('connect', () => {
      console.log('Socket连接成功')
      newSocket.emit('join-room', params.id)
    })

    newSocket.on('receive-message', (data: Message) => {
      setMessages((prev) => [...prev, data])
    })

    setSocket(newSocket)
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !socket) return

    try {
      const response = await api.post('/messages', {
        orderId: params.id,
        content: newMessage,
        messageType: 'text'
      })

      const message = response.data.data
      setMessages((prev) => [...prev, message])
      setNewMessage('')

      // 通过Socket发送消息
      socket.emit('send-message', {
        orderId: params.id,
        ...message
      })
    } catch (error: any) {
      toast.error(error.response?.data?.message || '发送消息失败')
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

  if (!order) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">订单不存在</div>
      </div>
    )
  }

  // 确定聊天对象
  const isCustomer = order.customerId._id === user?.id
  const chatPartner = isCustomer ? order.fortuneTellerId : order.customerId
  const chatPartnerName = isCustomer 
    ? order.fortuneTellerId.name 
    : order.customerId.username

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <div className="flex-1 container mx-auto px-6 py-8 flex flex-col max-w-5xl">
        <div className="card-apple flex-1 flex flex-col overflow-hidden">
          {/* 聊天头部 */}
          <div className="border-b border-gray-200/50 p-6 bg-white/50 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">
                  与 {chatPartnerName} 的聊天
                </h2>
                <p className="text-sm text-gray-500 mt-1">订单号: {order.orderNumber}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-warm-400 to-warm-500 rounded-full flex items-center justify-center shadow-sm ring-2 ring-warm-100">
                <span className="text-white font-semibold text-base">{chatPartnerName[0]}</span>
              </div>
            </div>
          </div>

          {/* 消息列表 */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50">
            {messages.length === 0 ? (
              <div className="text-center py-16 animate-fade-in">
                <div className="text-7xl mb-6">💬</div>
                <p className="text-gray-500 text-lg">还没有消息，开始对话吧</p>
              </div>
            ) : (
              messages.map((message) => {
                const isSender = message.senderId._id === user?.id
                return (
                  <div
                    key={message._id}
                    className={`flex ${isSender ? 'justify-end' : 'justify-start'} items-end gap-3 animate-fade-in`}
                  >
                    {!isSender && (
                      <div className="w-10 h-10 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                        <span className="text-white text-xs font-semibold">
                          {message.senderId.username[0].toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div
                      className={`max-w-xs lg:max-w-md px-5 py-3.5 rounded-2xl shadow-sm ${
                        isSender
                          ? 'bg-gradient-to-r from-warm-500 to-warm-600 text-white rounded-br-md'
                          : 'bg-white text-gray-900 rounded-bl-md border border-gray-200/50'
                      }`}
                    >
                      {!isSender && (
                        <div className="text-xs font-semibold mb-1.5 text-gray-600">
                          {message.senderId.username}
                        </div>
                      )}
                      <div className={`${isSender ? 'text-white' : 'text-gray-900'} break-words leading-relaxed`}>
                        {message.content}
                      </div>
                      <div className={`text-xs mt-2 ${isSender ? 'text-white/70' : 'text-gray-400'}`}>
                        {new Date(message.createdAt).toLocaleTimeString('zh-CN', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                    {isSender && (
                      <div className="w-10 h-10 bg-gradient-to-br from-warm-400 to-warm-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                        <span className="text-white text-xs font-semibold">
                          {user?.username[0].toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                )
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* 输入框 */}
          {order.status === 'paid' || order.status === 'completed' ? (
            <form onSubmit={handleSendMessage} className="border-t border-gray-200/50 p-5 bg-white/80 backdrop-blur-sm">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="输入消息..."
                  className="flex-1 border border-gray-200 rounded-xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-warm-500 focus:border-transparent transition-all bg-white text-gray-900 placeholder-gray-400 text-sm"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="btn-warm px-8 py-3.5 rounded-xl text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  发送
                </button>
              </div>
            </form>
          ) : (
            <div className="border-t border-gray-200/50 p-6 text-center bg-warm-50/50">
              <p className="text-warm-800 font-medium text-sm mb-2">
                ⚠️ 订单未支付，无法发送消息
              </p>
              <Link
                href={`/orders/${order._id}/payment`}
                className="text-warm-600 hover:text-warm-700 font-semibold text-sm inline-block"
              >
                前往支付 →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

