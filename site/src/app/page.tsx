'use client'

import { useState, useEffect } from 'react'
import { ArrowRight, Mail, ArrowUpRight, Play, Camera, Film, Palette, Users } from 'lucide-react'
import Image from 'next/image'

const clients = [
  'Tang Events',
  'Naught Gin',
  'Golden Wok',
  'Dibo Bodi Sessions',
  'Pretty Privilege Club',
  'Australian Fashion Week',
]

const services = [
  {
    icon: Film,
    title: 'Video Production',
    description: 'From concept through final delivery. Event coverage, brand films, and content that connects.',
  },
  {
    icon: Camera,
    title: 'Content Creation',
    description: 'Photography and video tailored for social platforms. Authentic moments, not stock templates.',
  },
  {
    icon: Palette,
    title: 'Post-Production',
    description: 'Color grading, editing, and motion graphics. The polish that elevates good footage into great content.',
  },
  {
    icon: Users,
    title: 'Creative Direction',
    description: 'Strategic thinking that shapes every project. We help you find the story worth telling.',
  },
]

const workItems = [
  {
    title: 'Tang Events',
    category: 'Event Coverage',
    description: 'Capturing the energy of Melbourne\'s vibrant event scene.',
  },
  {
    title: 'Naught Gin',
    category: 'Brand Content',
    description: 'Product storytelling with character and craft.',
  },
  {
    title: 'Golden Wok',
    category: 'Food & Beverage',
    description: 'Appetite-driven visuals for hospitality brands.',
  },
  {
    title: 'Dibo Bodi Sessions',
    category: 'Music & Lifestyle',
    description: 'Live performance and artist documentation.',
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
      <nav className={`fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-full overflow-hidden transition-transform group-hover:scale-105">
              <Image 
                src="/assets/NSS Logo.jpg" 
                alt="NeverSmall Studios" 
                width={44} 
                height={44}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="hidden sm:block">
              <span className="text-[11px] font-medium tracking-[0.15em] text-gray-500 uppercase">NeverSmall</span>
              <span className="block text-sm font-semibold text-white -mt-0.5">Studios</span>
            </div>
          </a>
          
          <div className="hidden md:flex items-center gap-8 text-sm">
            <a href="#work" className="link-underline text-gray-400 hover:text-white transition-colors">Work</a>
            <a href="#services" className="link-underline text-gray-400 hover:text-white transition-colors">Services</a>
            <a href="#about" className="link-underline text-gray-400 hover:text-white transition-colors">About</a>
          </div>
          
          <a href="#contact" className="btn-primary text-sm">
            Get in Touch
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-20">
        {/* Subtle background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a0a0a]" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[#1a1a1a] rounded-full blur-[150px] opacity-40" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          {/* Logo */}
          <div className={`mb-10 transition-all duration-700 ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            <div className="w-20 h-20 mx-auto rounded-full overflow-hidden logo-glow">
              <Image 
                src="/assets/NSS Logo.jpg" 
                alt="NeverSmall Studios" 
                width={80} 
                height={80}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          {/* Headline */}
          <h1 className={`font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 transition-all duration-700 delay-100 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <span className="block text-white">Creative production</span>
            <span className="block text-warm mt-2">for thoughtful brands</span>
          </h1>
          
          <p className={`text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed transition-all duration-700 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            Video production, content strategy, and post-production for events, hospitality, and lifestyle brands in Melbourne.
          </p>
          
          <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-700 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <a href="#work" className="btn-primary">
              View Our Work
              <ArrowRight size={16} />
            </a>
            <a href="#contact" className="btn-secondary">
              Start a Project
            </a>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className={`absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 transition-all duration-700 delay-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          <span className="text-[10px] text-gray-600 tracking-[0.2em] uppercase">Scroll</span>
          <div className="w-px h-10 bg-gradient-to-b from-gray-600 to-transparent" />
        </div>
      </section>

      {/* Client Marquee */}
      <section className="py-6 border-y border-gray-900/50">
        <div className="marquee-container">
          <div className="inline-flex animate-marquee">
            {[...clients, ...clients, ...clients].map((client, i) => (
              <span key={i} className="mx-10 text-sm font-medium text-gray-600 whitespace-nowrap tracking-wide">
                {client}
                <span className="mx-10 text-gray-800">·</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Work Section */}
      <section id="work" className="section-padding">
        <div className="container-wide px-6">
          {/* Section Header */}
          <div className="max-w-2xl mb-16">
            <span className="text-sm font-medium text-gray-500 tracking-wide uppercase">Selected Work</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold mt-3 mb-4 text-white">
              Recent projects
            </h2>
            <p className="text-gray-400 text-lg">
              A selection of work for brands we believe in. Each project gets our full creative attention.
            </p>
          </div>
          
          {/* Work Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {workItems.map((item, index) => (
              <div 
                key={index}
                className="project-card group aspect-[4/3] cursor-pointer"
              >
                {/* Placeholder */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Play size={48} className="text-gray-700 group-hover:text-gray-600 transition-colors" />
                  </div>
                </div>
                
                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                  <span className="inline-block text-xs font-medium text-gray-400 mb-2 tracking-wide uppercase">
                    {item.category}
                  </span>
                  <h3 className="font-display text-2xl font-semibold text-white mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-400">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
          
          {/* View More */}
          <div className="mt-12 text-center">
            <a 
              href="https://instagram.com/neversmallstudios" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
            >
              <span>More work on Instagram</span>
              <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="section-padding bg-[#0d0d0d]">
        <div className="container-wide px-6">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <span className="text-sm font-medium text-gray-500 tracking-wide uppercase">What We Do</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold mt-3 mb-4 text-white">
              Full-service creative
            </h2>
            <p className="text-gray-400 text-lg">
              From initial concept through final delivery. We handle the creative work so you can focus on your business.
            </p>
          </div>
          
          {/* Services Grid */}
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {services.map((service, index) => {
              const Icon = service.icon
              return (
                <div key={index} className="service-card">
                  <Icon size={24} className="text-gray-500 mb-4" strokeWidth={1.5} />
                  <h3 className="font-display text-xl font-semibold text-white mb-2">{service.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{service.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="section-padding">
        <div className="container-wide px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-sm font-medium text-gray-500 tracking-wide uppercase">About Us</span>
              <h2 className="font-display text-4xl md:text-5xl font-bold mt-3 mb-6 text-white">
                Melbourne-based,<br />
                <span className="text-warm">quality-focused</span>
              </h2>
              
              <div className="space-y-5 text-gray-400 leading-relaxed">
                <p>
                  NeverSmall Studios is a creative production team based in Melbourne. We work with brands in events, food & beverage, music, and lifestyle—people who care about how their story is told.
                </p>
                <p>
                  We're not the cheapest option, and we're not trying to be. Our focus is on work that's considered, well-crafted, and effective. Every project gets the same level of attention, whether it's a single piece of content or a full campaign.
                </p>
                <p>
                  If you're looking for a creative partner who takes the work seriously, we should talk.
                </p>
              </div>
              
              <a href="#contact" className="inline-flex items-center gap-2 mt-8 text-white font-medium group">
                Start a conversation
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
            
            {/* Visual Element */}
            <div className="relative flex items-center justify-center">
              <div className="relative">
                {/* Background shape */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-800/20 to-gray-900/20 rounded-3xl blur-2xl scale-110" />
                
                {/* Logo display */}
                <div className="relative bg-gray-900/50 border border-gray-800 rounded-3xl p-16 text-center">
                  <div className="w-32 h-32 mx-auto rounded-full overflow-hidden logo-glow mb-6">
                    <Image 
                      src="/assets/NSS Logo.jpg" 
                      alt="NeverSmall Studios" 
                      width={128} 
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="font-display text-2xl font-semibold text-white">NeverSmall Studios</p>
                  <p className="text-gray-500 text-sm mt-1">Melbourne, Australia</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="section-padding bg-[#0d0d0d]">
        <div className="max-w-3xl mx-auto text-center px-6">
          <span className="text-sm font-medium text-gray-500 tracking-wide uppercase">Get in Touch</span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mt-3 mb-6 text-white">
            Have a project in mind?
          </h2>
          <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto">
            We'd like to hear about it. Reach out and let's discuss how we can help bring your vision to life.
          </p>
          
          <a 
            href="mailto:hello@neversmall.com" 
            className="inline-flex items-center gap-3 text-xl md:text-2xl font-display font-semibold text-warm hover:text-white transition-colors group"
          >
            <Mail size={24} className="group-hover:rotate-6 transition-transform" />
            hello@neversmall.com
          </a>
          
          <div className="divider my-12" />
          
          <a 
            href="https://instagram.com/neversmallstudios" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-sm"
          >
            Follow our work on Instagram
            <ArrowUpRight size={14} />
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-gray-900">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full overflow-hidden">
              <Image 
                src="/assets/NSS Logo.jpg" 
                alt="NeverSmall Studios" 
                width={32} 
                height={32}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-sm text-gray-500">NeverSmall Studios</span>
          </div>
          
          <p className="text-gray-600 text-sm">
            © {new Date().getFullYear()} NeverSmall Studios. Melbourne, Australia.
          </p>
        </div>
      </footer>
    </main>
  )
}
