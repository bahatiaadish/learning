import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Textarea } from '../components/ui/textarea'
import { Badge } from '../components/ui/badge'
import { Separator } from '../components/ui/separator'
import { ArrowLeft, ArrowRight, Send, Zap, Brain, Target, BookOpen } from 'lucide-react'
import { useToast } from '../hooks/use-toast'

interface Section {
  id: number
  topic_id: number
  level: string
  title: string
  content: string
  order: number
}

interface Topic {
  id: number
  title: string
  description: string
  category: string
  levels: string[]
}

export default function SectionPage() {
  const { topicId, level, sectionId } = useParams()
  const { user, refreshUser } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [section, setSection] = useState<Section | null>(null)
  const [topic, setTopic] = useState<Topic | null>(null)
  const [aiQuery, setAiQuery] = useState('')
  const [aiResponse, setAiResponse] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [showAiChat, setShowAiChat] = useState(false)
  const [loading, setLoading] = useState(true)

  const API_BASE_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:8000'

  useEffect(() => {
    if (sectionId && topicId) {
      fetchSection()
      fetchTopic()
    }
  }, [sectionId, topicId])

  const fetchSection = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_BASE_URL}/sections/${sectionId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setSection(data)
        markProgress()
      }
    } catch (error) {
      console.error('Failed to fetch section:', error)
    } finally {
      setLoading(false)
    }
  }

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

  const markProgress = async () => {
    try {
      const token = localStorage.getItem('token')
      await fetch(`${API_BASE_URL}/user/progress`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          topic_id: parseInt(topicId!),
          level: level,
          section_id: parseInt(sectionId!)
        })
      })
    } catch (error) {
      console.error('Failed to mark progress:', error)
    }
  }

  const handleAiQuery = async () => {
    if (!aiQuery.trim() || !user) return

    if (user.ai_queries_used >= user.ai_queries_limit) {
      toast({
        title: "Query limit reached",
        description: "You've used all your AI queries for this month. Upgrade to get more!",
        variant: "destructive"
      })
      return
    }

    setAiLoading(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_BASE_URL}/ai/query`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: aiQuery,
          context_topic_id: parseInt(topicId!),
          context_level: level
        })
      })

      if (response.ok) {
        const data = await response.json()
        setAiResponse(data.response)
        setAiQuery('')
        await refreshUser()
        toast({
          title: "AI Response Generated",
          description: `${data.queries_remaining} queries remaining this month`
        })
      } else {
        throw new Error('Failed to get AI response')
      }
    } catch (error) {
      toast({
        title: "AI Query Failed",
        description: "Please try again later",
        variant: "destructive"
      })
    } finally {
      setAiLoading(false)
    }
  }



  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading section...</p>
        </div>
      </div>
    )
  }

  if (!section || !topic) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Section not found</h1>
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
            <Link to={`/topic/${topicId}`} className="hover:text-primary">{topic.title}</Link>
            <span>/</span>
            <span className="text-gray-900">{section.title}</span>
          </div>
          
          <Card className="border-0 shadow-lg mb-6">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{section.title}</h1>
                    <div className="flex items-center gap-3">
                      <Badge className={`level-badge-${section.level}`}>{section.level.toUpperCase()}</Badge>
                      <Badge variant="outline">Section {section.order}</Badge>
                      <span className="text-sm text-gray-600">~15 min read</span>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={() => setShowAiChat(!showAiChat)}
                  variant={showAiChat ? "default" : "outline"}
                  className="flex items-center gap-2"
                >
                  <Brain className="h-4 w-4" />
                  <span>AI Assistant</span>
                  <Badge variant="secondary" className="ml-2">
                    {(user?.ai_queries_limit || 0) - (user?.ai_queries_used || 0)}
                  </Badge>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <div 
                  className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ 
                    __html: section.content.replace(/\n/g, '<br>').replace(/#{1,6}\s/g, '<h3 class="text-2xl font-bold mt-8 mb-4 text-gray-900">').replace(/<h3[^>]*>/g, '<h3 class="text-2xl font-bold mt-8 mb-4 text-gray-900">') 
                  }}
                />
              </CardContent>
            </Card>

            <div className="flex items-center justify-between mt-8">
              <Link to={`/topic/${topicId}`}>
                <Button variant="outline" size="lg">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Topic
                </Button>
              </Link>
              <Button size="lg" onClick={() => navigate(`/topic/${topicId}`)}>
                Continue Learning
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>

          {showAiChat && (
            <div className="lg:col-span-1">
              <Card className="sticky top-8 border-0 shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Brain className="h-4 w-4 text-primary" />
                    </div>
                    <span>AI Assistant</span>
                  </CardTitle>
                  <p className="text-sm text-gray-600">
                    Ask questions about this content. <span className="font-medium text-primary">{(user?.ai_queries_limit || 0) - (user?.ai_queries_used || 0)}</span> queries remaining.
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <Textarea
                      placeholder="Ask a question about this section..."
                      value={aiQuery}
                      onChange={(e) => setAiQuery(e.target.value)}
                      className="min-h-[120px] resize-none"
                    />
                    <Button 
                      onClick={handleAiQuery}
                      disabled={!aiQuery.trim() || aiLoading || (user?.ai_queries_used || 0) >= (user?.ai_queries_limit || 0)}
                      className="w-full"
                      size="lg"
                    >
                      {aiLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Thinking...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Send className="h-4 w-4" />
                          Ask AI
                        </div>
                      )}
                    </Button>
                  </div>

                  {aiResponse && (
                    <>
                      <Separator />
                      <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
                        <h4 className="font-semibold text-primary mb-3 flex items-center gap-2">
                          <Target className="h-4 w-4" />
                          AI Response:
                        </h4>
                        <p className="text-gray-700 text-sm leading-relaxed">{aiResponse}</p>
                      </div>
                    </>
                  )}

                  {(user?.ai_queries_used || 0) >= (user?.ai_queries_limit || 0) && (
                    <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
                      <h4 className="font-semibold text-orange-900 mb-2">Query Limit Reached</h4>
                      <p className="text-orange-800 text-sm mb-4">
                        You've used all your AI queries for this month. Upgrade to Premium for 4x more queries!
                      </p>
                      <Link to="/subscription">
                        <Button size="sm" className="w-full">
                          <Zap className="mr-2 h-4 w-4" />
                          Upgrade for More Queries
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
