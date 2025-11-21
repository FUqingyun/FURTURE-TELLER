'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import api from '@/lib/api'
import Header from '@/components/Header'
import toast from 'react-hot-toast'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '')

interface Order {
  _id: string
  orderNumber: string
  amount: number
  status: string
  customerId: {
    username: string
    email: string
  }
  fortuneTellerId: {
    name: string
    avatar: string
  }
}

function CheckoutForm({ order, onSuccess }: { order: Order; onSuccess: () => void }) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [clientSecret, setClientSecret] = useState('')

  useEffect(() => {
    createPaymentIntent()
  }, [])

  const createPaymentIntent = async () => {
    try {
      const response = await api.post('/payments/create-payment-intent', {
        orderId: order._id
      })
      setClientSecret(response.data.clientSecret)
    } catch (error: any) {
      toast.error(error.response?.data?.message || '创建支付失败')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return

    setLoading(true)

    try {
      const cardElement = elements.getElement(CardElement)
      if (!cardElement) return

      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        }
      })

      if (error) {
        toast.error(error.message || '支付失败')
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        // 确认支付
        await api.post('/payments/confirm', { orderId: order._id })
        toast.success('支付成功！')
        onSuccess()
      }
    } catch (error: any) {
      toast.error('支付失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="border-2 border-gray-200 rounded-xl p-5 bg-white focus-within:border-warm-500 focus-within:ring-2 focus-within:ring-warm-500/20 transition-all">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#111827',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
                '::placeholder': {
                  color: '#9ca3af',
                },
              },
            },
          }}
        />
      </div>
      <button
        type="submit"
        disabled={!stripe || loading || !clientSecret}
        className="w-full btn-warm py-4 px-4 rounded-xl text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
            处理中...
          </span>
        ) : (
          `支付 ¥${order.amount}`
        )}
      </button>
    </form>
  )
}

export default function PaymentPage() {
  const params = useParams()
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      fetchOrder()
    }
  }, [params.id])

  const fetchOrder = async () => {
    try {
      const response = await api.get(`/orders/${params.id}`)
      setOrder(response.data.data)
    } catch (error) {
      toast.error('获取订单信息失败')
      router.push('/orders')
    } finally {
      setLoading(false)
    }
  }

  const handlePaymentSuccess = () => {
    router.push(`/orders/${params.id}/chat`)
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

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto animate-fade-in">
          <div className="card-apple p-10">
            <h2 className="text-4xl font-semibold text-gray-900 mb-8 tracking-tight">支付订单</h2>
            
            <div className="mb-8 p-6 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="space-y-3">
                <p className="text-gray-600 text-sm">
                  <span className="font-medium">订单号:</span> {order.orderNumber}
                </p>
                <p className="text-gray-600 text-sm">
                  <span className="font-medium">命理师:</span> {order.fortuneTellerId.name}
                </p>
                <div className="pt-3 border-t border-gray-200">
                  <p className="text-4xl font-semibold text-gray-900 tracking-tight">¥{order.amount}</p>
                  <p className="text-gray-500 text-sm mt-1">支付金额</p>
                </div>
              </div>
            </div>

            {order.status === 'paid' ? (
              <div className="text-center py-12 animate-scale-in">
                <div className="text-6xl mb-6">✅</div>
                <p className="text-gray-900 text-2xl font-semibold mb-8">订单已支付</p>
                <button
                  onClick={() => router.push(`/orders/${params.id}/chat`)}
                  className="btn-warm px-10 py-4 rounded-xl text-base font-medium"
                >
                  开始聊天
                </button>
              </div>
            ) : (
              <Elements stripe={stripePromise}>
                <CheckoutForm order={order} onSuccess={handlePaymentSuccess} />
              </Elements>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}



