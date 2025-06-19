
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { 
  Brain, 
  BookOpen, 
  Users, 
  Trophy, 
  ArrowRight, 
  CheckCircle,
  Star,
  Zap,
  Shield,
  Globe
} from 'lucide-react'

export default function HomePage() {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Learning",
      description: "Get instant help from our advanced AI assistant trained on technical content"
    },
    {
      icon: BookOpen,
      title: "Multi-Level Content",
      description: "Progress from novice to pro with structured learning paths"
    },
    {
      icon: Users,
      title: "Expert-Curated",
      description: "Content created by industry professionals and technical experts"
    },
    {
      icon: Trophy,
      title: "Track Progress",
      description: "Monitor your learning journey with detailed progress tracking"
    }
  ]

  const technologies = [
    { name: "Networking", topics: 25, color: "bg-blue-500" },
    { name: "Cloud Computing", topics: 30, color: "bg-purple-500" },
    { name: "Programming", topics: 40, color: "bg-green-500" },
    { name: "DevOps", topics: 20, color: "bg-orange-500" },
    { name: "Security", topics: 15, color: "bg-red-500" },
    { name: "Data Science", topics: 18, color: "bg-indigo-500" }
  ]

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Software Engineer",
      content: "The AI assistant helped me understand complex networking concepts in minutes. Best learning platform I've used!",
      rating: 5
    },
    {
      name: "Mike Rodriguez",
      role: "DevOps Engineer", 
      content: "From novice to advanced in cloud computing. The structured approach really works.",
      rating: 5
    },
    {
      name: "Emily Johnson",
      role: "Network Administrator",
      content: "Finally, a platform that explains technical concepts in a way that actually makes sense.",
      rating: 5
    }
  ]

  return (
    <div className="min-h-screen gradient-bg">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex justify-center mb-8">
            <Brain className="h-16 w-16 text-primary" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Master Technology with
            <span className="text-primary block">AI-Powered Learning</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            From networking fundamentals to advanced cloud architecture, learn at your own pace 
            with personalized AI assistance and expert-curated content.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="text-lg px-8 py-3">
                Start Learning Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                Sign In
              </Button>
            </Link>
          </div>
          <div className="mt-8 flex items-center justify-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Free 7-day trial</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose AI Training Portal?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the future of technical education with our innovative learning platform
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card key={index} className="card-hover border-0 shadow-md">
                  <CardHeader className="text-center">
                    <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Technologies Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 gradient-bg">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Comprehensive Technology Coverage
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Master the most in-demand technologies with our structured learning paths
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {technologies.map((tech, index) => (
              <Card key={index} className="card-hover">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 ${tech.color} rounded-lg flex items-center justify-center`}>
                      <Globe className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{tech.name}</h3>
                      <p className="text-gray-600">{tech.topics} topics available</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Learning Levels Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Learn at Your Level
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our content is structured across four difficulty levels to match your expertise
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="card-hover border-green-200">
              <CardHeader>
                <Badge className="level-badge-novice w-fit">Novice</Badge>
                <CardTitle>Getting Started</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Perfect for beginners. Learn fundamental concepts with clear explanations and examples.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="card-hover border-blue-200">
              <CardHeader>
                <Badge className="level-badge-intermediate w-fit">Intermediate</Badge>
                <CardTitle>Building Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Dive deeper into practical applications and real-world scenarios.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="card-hover border-purple-200">
              <CardHeader>
                <Badge className="level-badge-advanced w-fit">Advanced</Badge>
                <CardTitle>Expert Level</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Master complex topics and advanced techniques used by professionals.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="card-hover border-orange-200">
              <CardHeader>
                <Badge className="level-badge-pro w-fit">Pro</Badge>
                <CardTitle>Industry Expert</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Cutting-edge content for industry leaders and technical architects.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 gradient-bg">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Loved by Professionals
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join thousands of professionals who have accelerated their careers
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="card-hover">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4">"{testimonial.content}"</p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose the plan that fits your learning goals
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="card-hover border-2">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Basic</CardTitle>
                <div className="text-4xl font-bold text-primary">$8<span className="text-lg text-gray-500">/month</span></div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Access to Novice and Intermediate content</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>50 AI queries per month</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Progress tracking</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Community support</span>
                </div>
                <Link to="/register" className="block">
                  <Button className="w-full mt-6">Get Started</Button>
                </Link>
              </CardContent>
            </Card>
            <Card className="card-hover border-2 border-primary relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-primary text-white">Most Popular</Badge>
              </div>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Premium</CardTitle>
                <div className="text-4xl font-bold text-primary">$12<span className="text-lg text-gray-500">/month</span></div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Access to ALL content levels</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>200 AI queries per month</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Advanced progress analytics</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Priority support</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Downloadable resources</span>
                </div>
                <Link to="/register" className="block">
                  <Button className="w-full mt-6">Start Premium</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Accelerate Your Learning?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of professionals who are advancing their careers with AI-powered learning
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
                <Zap className="mr-2 h-5 w-5" />
                Start Free Trial
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="text-lg px-8 py-3 border-white text-white hover:bg-white hover:text-primary">
                <Shield className="mr-2 h-5 w-5" />
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
