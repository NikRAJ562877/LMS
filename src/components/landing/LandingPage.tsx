import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  GraduationCap, 
  BookOpen, 
  Users, 
  Award, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  Star,
  ArrowRight,
  Menu,
  X,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

export const LandingPage = ({ onGetStarted }: LandingPageProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 w-full bg-white/80 backdrop-blur-lg border-b border-gray-200 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <GraduationCap className="size-8 text-indigo-600" />
              <span className="text-xl">EduTrack LMS</span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-700 hover:text-indigo-600 transition-colors">Features</a>
              <a href="#about" className="text-gray-700 hover:text-indigo-600 transition-colors">About</a>
              <a href="#testimonials" className="text-gray-700 hover:text-indigo-600 transition-colors">Testimonials</a>
              <a href="#contact" className="text-gray-700 hover:text-indigo-600 transition-colors">Contact</a>
              <button
                onClick={onGetStarted}
                className="px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors"
              >
                Login
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden"
            >
              {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="md:hidden bg-white border-t border-gray-200"
          >
            <div className="px-4 py-4 space-y-3">
              <a href="#features" className="block text-gray-700 hover:text-indigo-600">Features</a>
              <a href="#about" className="block text-gray-700 hover:text-indigo-600">About</a>
              <a href="#testimonials" className="block text-gray-700 hover:text-indigo-600">Testimonials</a>
              <a href="#contact" className="block text-gray-700 hover:text-indigo-600">Contact</a>
              <button
                onClick={onGetStarted}
                className="w-full px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700"
              >
                Login
              </button>
            </div>
          </motion.div>
        )}
      </motion.nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-block px-4 py-2 bg-indigo-100 text-indigo-600 rounded-full text-sm mb-6"
              >
                🎓 Modern Learning Management System
              </motion.div>
              
              <h1 className="text-3xl sm:text-4xl md:text-6xl mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Empowering Education Through Technology
              </h1>
              
              <p className="text-xl text-gray-600 mb-8">
                A comprehensive platform connecting students, parents, and teachers for seamless academic management and superior learning outcomes.
              </p>

              <div className="flex flex-wrap gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onGetStarted}
                  className="px-6 py-3 sm:px-8 sm:py-4 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-lg shadow-indigo-200"
                >
                  Get Started
                  <ArrowRight className="size-5" />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 sm:px-8 sm:py-4 bg-white text-indigo-600 rounded-full border-2 border-indigo-600 hover:bg-indigo-50 transition-colors"
                >
                  Watch Demo
                </motion.button>
              </div>

              <div className="mt-12 flex items-center gap-8">
                <div>
                  <div className="text-3xl">500+</div>
                  <div className="text-sm text-gray-600">Active Students</div>
                </div>
                <div>
                  <div className="text-3xl">50+</div>
                  <div className="text-sm text-gray-600">Expert Teachers</div>
                </div>
                <div>
                  <div className="text-3xl">98%</div>
                  <div className="text-sm text-gray-600">Success Rate</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <motion.div
                animate={{ 
                  y: [0, -20, 0],
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="bg-white rounded-2xl shadow-2xl p-8"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                    <div className="bg-blue-500 p-3 rounded-lg">
                      <BookOpen className="size-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-600">Assignments</div>
                      <div className="text-xl">24 Pending</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                    <div className="bg-green-500 p-3 rounded-lg">
                      <TrendingUp className="size-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-600">Performance</div>
                      <div className="text-xl">92% Average</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                    <div className="bg-purple-500 p-3 rounded-lg">
                      <Award className="size-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-600">Attendance</div>
                      <div className="text-xl">95% This Month</div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Floating Elements */}
              <motion.div
                animate={{ 
                  rotate: 360,
                }}
                transition={{ 
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="absolute -top-6 -right-6 bg-gradient-to-br from-yellow-400 to-orange-500 p-4 rounded-full shadow-lg"
              >
                <Star className="size-8 text-white" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-600">Everything you need for modern education management</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all border border-gray-100"
              >
                <div className={`${feature.color} p-4 rounded-xl inline-block mb-4`}>
                  <feature.icon className="size-8 text-white" />
                </div>
                <h3 className="text-xl mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl mb-6">Why Choose EduTrack?</h2>
              <p className="text-xl text-gray-600 mb-8">
                We're transforming education by bridging the gap between students, parents, and teachers through innovative technology.
              </p>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle className="size-6 text-green-500 flex-shrink-0 mt-1" />
                    <div>
                      <div className="text-lg mb-1">{benefit.title}</div>
                      <p className="text-gray-600">{benefit.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white p-6 rounded-xl shadow-lg text-center"
                >
                  <div className="text-4xl mb-2">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl mb-4">What People Say</h2>
            <p className="text-xl text-gray-600">Trusted by students, parents, and teachers</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-lg"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="size-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">{testimonial.text}</p>
                <div className="flex items-center gap-3">
                  <div className="bg-indigo-100 p-3 rounded-full">
                    <Users className="size-6 text-indigo-600" />
                  </div>
                  <div>
                    <div>{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact/CTA Section */}
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl mb-6">Ready to Get Started?</h2>
              <p className="text-xl text-indigo-100 mb-8">
                Join thousands of students and teachers who are already using EduTrack to achieve better learning outcomes.
              </p>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onGetStarted}
                className="px-8 py-4 bg-white text-indigo-600 rounded-full hover:bg-gray-100 transition-colors inline-flex items-center gap-2"
              >
                Start Your Journey
                <ArrowRight className="size-5" />
              </motion.button>

              <div className="mt-12 space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="size-5" />
                  <span>contact@edutrack.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="size-5" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="size-5" />
                  <span>123 Education St, Learning City</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl"
            >
              <h3 className="text-2xl mb-6">Send us a message</h3>
              <form className="space-y-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
                <textarea
                  placeholder="Your Message"
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-white text-indigo-600 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Send Message
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <GraduationCap className="size-8 text-indigo-400" />
            <span className="text-xl">EduTrack LMS</span>
          </div>
          <p className="text-gray-400 mb-4">Empowering education through technology</p>
          <p className="text-gray-500 text-sm">© 2026 EduTrack LMS. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

const features = [
  {
    icon: Users,
    title: 'Student Management',
    description: 'Comprehensive student profiles with performance tracking and progress monitoring.',
    color: 'bg-gradient-to-br from-blue-500 to-indigo-600'
  },
  {
    icon: BookOpen,
    title: 'Assignment Tracking',
    description: 'Create, assign, and track assignments with file uploads and automatic grading.',
    color: 'bg-gradient-to-br from-purple-500 to-pink-600'
  },
  {
    icon: TrendingUp,
    title: 'Performance Analytics',
    description: 'Real-time analytics and insights into student performance and class trends.',
    color: 'bg-gradient-to-br from-green-500 to-emerald-600'
  },
  {
    icon: Clock,
    title: 'Attendance Management',
    description: 'Effortless attendance tracking with detailed reports and notifications.',
    color: 'bg-gradient-to-br from-orange-500 to-red-600'
  },
  {
    icon: Award,
    title: 'Grade Management',
    description: 'Simple grade entry and management with automatic calculations.',
    color: 'bg-gradient-to-br from-yellow-500 to-orange-600'
  },
  {
    icon: Mail,
    title: 'Communication Hub',
    description: 'Seamless communication between teachers, students, and parents.',
    color: 'bg-gradient-to-br from-cyan-500 to-blue-600'
  }
];

const benefits = [
  {
    title: 'Real-time Updates',
    description: 'Get instant notifications about grades, assignments, and attendance.'
  },
  {
    title: 'Parent Involvement',
    description: 'Keep parents informed with transparent access to their child\'s progress.'
  },
  {
    title: 'Easy to Use',
    description: 'Intuitive interface designed for users of all technical levels.'
  },
  {
    title: 'Secure & Private',
    description: 'Your data is protected with industry-standard security measures.'
  }
];

const stats = [
  { value: '500+', label: 'Students' },
  { value: '50+', label: 'Teachers' },
  { value: '98%', label: 'Success Rate' },
  { value: '4.9/5', label: 'Rating' }
];

const testimonials = [
  {
    text: 'EduTrack has transformed how I manage my classroom. The attendance and grading features save me hours every week!',
    name: 'Dr. Sarah Williams',
    role: 'High School Teacher'
  },
  {
    text: 'As a parent, I love being able to track my child\'s progress in real-time. The app keeps me informed and involved.',
    name: 'Michael Chen',
    role: 'Parent'
  },
  {
    text: 'The assignment tracking feature helps me stay organized and never miss a deadline. It\'s been a game-changer!',
    name: 'Emily Rodriguez',
    role: 'Grade 11 Student'
  }
];
