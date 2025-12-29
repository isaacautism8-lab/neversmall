'use client'

import { useState, useEffect, useRef } from 'react'
import { ArrowRight, Mail, ArrowUpRight, Play, Camera, Film, Share2, Target, Menu, X } from 'lucide-react'
import Image from 'next/image'

/* ========================================
   DATA - Each project is unique
   ======================================== */
const workItems = [
  {
    title: 'tang events',
    vibe: 'dark', // nightlife energy
    category: 'Event Coverage',
    description: 'melbourne club nights and festivals — big moments captured and amplified for socials.',
    color: 'from-purple-900/20 to-gray-900',
  },
  {
    title: 'pretty privilege club',
    vibe: 'light', // lifestyle, rooftop
    category: 'Content Creation',
    description: 'rooftop vibes and golden hour — creating content that immerses viewers in the full experience.',
    color: 'from-amber-100/80 to-orange-50/60',
  },
  {
    title: 'naught gin',
    vibe: 'dark', // moody product
    category: 'Brand Content',
    description: 'premium spirits deserve premium content — lifestyle photography that elevates the pour.',
    color: 'from-emerald-900/20 to-gray-900',
  },
  {
    title: 'dibo bodi sessions',
    vibe: 'dark', // underground music
    category: 'Music & Lifestyle',
    description: 'underground music collective — raw energy, captured authentically.',
    color: 'from-red-900/20 to-gray-900',
  },
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

/* ========================================
   HOOKS
   ======================================== */
function useIntersectionObserver() {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true)
        observer.disconnect()
      }
    }, { threshold: 0.1 })

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return { ref, isVisible }
}

