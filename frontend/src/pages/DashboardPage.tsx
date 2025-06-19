import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { Progress } from '../components/ui/progress'
import { BookOpen, Trophy, Zap, Brain, Target, Star, Clock, Users, ArrowRight } from 'lucide-react'

interface Topic {
  id: number
  title: string
  description: string
  category: string
  levels: string[]
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [topics, setTopics] = useState<Topic[]>([])
  const [loading, setLoading] = useState(true)

  const API_BASE_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:8000'

  useEffect(() => {
    fetchTopics()
  }, [])

  const fetchTopics = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_BASE_URL}/topics`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setTopics(data)
      }
    } catch (error) {
      console.error('Failed to fetch topics:', error)
    } finally {
      setLoading(false)
    }
  }



  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen gradient-bg p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.full_name}! 🎯
          </h1>
          <p className="text-xl text-gray-600">
            Continue your learning journey with AI-powered assistance
          </p>
        </div>

        {user && (
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card className="card-hover border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">AI Queries Used</CardTitle>
                <Brain className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{user.ai_queries_used}</div>
                <p className="text-xs text-muted-foreground">
                  of {user.ai_queries_limit} this month
                </p>
                <Progress 
                  value={(user.ai_queries_used / user.ai_queries_limit) * 100} 
                  className="mt-3 h-2"
                />
              </CardContent>
            </Card>

            <Card className="card-hover border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Subscription</CardTitle>
                <Zap className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold capitalize text-primary">{user.subscription_tier}</div>
                <p className="text-xs text-muted-foreground">
                  {user.subscription_tier === 'basic' ? 'Upgrade for more features' : 'Premium features unlocked'}
                </p>
                {user.subscription_tier === 'basic' && (
                  <Link to="/subscription">
                    <Button size="sm" className="mt-2">
                      Upgrade
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>

            <Card className="card-hover border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Topics Available</CardTitle>
                <BookOpen className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{topics.length}</div>
                <p className="text-xs text-muted-foreground">
                  Across all difficulty levels
                </p>
              </CardContent>
            </Card>

            <Card className="card-hover border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Progress</CardTitle>
                <Trophy className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">24%</div>
                <p className="text-xs text-muted-foreground">
                  Overall completion
                </p>
                <Progress value={24} className="mt-3 h-2" />
              </CardContent>
            </Card>
          </div>
        )}

        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Learning Topics</h2>
              <p className="text-gray-600">Choose from our comprehensive technology curriculum</p>
            </div>
            <Button variant="outline" className="hidden md:flex">
              <Target className="mr-2 h-4 w-4" />
              View All Topics
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topics.map((topic) => (
              <Card key={topic.id} className="card-hover border-0 shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <BookOpen className="h-6 w-6 text-primary" />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {topic.levels.length} levels
                    </Badge>
                  </div>
                  <CardTitle className="text-xl mb-2">{topic.title}</CardTitle>
                  <CardDescription className="line-clamp-3 text-sm">
                    {topic.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>2-4 hours</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>1.2k students</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span>4.8</span>
                    </div>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>Progress</span>
                      <span>15%</span>
                    </div>
                    <Progress value={15} className="h-2" />
                  </div>
                  <Link to={`/topic/${topic.id}`}>
                    <Button className="w-full">
                      Continue Learning
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {user?.subscription_tier === 'basic' && (
          <Card className="border-0 shadow-lg bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    🚀 Unlock Premium Content
                  </h3>
                  <p className="text-gray-600 mb-6 text-lg">
                    Get access to advanced and pro-level content, plus 4x more AI queries per month.
                  </p>
                  <div className="flex flex-wrap gap-4 mb-6">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Advanced and Pro content</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>200 AI queries per month</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Priority support</span>
                    </div>
                  </div>
                  <Link to="/subscription">
                    <Button size="lg" className="px-8">
                      <Zap className="mr-2 h-5 w-5" />
                      Upgrade to Premium
                    </Button>
                  </Link>
                </div>
                <div className="hidden lg:block">
                  <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center">
                    <Trophy className="h-16 w-16 text-primary" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
