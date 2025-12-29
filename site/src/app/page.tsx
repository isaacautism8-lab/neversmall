'use client'

import { useState, useEffect } from 'react'
import { Play, ArrowRight, Mail, Instagram, ArrowUpRight, Sparkles } from 'lucide-react'

const clients = [
  'Tang Events',
  'Naught Gin',
  'Golden Wok',
  'Dibo Bodi Sessions',
  'Pretty Privilege Club',
  'Australian Fashion Week',
]

const services = [
  'Event Coverage',
  'Brand Content',
  'Food & Beverage',
  'Music & Lifestyle',
  'Social Media',
  'Video Production',
  'Post-Production',
]

const workItems = [
  {
    title: 'Tang Events',
    category: 'Event Coverage',
    color: 'from-orange-500/20 to-pink-500/20',
  },
  {
    title: 'Naught Gin',
    category: 'Brand Content',
    color: 'from-emerald-500/20 to-teal-500/20',
  },
  {
    title: 'Golden Wok',
    category: 'Food & Beverage',
    color: 'from-amber-500/20 to-orange-500/20',
  },
  {
    title: 'Dibo Bodi Sessions',
    category: 'Music & Lifestyle',
    color: 'from-pink-500/20 to-purple-500/20',
  },
  {
    title: 'Pretty Privilege Club',
    category: 'Lifestyle',
    color: 'from-rose-500/20 to-pink-500/20',
  },
  {
    title: 'Client Wins',
    category: 'Brand Stories',
    color: 'from-blue-500/20 to-indigo-500/20',
  },
]

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <main className="min-h-screen overflow-x-hidden">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 px-6 py-5 backdrop-blur-md bg-black/50 transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center transition-all group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-white/20">
              <span className="text-black font-bold text-lg">NS</span>
            </div>
            <div className="hidden sm:block">
              <span className="text-xs font-semibold tracking-[0.2em] text-gray-400">NEVERSMALL</span>
              <span className="block text-sm font-bold -mt-0.5">STUDIOS</span>
            </div>
          </a>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a href="#work" className="link-hover text-gray-400 hover:text-white transition-colors">Work</a>
            <a href="#services" className="link-hover text-gray-400 hover:text-white transition-colors">Services</a>
            <a href="#about" className="link-hover text-gray-400 hover:text-white transition-colors">About</a>
          </div>
          
          <a href="#contact" className="btn-primary text-xs">
            Let's Talk
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-20 grid-bg">
        {/* Background Blurs */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-pink-500/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-6xl mx-auto text-center relative z-10">
          {/* Badge */}
          <div className={`inline-flex items-center gap-2 bg-gray-900 border border-gray-800 rounded-full px-4 py-2 mb-8 transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <Sparkles size={14} className="text-orange-400" />
            <span className="text-xs font-medium text-gray-400">Melbourne Creative Studio</span>
          </div>
          
          {/* Main Headline */}
          <h1 className={`font-display text-6xl sm:text-7xl md:text-8xl lg:text-9xl leading-[0.9] mb-6 transition-all duration-700 delay-100 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <span className="block">WE MAKE</span>
            <span className="block text-gradient">BRANDS MOVE</span>
          </h1>
          
          <p className={`text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 transition-all duration-700 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            Video production & content strategy for events, food & beverage, music, and lifestyle brands that want to stand out.
          </p>
          
          <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-700 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <a href="#work" className="btn-primary flex items-center gap-2">
              <Play size={16} fill="currentColor" />
              See Our Work
            </a>
            <a href="https://instagram.com/neversmall" target="_blank" rel="noopener noreferrer" className="btn-secondary flex items-center gap-2">
              <Instagram size={16} />
              Follow Along
            </a>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-all duration-700 delay-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          <span className="text-xs text-gray-600 tracking-widest">SCROLL</span>
          <div className="w-px h-12 bg-gradient-to-b from-gray-600 to-transparent" />
        </div>
      </section>

      {/* Marquee Section */}
      <section className="py-8 border-y border-gray-900 bg-gray-950/50">
        <div className="marquee-container">
          <div className="inline-flex animate-marquee">
            {[...clients, ...clients].map((client, i) => (
              <span key={i} className="mx-8 text-2xl font-display text-gray-600 whitespace-nowrap">
                {client}
                <span className="mx-8 text-orange-500">✦</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Work Section */}
      <section id="work" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
            <div>
              <span className="text-orange-400 text-sm font-semibold tracking-widest">OUR WORK</span>
              <h2 className="font-display text-5xl md:text-6xl mt-2">
                RECENT PROJECTS
              </h2>
            </div>
            <a href="https://instagram.com/neversmall" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
              View All on Instagram
              <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </a>
          </div>
          
          {/* Work Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workItems.map((item, index) => (
              <div 
                key={index}
                className={`work-card group aspect-[4/5] bg-gradient-to-br ${item.color} cursor-pointer`}
              >
                {/* Placeholder Background */}
                <div className="absolute inset-0 bg-gray-900 work-card-image">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-800/50 to-gray-900" />
                </div>
                
                {/* Play Button */}
                <div className="absolute inset-0 flex items-center justify-center z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                    <Play size={24} className="text-white ml-1" fill="currentColor" />
                  </div>
                </div>
                
                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                  <span className="inline-block px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-xs font-medium mb-3">
                    {item.category}
                  </span>
                  <h3 className="font-display text-2xl md:text-3xl">{item.title}</h3>
                </div>
                
                {/* Coming Soon Badge */}
                <div className="absolute top-4 right-4 z-10">
                  <span className="text-xs text-gray-500 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full">
                    Asset Placeholder
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 px-6 bg-gray-950/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-orange-400 text-sm font-semibold tracking-widest">WHAT WE DO</span>
            <h2 className="font-display text-5xl md:text-6xl mt-2 mb-6">
              FULL-SERVICE CREATIVE
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              From concept to final delivery. We handle everything so you can focus on your brand.
            </p>
          </div>
          
          {/* Services Pills */}
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            {services.map((service, index) => (
              <div key={index} className="service-pill">
                <span className="font-medium">{service}</span>
              </div>
            ))}
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12 border-t border-gray-800">
            {[
              { number: '50+', label: 'Projects Delivered' },
              { number: '30+', label: 'Happy Clients' },
              { number: '500K+', label: 'Views Generated' },
              { number: '24hr', label: 'Turnaround Available' },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <p className="font-display text-4xl md:text-5xl text-gradient">{stat.number}</p>
                <p className="text-gray-500 text-sm mt-2">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-orange-400 text-sm font-semibold tracking-widest">ABOUT US</span>
              <h2 className="font-display text-5xl md:text-6xl mt-2 mb-8">
                CREATIVE WITH<br />
                <span className="text-gradient">PURPOSE</span>
              </h2>
              
              <div className="space-y-6 text-gray-400">
                <p className="text-lg">
                  NeverSmall Studios is Melbourne's go-to creative production team for brands that want content with energy, style, and substance.
                </p>
                <p>
                  We specialize in capturing the vibe—whether that's a packed event, a perfectly plated dish, or a live performance. No cookie-cutter templates. Every project gets our full creative attention.
                </p>
                <p>
                  From concept to final cut, we're obsessed with the details that make content actually connect with people.
                </p>
              </div>
              
              <a href="#contact" className="inline-flex items-center gap-2 mt-8 text-white font-semibold group">
                Work With Us
                <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
              </a>
            </div>
            
            {/* Visual Element */}
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-orange-500/10 to-pink-500/10 rounded-3xl overflow-hidden border border-gray-800">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-32 h-32 bg-white rounded-full mx-auto mb-6 flex items-center justify-center glow-orange">
                      <span className="text-black font-bold text-4xl">NS</span>
                    </div>
                    <p className="font-display text-3xl">STUDIOS</p>
                    <p className="text-gray-500 text-sm mt-2">Melbourne, Australia</p>
                  </div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-orange-500/20 rounded-2xl blur-xl" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-pink-500/20 rounded-2xl blur-xl" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-24 px-6 bg-gradient-to-b from-gray-950 to-black">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-orange-400 text-sm font-semibold tracking-widest">LET'S CREATE</span>
          <h2 className="font-display text-5xl md:text-7xl mt-4 mb-6">
            GOT A PROJECT?
          </h2>
          <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto">
            We'd love to hear about it. Drop us a line and let's make something that moves.
          </p>
          
          <a 
            href="mailto:hello@neversmall.com" 
            className="inline-flex items-center gap-3 text-2xl md:text-4xl font-display hover:text-orange-400 transition-colors group"
          >
            <Mail size={32} className="group-hover:rotate-12 transition-transform" />
            HELLO@NEVERSMALL.COM
          </a>
          
          <div className="flex items-center justify-center gap-8 mt-12 pt-8 border-t border-gray-800">
            <a href="https://instagram.com/neversmall" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors group">
              <Instagram size={20} />
              <span className="font-medium">Instagram</span>
              <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-gray-900">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <span className="text-black font-bold text-xs">NS</span>
            </div>
            <span className="text-sm text-gray-500">NeverSmall Studios</span>
          </div>
          
          <p className="text-gray-600 text-sm">
            © {new Date().getFullYear()} NeverSmall. Made in Melbourne.
          </p>
        </div>
      </footer>
    </main>
  )
}
