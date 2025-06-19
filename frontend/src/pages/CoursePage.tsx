import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { Progress } from '../components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { 
  Clock, 
  Users, 
  Star, 
  PlayCircle, 
  CheckCircle,
  Lock,
  ArrowRight,
  Brain,
  Trophy,
  Target
}from 'lucide-react'

interface CourseSection {
  id: number
  title: string
  duration: string
  completed: boolean
  locked: boolean
}

interface Course {
  id: number
  title: string
  description: string
  instructor: string
  rating: number
  students: number
  duration: string
  level: string
  sections: {
    novice: CourseSection[]
    intermediate: CourseSection[]
    advanced: CourseSection[]
    pro: CourseSection[]
  }
}

export default function CoursePage() {
  const { courseId } = useParams()
  const [course, setCourse] = useState<Course | null>(null)
  const [activeLevel, setActiveLevel] = useState('novice')

  useEffect(() => {
    const mockCourse: Course = {
      id: parseInt(courseId || '1'),
      title: "Complete Networking Fundamentals",
      description: "Master networking from basic concepts to advanced enterprise architectures. Learn TCP/IP, routing protocols, network security, and modern cloud networking.",
      instructor: "Dr. Sarah Chen",
      rating: 4.9,
      students: 12847,
      duration: "24 hours",
      level: "All Levels",
      sections: {
        novice: [
          { id: 1, title: "Introduction to Networking", duration: "45 min", completed: true, locked: false },
          { id: 2, title: "OSI Model Explained", duration: "60 min", completed: true, locked: false },
          { id: 3, title: "TCP/IP Fundamentals", duration: "75 min", completed: false, locked: false },
          { id: 4, title: "IP Addressing Basics", duration: "90 min", completed: false, locked: false },
          { id: 5, title: "Subnetting Made Simple", duration: "120 min", completed: false, locked: false }
        ],
        intermediate: [
          { id: 6, title: "Routing Protocols Overview", duration: "90 min", completed: false, locked: false },
          { id: 7, title: "OSPF Configuration", duration: "120 min", completed: false, locked: false },
          { id: 8, title: "BGP Fundamentals", duration: "150 min", completed: false, locked: false },
          { id: 9, title: "VLANs and Trunking", duration: "105 min", completed: false, locked: false },
          { id: 10, title: "Network Security Basics", duration: "135 min", completed: false, locked: false }
        ],
        advanced: [
          { id: 11, title: "Advanced BGP Policies", duration: "180 min", completed: false, locked: false },
          { id: 12, title: "MPLS and VPNs", duration: "210 min", completed: false, locked: false },
          { id: 13, title: "Network Automation", duration: "165 min", completed: false, locked: false },
          { id: 14, title: "SDN and OpenFlow", duration: "195 min", completed: false, locked: false },
          { id: 15, title: "Network Monitoring", duration: "150 min", completed: false, locked: false }
        ],
        pro: [
          { id: 16, title: "Enterprise Architecture Design", duration: "240 min", completed: false, locked: true },
          { id: 17, title: "Cloud Networking Strategies", duration: "220 min", completed: false, locked: true },
          { id: 18, title: "Zero Trust Networks", duration: "200 min", completed: false, locked: true },
          { id: 19, title: "Network Performance Optimization", duration: "180 min", completed: false, locked: true },
          { id: 20, title: "Future of Networking", duration: "160 min", completed: false, locked: true }
        ]
      }
    }
    setCourse(mockCourse)
  }, [courseId])

  if (!course) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  const getLevelProgress = (level: keyof typeof course.sections) => {
    const sections = course.sections[level]
    const completed = sections.filter(s => s.completed).length
    return (completed / sections.length) * 100
  }



  return (
    <div className="min-h-screen gradient-bg p-6">
      <div className="max-w-7xl mx-auto">
        {/* Course Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <Link to="/dashboard" className="hover:text-primary">Dashboard</Link>
            <span>/</span>
            <span>Networking</span>
            <span>/</span>
            <span className="text-gray-900">{course.title}</span>
          </div>
          
          <Card className="border-0 shadow-lg">
            <CardContent className="p-8">
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">{course.title}</h1>
                  <p className="text-lg text-gray-600 mb-6">{course.description}</p>
                  
                  <div className="flex flex-wrap items-center gap-6 mb-6">
                    <div className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-yellow-400 fill-current" />
                      <span className="font-semibold">{course.rating}</span>
                      <span className="text-gray-600">({course.students.toLocaleString()} students)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-gray-400" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-gray-400" />
                      <span>{course.level}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <Button size="lg" className="px-8">
                      <PlayCircle className="mr-2 h-5 w-5" />
                      Continue Learning
                    </Button>
                    <Button variant="outline" size="lg">
                      <Brain className="mr-2 h-5 w-5" />
                      Ask AI Assistant
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Trophy className="h-5 w-5 text-primary" />
                        Your Progress
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Overall Progress</span>
                          <span>15%</span>
                        </div>
                        <Progress value={15} className="h-2" />
                      </div>
                      <div className="text-sm text-gray-600">
                        2 of 20 sections completed
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Instructor</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="font-semibold text-primary">SC</span>
                        </div>
                        <div>
                          <p className="font-semibold">{course.instructor}</p>
                          <p className="text-sm text-gray-600">Network Architect</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Course Content */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-6 w-6 text-primary" />
              Course Content
            </CardTitle>
            <CardDescription>
              Progress through four difficulty levels at your own pace
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeLevel} onValueChange={setActiveLevel}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="novice" className="flex items-center gap-2">
                  <Badge className="level-badge-novice text-xs">Novice</Badge>
                </TabsTrigger>
                <TabsTrigger value="intermediate" className="flex items-center gap-2">
                  <Badge className="level-badge-intermediate text-xs">Intermediate</Badge>
                </TabsTrigger>
                <TabsTrigger value="advanced" className="flex items-center gap-2">
                  <Badge className="level-badge-advanced text-xs">Advanced</Badge>
                </TabsTrigger>
                <TabsTrigger value="pro" className="flex items-center gap-2">
                  <Badge className="level-badge-pro text-xs">Pro</Badge>
                </TabsTrigger>
              </TabsList>
              
              {Object.entries(course.sections).map(([level, sections]) => (
                <TabsContent key={level} value={level} className="mt-6">
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-lg font-semibold capitalize">{level} Level</h3>
                      <span className="text-sm text-gray-600">
                        {sections.filter(s => s.completed).length} of {sections.length} completed
                      </span>
                    </div>
                    <Progress value={getLevelProgress(level as keyof typeof course.sections)} className="h-2" />
                  </div>
                  
                  <div className="space-y-3">
                    {sections.map((section, index) => (
                      <Card key={section.id} className={`card-hover ${section.locked ? 'opacity-60' : ''}`}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100">
                                {section.completed ? (
                                  <CheckCircle className="h-5 w-5 text-green-500" />
                                ) : section.locked ? (
                                  <Lock className="h-4 w-4 text-gray-400" />
                                ) : (
                                  <span className="text-sm font-medium">{index + 1}</span>
                                )}
                              </div>
                              <div>
                                <h4 className="font-medium">{section.title}</h4>
                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    {section.duration}
                                  </span>
                                  {section.completed && (
                                    <Badge variant="secondary" className="text-xs">
                                      Completed
                                    </Badge>
                                  )}
                                  {section.locked && (
                                    <Badge variant="outline" className="text-xs">
                                      Premium Required
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {!section.locked && (
                                <Link to={`/topic/1/${level}/section/${section.id}`}>
                                  <Button variant="ghost" size="sm">
                                    {section.completed ? 'Review' : 'Start'}
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                  </Button>
                                </Link>
                              )}
                              {section.locked && (
                                <Link to="/subscription">
                                  <Button variant="outline" size="sm">
                                    Upgrade
                                  </Button>
                                </Link>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
