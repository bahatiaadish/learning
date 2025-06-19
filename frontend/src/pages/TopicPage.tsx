import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { Progress } from '../components/ui/progress'
import { BookOpen, Clock, Users, Lock, ArrowRight, Star, Brain, Trophy, Target, CheckCircle } from 'lucide-react'

interface Topic {
  id: number
  title: string
  description: string
  category: string
  levels: string[]
}

interface Section {
  id: number
  topic_id: number
  level: string
  title: string
  content: string
  order: number
}

export default function TopicPage() {
  const { topicId } = useParams()
  const { user } = useAuth()
  const [topic, setTopic] = useState<Topic | null>(null)
  const [sections, setSections] = useState<{ [key: string]: Section[] }>({})
  const [loading, setLoading] = useState(true)

  const API_BASE_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:8000'

  useEffect(() => {
    if (topicId) {
      fetchTopic()
      fetchSections()
    }
  }, [topicId])

  const fetchTopic = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_BASE_URL}/topics/${topicId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setTopic(data)
      }
    } catch (error) {
      console.error('Failed to fetch topic:', error)
    }
  }

  const fetchSections = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_BASE_URL}/topics/${topicId}/sections`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        const groupedSections = data.reduce((acc: { [key: string]: Section[] }, section: Section) => {
          if (!acc[section.level]) {
            acc[section.level] = []
          }
          acc[section.level].push(section)
          return acc
        }, {})
        setSections(groupedSections)
      }
    } catch (error) {
      console.error('Failed to fetch sections:', error)
    } finally {
      setLoading(false)
    }
  }

  const canAccessLevel = (level: string) => {
    if (level === 'pro' && user?.subscription_tier === 'basic') {
      return false
    }
    return true
  }



  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading topic...</p>
        </div>
      </div>
    )
  }

  if (!topic) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Topic not found</h1>
          <Link to="/dashboard">
            <Button>Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen gradient-bg p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <Link to="/dashboard" className="hover:text-primary">Dashboard</Link>
            <span>/</span>
            <span className="text-gray-900">{topic?.title}</span>
          </div>
          
          <Card className="border-0 shadow-lg">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-3">{topic?.title}</h1>
                  <p className="text-gray-600 text-xl">{topic?.description}</p>
                </div>
                <div className="hidden md:block">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                    <BookOpen className="h-10 w-10 text-primary" />
                  </div>
                </div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Star className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <div className="font-semibold">4.8 Rating</div>
                    <div className="text-sm text-gray-600">2.1k reviews</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold">12.5k Students</div>
                    <div className="text-sm text-gray-600">Enrolled</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Trophy className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <div className="font-semibold">15% Complete</div>
                    <div className="text-sm text-gray-600">Your progress</div>
                  </div>
                </div>
              </div>
              
              <Progress value={15} className="h-3 mb-4" />
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Overall Progress</span>
                <span>3 of 20 sections completed</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-6 w-6 text-primary" />
              Learning Path
            </CardTitle>
            <CardDescription>
              Progress through four difficulty levels to master {topic?.title}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue={topic?.levels[0]} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="novice" className="flex items-center gap-2">
                  <Badge className="level-badge-novice text-xs">Novice</Badge>
                </TabsTrigger>
                <TabsTrigger value="intermediate" className="flex items-center gap-2">
                  <Badge className="level-badge-intermediate text-xs">Intermediate</Badge>
                </TabsTrigger>
                <TabsTrigger 
                  value="advanced" 
                  disabled={user?.subscription_tier === 'basic'}
                  className="flex items-center gap-2"
                >
                  <Badge className="level-badge-advanced text-xs">Advanced</Badge>
                  {user?.subscription_tier === 'basic' && <Lock className="h-3 w-3" />}
                </TabsTrigger>
                <TabsTrigger 
                  value="pro" 
                  disabled={user?.subscription_tier === 'basic'}
                  className="flex items-center gap-2"
                >
                  <Badge className="level-badge-pro text-xs">Pro</Badge>
                  {user?.subscription_tier === 'basic' && <Lock className="h-3 w-3" />}
                </TabsTrigger>
              </TabsList>

              {topic?.levels.map((level) => (
                <TabsContent key={level} value={level} className="mt-6">
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-lg font-semibold capitalize">{level} Level</h3>
                      <span className="text-sm text-gray-600">
                        {sections[level]?.length || 0} sections
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4">
                      {level === 'novice' && 'Perfect for beginners. Learn the fundamentals with clear explanations and hands-on examples.'}
                      {level === 'intermediate' && 'Build on your knowledge with practical applications and real-world scenarios.'}
                      {level === 'advanced' && 'Master complex concepts and advanced techniques used by professionals in the field.'}
                      {level === 'pro' && 'Cutting-edge content for industry experts and technical leaders driving innovation.'}
                    </p>
                    <Progress value={level === 'novice' ? 40 : level === 'intermediate' ? 10 : 0} className="h-2" />
                  </div>
                  
                  {!canAccessLevel(level) ? (
                    <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
                      <CardHeader>
                        <CardTitle className="text-purple-900">Premium Content</CardTitle>
                        <CardDescription className="text-purple-700">
                          Upgrade to Premium to access {level} level content
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Link to="/subscription">
                          <Button>Upgrade to Premium</Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-3">
                      {sections[level]?.map((section, index) => (
                        <Card key={section.id} className="card-hover">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                                  {index < 2 ? (
                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                  ) : (
                                    <span className="text-sm font-medium text-primary">{index + 1}</span>
                                  )}
                                </div>
                                <div>
                                  <h4 className="font-medium text-lg">{section.title}</h4>
                                  <div className="flex items-center gap-4 text-sm text-gray-600">
                                    <span className="flex items-center gap-1">
                                      <Clock className="h-4 w-4" />
                                      15 min
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <BookOpen className="h-4 w-4" />
                                      Section {section.order}
                                    </span>
                                    {index < 2 && (
                                      <Badge variant="secondary" className="text-xs">
                                        Completed
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Link to={`/topic/${topicId}/${level}/section/${section.id}`}>
                                  <Button variant="ghost" size="sm">
                                    {index < 2 ? 'Review' : 'Start'}
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                  </Button>
                                </Link>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

        {user?.subscription_tier === 'basic' && (
          <Card className="mt-8 border-0 shadow-lg bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    🔓 Unlock Advanced and Pro Content
                  </h3>
                  <p className="text-gray-600 mb-6 text-lg">
                    Get access to advanced techniques and professional-level content to accelerate your learning journey.
                  </p>
                  <div className="flex flex-wrap gap-4 mb-6">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Advanced and Pro sections</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Expert-level content</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Industry best practices</span>
                    </div>
                  </div>
                  <Link to="/subscription">
                    <Button size="lg" className="px-8">
                      <Brain className="mr-2 h-5 w-5" />
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
