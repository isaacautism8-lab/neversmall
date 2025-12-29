'use client'

import { useState, useEffect, useRef } from 'react'
import { ArrowRight, Mail, ArrowUpRight, Play, Camera, Film, Share2, Target } from 'lucide-react'
import Image from 'next/image'

/* ========================================
   DATA
   ======================================== */
const clients = [
  'Tang Events',
  'Naught Gin',
  'Golden Wok',
  'Dibo Bodi Sessions',
  'Pretty Privilege Club',
  'Australian Fashion Week',
]

const serviceCategories = [
  {
    title: 'Videography',
    icon: Film,
    items: [
      'Event coverage (recaps, BTS, highlights)',
      'Brand campaigns & hero videos',
      'Short-form social content',
      'Interviews & storytelling',
    ],
  },
  {
    title: 'Social Media Management',
    icon: Share2,
    items: [
      'Content calendar & posting schedule',
      'Caption writing & copy support',
      'Analytics & reporting',
      'Strategy consulting',
    ],
  },
  {
    title: 'Photography',
    icon: Camera,
    items: [
      'Product photography',
      'Lifestyle & campaign shoots',
      'Event photography',
      'Creative & Art direction + Production',
    ],
  },
  {
    title: 'Meta Ads',
    icon: Target,
    items: [
      'Campaign strategy & setup',
      'Retargeting & audience segmentation',
      'A/B testing (ad copy, visuals, formats)',
      'Performance tracking & optimisation',
    ],
  },
]

const workItems = [
  {
    title: 'Tang Events',
    category: 'Event Coverage',
    year: '2024',
  },
  {
    title: 'Naught Gin',
    category: 'Brand Content',
    year: '2024',
  },
  {
    title: 'Golden Wok',
    category: 'Food & Beverage',
    year: '2023',
  },
  {
    title: 'Dibo Bodi Sessions',
    category: 'Music & Lifestyle',
    year: '2023',
  },
]

/* ========================================
   HOOKS
   ======================================== */
function useIntersectionObserver(options = {}) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true)
        observer.disconnect()
      }
    }, { threshold: 0.1, ...options })

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  return { ref, isVisible }
}

function useScrollPosition() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return scrolled
}

/* ========================================
   MAIN COMPONENT
   ======================================== */