function useScrollPosition() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const scrolled = useScrollPosition()
  
  const workSection = useIntersectionObserver()
  const servicesSection = useIntersectionObserver()
  const aboutSection = useIntersectionObserver()
  const contactSection = useIntersectionObserver()

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileMenuOpen])

  const closeMobileMenu = () => setMobileMenuOpen(false)

  return (
    <main className="min-h-screen overflow-x-hidden">
      {/* Skip Link */}
      <a href="#main-content" className="skip-link">Skip to main content</a>

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'nav-scrolled py-3' : 'py-4 md:py-5'}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2 sm:gap-3 group">
            <div className={`logo-container w-9 h-9 sm:w-10 sm:h-10 transition-all duration-700 ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
              <Image 
                src="/assets/NSS Logo.jpg" 
                alt="neversmall studios" 
                width={40} 
                height={40}
                className="w-full h-full object-cover rounded-full"
                priority
              />
            </div>
            <div className={`hidden sm:block transition-all duration-700 delay-75 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
              <span className="text-[10px] font-semibold tracking-[0.2em] text-gray-500">neversmall</span>
              <span className="block text-sm font-semibold text-white -mt-0.5 tracking-tight">Studios</span>
            </div>
          </a>
          
          <div className={`hidden md:flex items-center gap-8 lg:gap-10 transition-all duration-700 delay-150 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
            <a href="#work" className="nav-link">Work</a>
            <a href="#services" className="nav-link">Services</a>
            <a href="#about" className="nav-link">About</a>
          </div>
          
          <div className={`hidden md:block transition-all duration-700 delay-225 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
            <a href="#contact" className="btn-primary text-sm py-2.5 px-5">Let's Talk</a>
          </div>

          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`md:hidden w-11 h-11 flex items-center justify-center rounded-lg transition-all duration-300 ${mobileMenuOpen ? 'bg-gray-800' : ''}`}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? <X size={22} className="text-white" /> : <Menu size={22} className="text-white" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden fixed inset-0 top-[60px] bg-[#050505]/98 backdrop-blur-xl transition-all duration-500 ${mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
          <div className="flex flex-col items-center justify-center h-full gap-8 px-6">
            <a href="#work" onClick={closeMobileMenu} className="text-2xl font-display font-semibold text-white">Work</a>
            <a href="#services" onClick={closeMobileMenu} className="text-2xl font-display font-semibold text-white">Services</a>
            <a href="#about" onClick={closeMobileMenu} className="text-2xl font-display font-semibold text-white">About</a>
            <a href="#contact" onClick={closeMobileMenu} className="btn-primary mt-4">Let's Talk</a>
            <p className="slogan slogan-small text-center mt-8 opacity-60">don't sell yourself short.</p>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="main-content" className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 bg-[#050505]">
        <div className="hero-gradient" />
        
        <div className="max-w-5xl mx-auto text-center relative z-10 pt-16 sm:pt-20">
          {/* Logo */}
          <div className={`mb-6 sm:mb-8 transition-all duration-1000 ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
            <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-full overflow-hidden logo-glow-strong animate-glow">
              <Image src="/assets/NSS Logo.jpg" alt="NeverSmall Studios" width={96} height={96} className="w-full h-full object-cover" priority />
            </div>
          </div>
          
          {/* Human intro */}
          <p className={`text-gray-400 text-sm sm:text-base mb-4 transition-all duration-700 delay-200 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
            hey, we're neversmall studios.
          </p>
          
          {/* Headline */}
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight px-2">
            <span className={`block text-white transition-all duration-700 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              We make brands look
            </span>
            <span className={`block text-gradient-warm mt-1 sm:mt-2 transition-all duration-700 delay-450 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              the way they deserve.
            </span>
          </h1>
          
          {/* Human description */}
          <p className={`text-gray-400 text-base sm:text-lg md:text-xl max-w-xl sm:max-w-2xl mx-auto mt-6 sm:mt-8 mb-6 leading-relaxed px-2 transition-all duration-700 delay-600 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
            Content, production, and strategy for Melbourne brands who actually care about quality. Every client is different—so is every project.
          </p>

          {/* Slogan */}
          <p className={`slogan slogan-large mb-10 sm:mb-14 transition-all duration-1000 delay-750 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
            don't sell yourself short.
          </p>
          
          {/* CTAs */}
          <div className={`flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 transition-all duration-700 delay-900 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
            <a href="#work" className="btn-primary w-full sm:w-auto">
              See What We've Made
              <ArrowRight size={16} />
            </a>
            <a href="#contact" className="btn-secondary w-full sm:w-auto">
              Work With Us
            </a>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className={`hidden sm:flex absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 scroll-indicator transition-all duration-700 delay-1050 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          <span className="text-[10px] text-gray-600 tracking-[0.25em] uppercase font-medium">Scroll</span>
          <div className="scroll-indicator-line" />
        </div>
      </section>

      {/* Work Section */}
      <section id="work" ref={workSection.ref} className="section-padding bg-[#050505]">
        <div className="container-wide px-4 sm:px-6">
          {/* Section Header - Human */}
          <div className="max-w-2xl mb-12 sm:mb-16 lg:mb-20">
            <div className={`section-label transition-all duration-700 ${workSection.isVisible ? 'opacity-100' : 'opacity-0'}`}>
              Our Work
            </div>
            <h2 className={`font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white transition-all duration-700 delay-100 ${workSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
              Every brand has a story.
            </h2>
            <p className={`text-gray-400 text-base sm:text-lg mt-4 sm:mt-5 leading-relaxed transition-all duration-700 delay-200 ${workSection.isVisible ? 'opacity-100' : 'opacity-0'}`}>
              We don't do cookie-cutter. Each client gets something that actually fits them—their energy, their audience, their goals.
            </p>
          </div>
          
          {/* Work Grid - Varied Cards */}
          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            {workItems.map((item, index) => (
              <div 
                key={index}
                className={`group relative aspect-[16/10] rounded-2xl overflow-hidden cursor-pointer transition-all duration-700 ${
                  item.vibe === 'light' 
                    ? 'bg-gradient-to-br ' + item.color 
                    : 'bg-gradient-to-br ' + item.color
                } ${workSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: `${300 + index * 100}ms` }}
              >
                {/* Play icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center opacity-40 group-hover:opacity-70 transition-all duration-500 group-hover:scale-110 ${
                    item.vibe === 'light' ? 'bg-black/10' : 'bg-white/10'
                  }`}>
                    <Play size={20} className={`ml-0.5 ${item.vibe === 'light' ? 'text-black/60' : 'text-white/60'}`} />
                  </div>
                </div>
                
                {/* Content */}
                <div className="absolute inset-0 p-5 sm:p-6 lg:p-8 flex flex-col justify-between">
                  {/* Top */}
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] sm:text-xs font-semibold tracking-wide uppercase ${
                      item.vibe === 'light' ? 'text-black/50' : 'text-white/50'
                    }`}>
                      {item.category}
                    </span>
                    <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                      <ArrowUpRight size={16} className={item.vibe === 'light' ? 'text-black/50' : 'text-white/50'} />
                    </div>
                  </div>
                  
                  {/* Bottom */}
                  <div>
                    <h3 className={`font-display text-2xl sm:text-3xl md:text-4xl font-bold lowercase tracking-tight transition-colors duration-300 ${
                      item.vibe === 'light' 
                        ? 'text-black group-hover:text-black/70' 
                        : 'text-white group-hover:text-cream'
                    }`}>
                      {item.title}
                    </h3>
                    <p className={`text-xs sm:text-sm mt-2 max-w-xs leading-relaxed ${
                      item.vibe === 'light' ? 'text-black/60' : 'text-white/60'
                    }`}>
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Slogan watermark */}
                <div className={`absolute bottom-3 right-4 sm:bottom-4 sm:right-6 ${
                  item.vibe === 'light' ? 'slogan slogan-dark' : 'slogan'
                } text-[10px] opacity-30`}>
                  don't sell yourself short.
                </div>
              </div>
            ))}
          </div>
          
          {/* View More - Human */}
          <div className={`mt-10 sm:mt-12 lg:mt-16 text-center transition-all duration-700 delay-700 ${workSection.isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <a 
              href="https://instagram.com/neversmall.studios" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-all duration-300 group text-sm font-medium min-h-[44px] px-4"
            >
              <span>More on our Instagram</span>
              <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>
        </div>
      </section>

      {/* Services Section - Light/Cream */}
      <section id="services" ref={servicesSection.ref} className="section-padding section-light">
        <div className="container-wide px-4 sm:px-6">
          {/* Menu Header */}
          <div className="max-w-4xl mx-auto text-center mb-12 sm:mb-16 lg:mb-20">
            <h2 className={`font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold tracking-tight transition-all duration-700 ${servicesSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              MENU
            </h2>
            <p className={`slogan slogan-dark slogan-medium mt-6 sm:mt-8 mb-4 transition-all duration-700 delay-100 ${servicesSection.isVisible ? 'opacity-100' : 'opacity-0'}`}>
              don't sell yourself short.
            </p>
            <p className={`text-sm sm:text-base md:text-lg max-w-xl sm:max-w-2xl mx-auto leading-relaxed transition-all duration-700 delay-200 ${servicesSection.isVisible ? 'opacity-100' : 'opacity-0'}`}>
              We're a team of creatives, storytellers, and marketers. Here's what we can do for you.
            </p>
          </div>
          
          {/* Services Grid */}
          <div className="grid sm:grid-cols-2 gap-10 sm:gap-x-10 sm:gap-y-12 lg:gap-x-16 lg:gap-y-16 max-w-5xl mx-auto">
            {serviceCategories.map((category, index) => {
              const Icon = category.icon
              return (
                <div 
                  key={index} 
                  className={`transition-all duration-700 ${servicesSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                  style={{ transitionDelay: `${300 + index * 100}ms` }}
                >
                  <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                    <Icon size={16} className="text-gray-500 flex-shrink-0" strokeWidth={1.5} />
                    <h3 className="font-display text-base sm:text-lg font-bold tracking-wide uppercase">
                      {category.title}
                    </h3>
                  </div>
                  <ul className="space-y-2 sm:space-y-3">
                    {category.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="text-sm leading-relaxed pl-6 sm:pl-7">
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

      {/* About Section - Human/Personal */}
      <section id="about" ref={aboutSection.ref} className="section-padding bg-[#050505]">
        <div className="container-wide px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 sm:gap-16 lg:gap-20 items-center">
            <div>
              <div className={`section-label transition-all duration-700 ${aboutSection.isVisible ? 'opacity-100' : 'opacity-0'}`}>
                Who We Are
              </div>
              <h2 className={`font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white transition-all duration-700 delay-100 ${aboutSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                Real people,<br />
                <span className="text-gradient-warm">real work.</span>
              </h2>
              
              <div className={`space-y-4 sm:space-y-5 text-gray-400 text-sm sm:text-base leading-relaxed mt-6 sm:mt-8 transition-all duration-700 delay-200 ${aboutSection.isVisible ? 'opacity-100' : 'opacity-0'}`}>
                <p>
                  We're a small creative team in Melbourne. We work with brands in events, food & beverage, music, and lifestyle—people who give a damn about how their story is told.
                </p>
                <p>
                  We're not the cheapest. We're also not trying to be. What we are is obsessive about quality, honest about what works, and genuinely invested in making you look good.
                </p>
                <p>
                  Every project is different because every client is different. That's the point.
                </p>
              </div>
              
              <a 
                href="#contact" 
                className={`inline-flex items-center gap-2 mt-8 sm:mt-10 text-white font-medium group min-h-[44px] transition-all duration-700 delay-300 ${aboutSection.isVisible ? 'opacity-100' : 'opacity-0'}`}
              >
                Let's chat about your project
                <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform duration-300" />
              </a>
            </div>
            
            {/* Card */}
            <div className={`relative flex items-center justify-center transition-all duration-1000 delay-300 ${aboutSection.isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
              <div className="relative w-full max-w-sm sm:max-w-md mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-800/10 to-transparent rounded-3xl blur-3xl scale-150" />
                
                <div className="relative glass rounded-2xl sm:rounded-3xl p-8 sm:p-12 lg:p-16 text-center">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 lg:w-36 lg:h-36 mx-auto rounded-full overflow-hidden logo-glow-strong mb-6 sm:mb-8 animate-float">
                    <Image src="/assets/NSS Logo.jpg" alt="NeverSmall Studios" width={144} height={144} className="w-full h-full object-cover" />
                  </div>
                  <p className="font-display text-xl sm:text-2xl font-semibold text-white tracking-tight">neversmall.</p>
                  <p className="text-gray-500 text-xs sm:text-sm mt-2">Melbourne, Australia</p>
                  
                  <p className="slogan slogan-small mt-6 sm:mt-8">don't sell yourself short.</p>
                  
                  <div className="divider mt-6 sm:mt-8 mb-4 sm:mb-6" />
                  
                  <p className="text-[10px] sm:text-xs text-gray-600 tracking-wide uppercase">Est. 2023</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" ref={contactSection.ref} className="section-padding section-light relative overflow-hidden">
        <div className="max-w-3xl mx-auto text-center px-4 sm:px-6 relative z-10">
          <div className={`section-label justify-center transition-all duration-700 ${contactSection.isVisible ? 'opacity-100' : 'opacity-0'}`}>
            Let's Work Together
          </div>
          <h2 className={`font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold transition-all duration-700 delay-100 ${contactSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            Got something in mind?
          </h2>
          <p className={`text-base sm:text-lg mt-4 sm:mt-6 mb-8 sm:mb-12 max-w-xl mx-auto leading-relaxed transition-all duration-700 delay-200 ${contactSection.isVisible ? 'opacity-100' : 'opacity-0'}`}>
            We'd love to hear about it. No pressure, no hard sell—just a conversation about how we might help.
          </p>
          
          <a 
            href="mailto:hello@neversmall.com.au" 
            className={`inline-flex items-center gap-3 sm:gap-4 text-lg sm:text-xl md:text-2xl lg:text-3xl font-display font-semibold text-gray-900 hover:text-gray-600 transition-all duration-500 group ${contactSection.isVisible ? 'opacity-100' : 'opacity-0'}`}
            style={{ transitionDelay: '300ms' }}
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/5 flex items-center justify-center flex-shrink-0 group-hover:bg-black/10 group-hover:scale-110 transition-all duration-300">
              <Mail size={18} className="text-gray-700" />
            </div>
            <span className="break-all sm:break-normal">hello@neversmall.com.au</span>
          </a>
          
          <div className="divider my-10 sm:my-14" />
          
          <a 
            href="https://instagram.com/neversmall.studios" 
            target="_blank" 
            rel="noopener noreferrer" 
            className={`inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-all duration-300 text-sm font-medium min-h-[44px] px-4 ${contactSection.isVisible ? 'opacity-100' : 'opacity-0'}`}
            style={{ transitionDelay: '400ms' }}
          >
            Follow along on Instagram
            <ArrowUpRight size={14} />
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 sm:py-10 px-4 sm:px-6 border-t border-gray-900/50 bg-[#050505]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center gap-6 sm:gap-8 md:flex-row md:justify-between mb-8">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden flex-shrink-0">
                <Image src="/assets/NSS Logo.jpg" alt="NeverSmall Studios" width={36} height={36} className="w-full h-full object-cover" />
              </div>
              <span className="text-sm text-gray-400 font-medium">neversmall.</span>
            </div>
            
            <div className="flex items-center gap-6 sm:gap-8 text-sm text-gray-500">
              <a href="https://instagram.com/neversmall.studios" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors min-h-[44px] flex items-center">
                Instagram
              </a>
              <a href="mailto:hello@neversmall.com.au" className="hover:text-white transition-colors min-h-[44px] flex items-center">
                Email
              </a>
            </div>
          </div>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between pt-6 border-t border-gray-900/30">
            <p className="slogan slogan-small opacity-50">don't sell yourself short.</p>
            <p className="text-gray-600 text-xs sm:text-sm text-center">
              © {new Date().getFullYear()} neversmall studios. melbourne.
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}
