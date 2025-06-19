import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Check, Zap, Crown, Star } from 'lucide-react'
import { useToast } from '../hooks/use-toast'

export default function SubscriptionPage() {
  const { user, refreshUser } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState<string | null>(null)

  const API_BASE_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:8000'

  const handleSubscription = async (tier: 'basic' | 'premium') => {
    if (!user) return

    setLoading(tier)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_BASE_URL}/subscriptions/create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          tier: tier,
          payment_method_id: 'pm_demo_card'
        })
      })

      if (response.ok) {
        const data = await response.json()
        await refreshUser()
        toast({
          title: "Subscription Updated!",
          description: data.message
        })
      } else {
        throw new Error('Subscription failed')
      }
    } catch (error) {
      toast({
        title: "Subscription Failed",
        description: "Please try again later",
        variant: "destructive"
      })
    } finally {
      setLoading(null)
    }
  }

  const plans = [
    {
      name: 'Basic',
      tier: 'basic' as const,
      price: '$8',
      description: 'Perfect for getting started with AI-powered learning',
      features: [
        '50 AI queries per month',
        'Access to Novice & Intermediate content',
        'Progress tracking',
        'Email support',
        'Mobile app access'
      ],
      icon: Zap,
      popular: false
    },
    {
      name: 'Premium',
      tier: 'premium' as const,
      price: '$12',
      description: 'For serious learners who want unlimited access',
      features: [
        '200 AI queries per month',
        'Access to ALL content levels (including Pro)',
        'Advanced progress analytics',
        'Priority support',
        'Early access to new features',
        'Downloadable resources'
      ],
      icon: Crown,
      popular: true
    }
  ]

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Choose Your Learning Plan
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Unlock the full potential of AI-powered learning with our flexible subscription plans
        </p>
      </div>

      {user && (
        <div className="mb-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-blue-900">Current Subscription</h3>
              <p className="text-blue-700">
                You're currently on the <Badge className="mx-1 capitalize">{user.subscription_tier}</Badge> plan
              </p>
              <p className="text-sm text-blue-600 mt-1">
                {user.ai_queries_used} of {user.ai_queries_limit} AI queries used this month
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-900 capitalize">{user.subscription_tier}</div>
              <div className="text-sm text-blue-600">
                Expires: {new Date(user.subscription_expires).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {plans.map((plan) => {
          const Icon = plan.icon
          const isCurrentPlan = user?.subscription_tier === plan.tier
          
          return (
            <Card 
              key={plan.tier} 
              className={`relative ${plan.popular ? 'border-blue-500 shadow-lg scale-105' : 'border-gray-200'}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-600 text-white px-4 py-1">
                    <Star className="h-3 w-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  <div className={`p-3 rounded-full ${plan.popular ? 'bg-blue-100' : 'bg-gray-100'}`}>
                    <Icon className={`h-8 w-8 ${plan.popular ? 'text-blue-600' : 'text-gray-600'}`} />
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  {plan.price}
                  <span className="text-lg font-normal text-gray-600">/month</span>
                </div>
                <CardDescription className="text-base">{plan.description}</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button
                  onClick={() => handleSubscription(plan.tier)}
                  disabled={loading === plan.tier || isCurrentPlan}
                  className={`w-full ${plan.popular ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                  variant={plan.popular ? 'default' : 'outline'}
                >
                  {loading === plan.tier ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Processing...</span>
                    </div>
                  ) : isCurrentPlan ? (
                    'Current Plan'
                  ) : user?.subscription_tier === 'basic' && plan.tier === 'premium' ? (
                    'Upgrade to Premium'
                  ) : user?.subscription_tier === 'premium' && plan.tier === 'basic' ? (
                    'Downgrade to Basic'
                  ) : (
                    `Choose ${plan.name}`
                  )}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="mt-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Can I change my plan anytime?</h3>
            <p className="text-gray-600">Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">What happens to unused AI queries?</h3>
            <p className="text-gray-600">AI queries reset monthly and don't roll over. Make sure to use them before your billing cycle ends!</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Is there a free trial?</h3>
            <p className="text-gray-600">New users get 30 days of Basic plan access to try out the platform.</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">How does billing work?</h3>
            <p className="text-gray-600">You're billed monthly on the date you first subscribed. All payments are processed securely through Stripe.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