export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false)
  const scrolled = useScrollPosition()
  
  // Intersection observers for sections
  const workSection = useIntersectionObserver()
  const servicesSection = useIntersectionObserver()
  const aboutSection = useIntersectionObserver()
  const contactSection = useIntersectionObserver()

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#050505]">
      {/* Skip Link for Accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'nav-scrolled py-3' : 'py-5'}`}>
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <a href="#" className="flex items-center gap-3 group">
            <div 
              className={`logo-container w-10 h-10 transition-all duration-700 ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
            >
              <Image 
                src="/assets/NSS Logo.jpg" 
                alt="NeverSmall Studios" 
                width={40} 
                height={40}
                className="w-full h-full object-cover rounded-full"
                priority
              />
            </div>
            <div 
              className={`hidden sm:block transition-all duration-700 delay-75 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`}
            >
              <span className="text-[10px] font-semibold tracking-[0.2em] text-gray-600 uppercase">NeverSmall</span>
              <span className="block text-sm font-semibold text-white -mt-0.5 tracking-tight">Studios</span>
            </div>
          </a>
          
          <div 
            className={`hidden md:flex items-center gap-10 transition-all duration-700 delay-150 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          >
            <a href="#work" className="nav-link">Work</a>
            <a href="#services" className="nav-link">Services</a>
            <a href="#about" className="nav-link">About</a>
          </div>
          
          <div className={`transition-all duration-700 delay-225 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>
            <a href="#contact" className="btn-primary text-sm py-2.5 px-5">
              Get in Touch
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="main-content" className="relative min-h-screen flex items-center justify-center px-6">
        {/* Background effects */}
        <div className="hero-gradient" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-gradient-radial opacity-30 pointer-events-none" />
        
        {/* Decorative lines */}
        <div className="absolute left-[15%] top-0 hero-line opacity-20" />
        <div className="absolute right-[15%] top-0 hero-line opacity-20" style={{ height: '150px' }} />
        
        <div className="max-w-5xl mx-auto text-center relative z-10 pt-20">
          {/* Logo reveal */}
          <div 
            className={`mb-12 transition-all duration-1000 ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
          >
            <div className="w-24 h-24 mx-auto rounded-full overflow-hidden logo-glow-strong animate-glow">
              <Image 
                src="/assets/NSS Logo.jpg" 
                alt="NeverSmall Studios" 
                width={96} 
                height={96}
                className="w-full h-full object-cover"
                priority
              />
            </div>
          </div>
          
          {/* Tagline */}
          <p 
            className={`text-sm md:text-base font-semibold tracking-[0.2em] uppercase text-gray-500 mb-6 transition-all duration-700 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          >
            Don't sell yourself short.
          </p>
          
          {/* Headline with staggered reveal */}
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] xl:text-[6.5rem] font-bold tracking-tight">
            <span 
              className={`block text-white transition-all duration-700 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            >
              Full-service creative
            </span>
            <span 
              className={`block text-gradient-warm mt-2 transition-all duration-700 delay-450 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            >
              all in one place
            </span>
          </h1>
          
          {/* Subheadline */}
          <p 
            className={`text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mt-8 mb-12 leading-relaxed transition-all duration-700 delay-600 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
          >
            We're a team of creatives, storytellers, and marketers delivering full-service support: content, production, and strategy.
          </p>
          
          {/* CTAs */}
          <div 
            className={`flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-700 delay-750 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
          >
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
        <div 
          className={`absolute bottom-12 left-1/2 -translate-x-1/2 scroll-indicator transition-all duration-700 delay-1050 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        >
          <span className="text-[10px] text-gray-600 tracking-[0.25em] uppercase font-medium">Scroll</span>
          <div className="scroll-indicator-line" />
        </div>
      </section>

      {/* Client Marquee */}
      <section className="py-8 border-y border-gray-900/30 bg-[#050505]">
        <div className="marquee-container">
          <div className="inline-flex animate-marquee">
            {[...clients, ...clients, ...clients, ...clients].map((client, i) => (
              <div key={i} className="marquee-item">
                <span className="text-sm font-medium text-gray-500 tracking-wide">
                  {client}
                </span>
                <div className="marquee-divider" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Work Section */}
      <section id="work" ref={workSection.ref} className="section-padding bg-[#050505]">
        <div className="container-wide px-6">
          {/* Section Header */}
          <div className="max-w-2xl mb-20">
            <div 
              className={`section-label transition-all duration-700 ${workSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            >
              Selected Work
            </div>
            <h2 
              className={`font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white transition-all duration-700 delay-100 ${workSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
            >
              Recent projects
            </h2>
            <p 
              className={`text-gray-400 text-lg mt-5 leading-relaxed transition-all duration-700 delay-200 ${workSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
            >
              A selection of work for brands we believe in. Each project receives our full creative attention.
            </p>
          </div>
          
          {/* Work Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {workItems.map((item, index) => (
              <div 
                key={index}
                className={`project-card group aspect-[16/10] cursor-pointer transition-all duration-700 ${workSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: `${300 + index * 100}ms` }}
              >
                {/* Background with subtle pattern */}
                <div className="absolute inset-0 project-card-inner bg-gradient-to-br from-gray-900 via-gray-900 to-gray-950">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="btn-icon opacity-50 group-hover:opacity-80 transition-all duration-500 group-hover:scale-110">
                      <Play size={20} className="ml-0.5" />
                    </div>
                  </div>
                </div>
                
                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-8 z-10">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs font-semibold text-gray-500 tracking-wide uppercase">
                      {item.category}
                    </span>
                    <span className="text-gray-700">·</span>
                    <span className="text-xs text-gray-600">{item.year}</span>
                  </div>
                  <h3 className="font-display text-2xl md:text-3xl font-semibold text-white group-hover:text-cream transition-colors duration-300">
                    {item.title}
                  </h3>
                </div>
                
                {/* Hover arrow */}
                <div className="absolute top-6 right-6 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                  <ArrowUpRight size={20} className="text-gray-400" />
                </div>
              </div>
            ))}
          </div>
          
          {/* View More */}
          <div 
            className={`mt-16 text-center transition-all duration-700 delay-700 ${workSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          >
            <a 
              href="https://instagram.com/neversmall.studios" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-all duration-300 group text-sm font-medium"
            >
              <span>More work on Instagram</span>
              <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
            </a>
          </div>
        </div>
      </section>

      {/* Services Section - Menu Style */}
      <section id="services" ref={servicesSection.ref} className="section-padding bg-[#0a0a0a]">
        <div className="container-wide px-6">
          {/* Menu Header */}
          <div className="max-w-4xl mx-auto text-center mb-20">
            <h2 
              className={`font-display text-7xl md:text-8xl lg:text-9xl font-bold text-white tracking-tight transition-all duration-700 ${servicesSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            >
              MENU
            </h2>
            <p 
              className={`text-sm md:text-base font-semibold tracking-[0.15em] uppercase text-gray-500 mt-8 mb-4 transition-all duration-700 delay-100 ${servicesSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            >
              Don't sell yourself short.
            </p>
            <p 
              className={`text-gray-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed transition-all duration-700 delay-200 ${servicesSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
            >
              We're a team of creatives, storytellers, and marketers delivering full-service support: content, production, and strategy. All in one place.
            </p>
          </div>
          
          {/* Services Grid - Menu Style */}
          <div className="grid md:grid-cols-2 gap-x-16 gap-y-16 max-w-5xl mx-auto">
            {serviceCategories.map((category, index) => {
              const Icon = category.icon
              return (
                <div 
                  key={index} 
                  className={`transition-all duration-700 ${servicesSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                  style={{ transitionDelay: `${300 + index * 100}ms` }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <Icon size={18} className="text-gray-500" strokeWidth={1.5} />
                    <h3 className="font-display text-lg font-bold text-white tracking-wide uppercase">
                      {category.title}
                    </h3>
                  </div>
                  <ul className="space-y-3">
                    {category.items.map((item, itemIndex) => (
                      <li 
                        key={itemIndex} 
                        className="text-gray-400 text-sm leading-relaxed pl-7"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" ref={aboutSection.ref} className="section-padding bg-[#050505]">
        <div className="container-wide px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <div 
                className={`section-label transition-all duration-700 ${aboutSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              >
                About Us
              </div>
              <h2 
                className={`font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white transition-all duration-700 delay-100 ${aboutSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
              >
                Melbourne-based,<br />
                <span className="text-gradient-warm">quality-focused</span>
              </h2>
              
              <div 
                className={`space-y-5 text-gray-400 leading-relaxed mt-8 transition-all duration-700 delay-200 ${aboutSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
              >
                <p>
                  NeverSmall Studios is a creative production team based in Melbourne. We work with brands in events, food & beverage, music, and lifestyle—people who care about how their story is told.
                </p>
                <p>
                  We're not the cheapest option, and we're not trying to be. Our focus is on work that's considered, well-crafted, and effective. Every project receives the same level of attention.
                </p>
                <p>
                  If you're looking for a creative partner who takes the work seriously, we should talk.
                </p>
              </div>
              
              <a 
                href="#contact" 
                className={`inline-flex items-center gap-2 mt-10 text-white font-medium group transition-all duration-700 delay-300 ${aboutSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              >
                Start a conversation
                <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform duration-300" />
              </a>
            </div>
            
            {/* Visual Element */}
            <div 
              className={`relative flex items-center justify-center transition-all duration-1000 delay-300 ${aboutSection.isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
            >
              <div className="relative">
                {/* Ambient glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-800/10 to-transparent rounded-3xl blur-3xl scale-150" />
                
                {/* Card */}
                <div className="relative glass rounded-3xl p-16 text-center">
                  <div className="w-36 h-36 mx-auto rounded-full overflow-hidden logo-glow-strong mb-8 animate-float">
                    <Image 
                      src="/assets/NSS Logo.jpg" 
                      alt="NeverSmall Studios" 
                      width={144} 
                      height={144}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="font-display text-2xl font-semibold text-white tracking-tight">NeverSmall Studios</p>
                  <p className="text-gray-500 text-sm mt-2">Melbourne, Australia</p>
                  
                  {/* Decorative line */}
                  <div className="divider mt-8 mb-6" />
                  
                  <p className="text-xs text-gray-600 tracking-wide uppercase">Est. 2023</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" ref={contactSection.ref} className="section-padding bg-[#0a0a0a] relative overflow-hidden">
        {/* Ambient background */}
        <div className="absolute inset-0 bg-gradient-spotlight pointer-events-none" />
        
        <div className="max-w-3xl mx-auto text-center px-6 relative z-10">
          <div 
            className={`section-label justify-center transition-all duration-700 ${contactSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          >
            Get in Touch
          </div>
          <h2 
            className={`font-display text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white transition-all duration-700 delay-100 ${contactSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
          >
            Have a project in mind?
          </h2>
          <p 
            className={`text-gray-400 text-lg mt-6 mb-12 max-w-xl mx-auto leading-relaxed transition-all duration-700 delay-200 ${contactSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
          >
            We'd like to hear about it. Reach out and let's discuss how we can help bring your vision to life.
          </p>
          
          <a 
            href="mailto:hello@neversmall.com.au" 
            className={`inline-flex items-center gap-4 text-2xl md:text-3xl font-display font-semibold text-warm hover:text-white transition-all duration-500 group ${contactSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            style={{ transitionDelay: '300ms' }}
          >
            <div className="btn-icon group-hover:scale-110 group-hover:bg-gray-800 transition-all duration-300">
              <Mail size={20} />
            </div>
            <span>hello@neversmall.com.au</span>
          </a>
          
          <div className="divider my-14" />
          
          <a 
            href="https://instagram.com/neversmall.studios" 
            target="_blank" 
            rel="noopener noreferrer" 
            className={`inline-flex items-center gap-2 text-gray-500 hover:text-white transition-all duration-300 text-sm font-medium ${contactSection.isVisible ? 'opacity-100' : 'opacity-0'}`}
            style={{ transitionDelay: '400ms' }}
          >
            Follow our work on Instagram
            <ArrowUpRight size={14} />
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 border-t border-gray-900/50 bg-[#050505]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-9 h-9 rounded-full overflow-hidden">
              <Image 
                src="/assets/NSS Logo.jpg" 
                alt="NeverSmall Studios" 
                width={36} 
                height={36}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-sm text-gray-500 font-medium">NeverSmall Studios</span>
          </div>
          
          <div className="flex items-center gap-6 text-sm text-gray-600">
            <a 
              href="https://instagram.com/neversmall.studios" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              Instagram
            </a>
            <a 
              href="mailto:hello@neversmall.com.au"
              className="hover:text-white transition-colors"
            >
              Email
            </a>
          </div>
          
          <p className="text-gray-600 text-sm">
            © {new Date().getFullYear()} NeverSmall Studios. Melbourne, Australia.
          </p>
        </div>
      </footer>
    </main>
  )
}
