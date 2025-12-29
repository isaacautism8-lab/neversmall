'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { ArrowRight, Mail, ArrowUpRight, Play, Camera, Film, Share2, Target, Menu, X, Instagram, Sun, Moon } from 'lucide-react'
import Image from 'next/image'

/* ========================================
   TYPE DEFINITIONS
   ======================================== */
interface ServiceCategory {
  title: string
  icon: typeof Film
  items: string[]
}

interface WorkItem {
  title: string
  category: string
  year: string
  gradient: string
  image: string
  description: string
}

/* ========================================
   DATA
   ======================================== */
const serviceCategories: ServiceCategory[] = [
  {
    title: 'videography',
    icon: Film,
    items: [
      'event coverage (recaps, bts, highlights)',
      'brand campaigns & hero videos',
      'short-form social content',
      'interviews & storytelling',
    ],
  },
  {
    title: 'social media management',
    icon: Share2,
    items: [
      'content calendar & posting schedule',
      'caption writing & copy support',
      'analytics & reporting',
      'strategy consulting',
    ],
  },
  {
    title: 'photography',
    icon: Camera,
    items: [
      'product photography',
      'lifestyle & campaign shoots',
      'event photography',
      'creative & art direction + production',
    ],
  },
  {
    title: 'meta ads',
    icon: Target,
    items: [
      'campaign strategy & setup',
      'retargeting & audience segmentation',
      'a/b testing (ad copy, visuals, formats)',
      'performance tracking & optimisation',
    ],
  },
]

const workItems: WorkItem[] = [
  {
    title: 'tang events',
    category: 'event coverage',
    year: '2024',
    gradient: 'from-violet-900/60 to-violet-700/30',
    image: '/assets/tang.png',
    description: 'melbourne club nights and festivals. big moments captured and amplified for socials.',
  },
  {
    title: 'intelliprop',
    category: 'brand content',
    year: '2024',
    gradient: 'from-slate-800/60 to-slate-600/30',
    image: '/assets/intelliprop.png',
    description: 'professional interview series. compelling narratives that connect.',
  },
  {
    title: 'pretty privilege club',
    category: 'lifestyle',
    year: '2024',
    gradient: 'from-rose-900/60 to-rose-700/30',
    image: '/assets/pretty_privilege.png',
    description: 'rooftop events and golden hour moments. lifestyle content that stands out.',
  },
  {
    title: 'golden wok',
    category: 'food & beverage',
    year: '2023',
    gradient: 'from-amber-900/60 to-amber-700/30',
    image: '/assets/golden_wok.png',
    description: 'strategy, styling, shoot. visuals as punchy as the products.',
  },
  {
    title: 'naught gin',
    category: 'brand content',
    year: '2024',
    gradient: 'from-teal-900/60 to-teal-700/30',
    image: '/assets/naught_gin.png',
    description: 'bar culture and brand storytelling. authentic moments.',
  },
]

/* ========================================
   CUSTOM HOOKS
   ======================================== */
function useIntersectionObserver(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [threshold])

  return { ref, isVisible }
}

function useScrollPosition() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    
    // Check on mount
    handleScroll()
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return scrolled
}

function useTheme() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')

  useEffect(() => {
    // Check for saved preference or system preference
    const saved = localStorage.getItem('theme') as 'dark' | 'light' | null
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    const initialTheme = saved || (prefersDark ? 'dark' : 'dark') // Default to dark
    setTheme(initialTheme)
    document.documentElement.setAttribute('data-theme', initialTheme)
  }, [])

  const toggleTheme = useCallback(() => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
  }, [theme])

  return { theme, toggleTheme }
}

/* ========================================
   MAIN COMPONENT
   ======================================== */
export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const scrolled = useScrollPosition()
  const { theme, toggleTheme } = useTheme()
  
  // Section visibility observers
  const heroSection = useIntersectionObserver()
  const workSection = useIntersectionObserver()
  const servicesSection = useIntersectionObserver()
  const aboutSection = useIntersectionObserver()
  const contactSection = useIntersectionObserver()

  // Initial load animation
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
      document.body.style.touchAction = 'none'
    } else {
      document.body.style.overflow = ''
      document.body.style.touchAction = ''
    }
    return () => {
      document.body.style.overflow = ''
      document.body.style.touchAction = ''
    }
  }, [mobileMenuOpen])

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false)
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [mobileMenuOpen])

  const closeMobileMenu = useCallback(() => setMobileMenuOpen(false), [])

  return (
    <main className="min-h-screen overflow-x-hidden">
      {/* Animated Gradient Orbs - Performance optimized */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
        <div className="gradient-orb gradient-orb-1" />
        <div className="gradient-orb gradient-orb-2" />
        <div className="gradient-orb gradient-orb-3" />
      </div>

      {/* Skip Link for Accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Navigation */}
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'nav-scrolled py-3' : 'py-4 md:py-5'}`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          {/* Logo */}
          <a 
            href="#" 
            className="flex items-center gap-2 sm:gap-3 group"
            aria-label="neversmall studios - Home"
          >
            <div 
              className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden logo-glow transition-all duration-700 ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
            >
              <Image 
                src="/assets/nss-logo.png" 
                alt=""
                width={44} 
                height={44}
                className="w-full h-full object-cover"
                priority
              />
            </div>
            <span 
              className={`hidden sm:block text-[10px] font-semibold tracking-[0.2em] text-gray-500 uppercase transition-all duration-700 delay-75 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`}
            >
              neversmall.
            </span>
          </a>
          
          {/* Desktop Navigation */}
          <div 
            className={`hidden md:flex items-center gap-8 lg:gap-10 transition-all duration-700 delay-150 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          >
            <a href="#work" className="nav-link">work</a>
            <a href="#services" className="nav-link">services</a>
            <a href="#about" className="nav-link">about</a>
            <a 
              href="https://instagram.com/neversmall.studios" 
              target="_blank" 
              rel="noopener noreferrer"
              className="nav-link"
              aria-label="Follow us on Instagram"
            >
              <Instagram size={18} aria-hidden="true" />
            </a>
          </div>
          
          {/* Desktop Actions */}
          <div className={`hidden md:flex items-center gap-3 transition-all duration-700 delay-225 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>
            <button 
              onClick={toggleTheme}
              className="theme-toggle"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
            </button>
            <a href="#contact" className="btn-primary text-sm py-2.5 px-5">
              let's talk
            </a>
          </div>

          {/* Mobile Controls */}
          <div className="flex md:hidden items-center gap-2">
            <button 
              onClick={toggleTheme}
              className="theme-toggle"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
            </button>
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`menu-btn ${mobileMenuOpen ? 'active' : ''}`}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {mobileMenuOpen ? (
                <X size={22} aria-hidden="true" />
              ) : (
                <Menu size={22} aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div 
          id="mobile-menu"
          className="mobile-menu md:hidden"
          aria-hidden={!mobileMenuOpen}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          <div className="flex flex-col items-center justify-center h-full gap-8 px-6">
            <a 
              href="#work" 
              onClick={closeMobileMenu}
              className="text-2xl font-display font-semibold hover:text-violet-400 transition-colors"
              tabIndex={mobileMenuOpen ? 0 : -1}
            >
              work
            </a>
            <a 
              href="#services" 
              onClick={closeMobileMenu}
              className="text-2xl font-display font-semibold hover:text-violet-400 transition-colors"
              tabIndex={mobileMenuOpen ? 0 : -1}
            >
              services
            </a>
            <a 
              href="#about" 
              onClick={closeMobileMenu}
              className="text-2xl font-display font-semibold hover:text-violet-400 transition-colors"
              tabIndex={mobileMenuOpen ? 0 : -1}
            >
              about
            </a>
            <a 
              href="#contact" 
              onClick={closeMobileMenu}
              className="btn-primary mt-4"
              tabIndex={mobileMenuOpen ? 0 : -1}
            >
              let's talk
            </a>
            <div className="absolute bottom-12 text-center">
              <p className="slogan slogan-medium mb-4">Don't sell yourself short.</p>
              <a 
                href="https://instagram.com/neversmall.studios" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-violet-400 transition-colors text-sm flex items-center justify-center gap-2"
                tabIndex={mobileMenuOpen ? 0 : -1}
              >
                <Instagram size={16} aria-hidden="true" /> @neversmall.studios
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section 
        id="main-content" 
        ref={heroSection.ref} 
        className="relative min-h-screen min-h-[100dvh] flex items-center justify-center px-4 sm:px-6 pt-24 md:pt-0"
        aria-labelledby="hero-heading"
      >
        <div className="max-w-6xl mx-auto relative z-10 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Text Content */}
          <div className="text-center lg:text-left">
            <div 
              className={`transition-all duration-1000 ${heroSection.isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
            >
              <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto lg:mx-0 rounded-full overflow-hidden logo-glow-strong animate-float">
                <Image 
                  src="/assets/nss-logo.png" 
                  alt="neversmall studios logo"
                  width={112} 
                  height={112}
                  className="w-full h-full object-cover"
                  priority
                />
              </div>
            </div>
            
            <p 
              className={`section-label justify-center lg:justify-start mt-8 transition-all duration-700 delay-200 ${heroSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            >
              creative agency • melbourne
            </p>
            
            <h1 
              id="hero-heading"
              className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[5.5rem] font-bold tracking-tight"
            >
              <span 
                className={`block transition-all duration-700 delay-300 ${heroSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              >
                content
              </span>
              <span 
                className={`block transition-all duration-700 ${heroSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: '450ms' }}
              >
                production
              </span>
              <span 
                className={`block text-gradient mt-1 sm:mt-2 transition-all duration-700 ${heroSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: '600ms' }}
              >
                & strategy
              </span>
            </h1>
            
            <p 
              className={`slogan slogan-large max-w-xl mx-auto lg:mx-0 mt-8 mb-12 transition-all duration-700 ${heroSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
              style={{ transitionDelay: '750ms' }}
            >
              Don't sell yourself short.
            </p>
            
            <div 
              className={`flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 transition-all duration-700 ${heroSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
              style={{ transitionDelay: '900ms' }}
            >
              <a href="#work" className="btn-primary w-full sm:w-auto">
                view our work
                <ArrowRight size={16} aria-hidden="true" />
              </a>
              <a href="#contact" className="btn-secondary w-full sm:w-auto">
                let's chat
              </a>
            </div>
          </div>

          {/* Right: Visual Grid - Desktop Only */}
          <div 
            className={`hidden lg:block transition-all duration-1000 delay-500 ${heroSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
            aria-hidden="true"
          >
            <div className="relative">
              <div className="glass rounded-3xl p-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-rose-500/10" />
                <div className="relative z-10">
                  <div className="grid grid-cols-2 gap-3">
                    {workItems.slice(0, 4).map((item) => (
                      <div 
                        key={item.title}
                        className="aspect-square rounded-xl overflow-hidden relative group transition-all duration-500 hover:scale-105 cursor-pointer"
                      >
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          sizes="200px"
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                        <span className="absolute bottom-3 left-3 text-sm font-display font-semibold text-white/90">{item.title}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between">
                    <span className="slogan slogan-small">Don't sell yourself short.</span>
                    <a 
                      href="https://instagram.com/neversmall.studios" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
                    >
                      <Instagram size={14} aria-hidden="true" />
                      @neversmall.studios
                    </a>
                  </div>
                </div>
              </div>
              
              {/* Floating accent elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl blur-2xl opacity-30 animate-float" style={{ animationDelay: '-2s' }} />
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl blur-2xl opacity-20 animate-float" style={{ animationDelay: '-4s' }} />
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div 
          className={`hidden sm:flex absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 scroll-indicator transition-all duration-700 ${heroSection.isVisible ? 'opacity-100' : 'opacity-0'}`}
          style={{ transitionDelay: '1050ms' }}
          aria-hidden="true"
        >
          <span className="text-[10px] text-gray-600 tracking-[0.25em] uppercase font-medium">scroll</span>
          <div className="scroll-indicator-line" />
        </div>
      </section>

      {/* Work Section */}
      <section 
        id="work" 
        ref={workSection.ref} 
        className="section-padding relative z-10"
        aria-labelledby="work-heading"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="max-w-2xl mb-12 sm:mb-16 lg:mb-20">
            <span 
              className={`section-label transition-all duration-700 ${workSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            >
              selected work
            </span>
            <h2 
              id="work-heading"
              className={`font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold uppercase transition-all duration-700 delay-100 ${workSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
            >
              client wins
            </h2>
            <p 
              className={`text-base sm:text-lg mt-4 sm:mt-5 leading-relaxed transition-all duration-700 delay-200 ${workSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
            >
              every project is different because every client is different. we craft unique stories that clarify and visuals that resonate.
            </p>
          </div>
          
          {/* Work Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {workItems.map((item, index) => (
              <article 
                key={item.title}
                className={`project-card group cursor-pointer transition-all duration-700 ${workSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: `${300 + index * 100}ms` }}
              >
                <div className={`aspect-[4/5] relative overflow-hidden rounded-2xl bg-gradient-to-br ${item.gradient}`}>
                  {/* Background Image */}
                  <Image
                    src={item.image}
                    alt={`${item.title} - ${item.category}`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                  
                  <div className="card-glow" />
                  
                  {/* Center play button */}
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500">
                      <Play size={20} className="ml-1 text-white" aria-hidden="true" />
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 z-10">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-semibold text-gray-300 tracking-wide uppercase">
                        {item.category}
                      </span>
                      <span className="text-gray-500" aria-hidden="true">·</span>
                      <span className="text-xs text-gray-400">{item.year}</span>
                    </div>
                    <h3 className="font-display text-xl sm:text-2xl font-semibold text-white group-hover:text-violet-300 transition-colors duration-300">
                      {item.title}
                    </h3>
                    <p className="text-gray-400 text-xs sm:text-sm mt-2 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {item.description}
                    </p>
                  </div>
                  
                  {/* Hover arrow */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0 z-10">
                    <ArrowUpRight size={20} className="text-white" aria-hidden="true" />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section 
        id="services" 
        ref={servicesSection.ref} 
        className="section-padding section-light relative z-10"
        aria-labelledby="services-heading"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center mb-12 sm:mb-16 lg:mb-20">
            <span 
              className={`section-label justify-center transition-all duration-700 ${servicesSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            >
              what we offer
            </span>
            <h2 
              id="services-heading"
              className={`font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold tracking-tight uppercase transition-all duration-700 ${servicesSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            >
              menu
            </h2>
            <p 
              className={`slogan slogan-medium slogan-dark mt-6 sm:mt-8 mb-3 sm:mb-4 transition-all duration-700 delay-100 ${servicesSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            >
              Don't sell yourself short.
            </p>
            <p 
              className={`text-sm sm:text-base md:text-lg max-w-xl sm:max-w-2xl mx-auto leading-relaxed transition-all duration-700 delay-200 ${servicesSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
            >
              we're a team of creatives, storytellers, and marketers delivering full-service support: content, production, and strategy. all in one place.
            </p>
          </div>
          
          {/* Services Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12 max-w-5xl mx-auto">
            {serviceCategories.map((category, index) => {
              const Icon = category.icon
              return (
                <div 
                  key={category.title} 
                  className={`transition-all duration-700 ${servicesSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                  style={{ transitionDelay: `${300 + index * 100}ms` }}
                >
                  <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-rose-500/20 flex items-center justify-center flex-shrink-0">
                      <Icon size={18} className="text-violet-600" strokeWidth={1.5} aria-hidden="true" />
                    </div>
                    <h3 className="font-display text-base sm:text-lg font-bold tracking-wide uppercase text-gray-900">
                      {category.title}
                    </h3>
                  </div>
                  <ul className="space-y-2 sm:space-y-3" role="list">
                    {category.items.map((item) => (
                      <li 
                        key={item} 
                        className="text-gray-600 text-sm leading-relaxed pl-3 border-l-2 border-violet-200"
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
      <section 
        id="about" 
        ref={aboutSection.ref} 
        className="section-padding relative z-10"
        aria-labelledby="about-heading"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 sm:gap-16 lg:gap-20 items-center">
            <div>
              <span 
                className={`section-label transition-all duration-700 ${aboutSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              >
                about us
              </span>
              <h2 
                id="about-heading"
                className={`font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold uppercase transition-all duration-700 delay-100 ${aboutSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
              >
                what it's like <br className="hidden sm:block" />
                working with us
              </h2>
              
              <div 
                className={`space-y-4 sm:space-y-5 text-sm sm:text-base leading-relaxed mt-6 sm:mt-8 transition-all duration-700 delay-200 ${aboutSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
              >
                <p>
                  neversmall studios is a creative production team based in melbourne. we work with brands in events, food & beverage, music, and lifestyle—people who give a damn about how their story is told.
                </p>
                <p>
                  we're not the cheapest option, and we're not trying to be. our focus is on work that's considered, well-crafted, and effective. every project receives the same level of attention.
                </p>
                <p>
                  if you're looking for a creative partner who takes the work seriously, we should talk.
                </p>
              </div>
              
              <a 
                href="#contact" 
                className={`inline-flex items-center gap-2 mt-8 sm:mt-10 font-medium group min-h-[44px] hover:text-violet-400 transition-all duration-700 delay-300 ${aboutSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              >
                start a conversation
                <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform duration-300" aria-hidden="true" />
              </a>
            </div>
            
            {/* Visual Element */}
            <div 
              className={`relative flex items-center justify-center transition-all duration-1000 delay-300 ${aboutSection.isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
            >
              <div className="relative w-full max-w-sm sm:max-w-md mx-auto">
                {/* Ambient glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-rose-500/10 rounded-3xl blur-3xl scale-110" aria-hidden="true" />
                
                {/* Card */}
                <div className="relative glass rounded-3xl p-8 sm:p-12 text-center">
                  <div className="w-28 h-28 sm:w-32 sm:h-32 mx-auto rounded-full overflow-hidden logo-glow-strong mb-6 animate-glow">
                    <Image 
                      src="/assets/nss-logo.png" 
                      alt=""
                      width={128} 
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="font-display text-xl sm:text-2xl font-semibold tracking-tight">neversmall.</p>
                  <p className="text-gray-500 text-xs sm:text-sm mt-2">melbourne, australia</p>
                  
                  <div className="divider my-6" />
                  
                  <p className="slogan slogan-small">Don't sell yourself short.</p>
                  
                  <div className="mt-6 flex items-center justify-center gap-4">
                    <a 
                      href="https://instagram.com/neversmall.studios" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-violet-500/20 hover:scale-110 transition-all duration-300"
                      aria-label="Follow us on Instagram"
                    >
                      <Instagram size={16} aria-hidden="true" />
                    </a>
                    <a 
                      href="mailto:hello@neversmall.com.au"
                      className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-violet-500/20 hover:scale-110 transition-all duration-300"
                      aria-label="Email us"
                    >
                      <Mail size={16} aria-hidden="true" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section 
        id="contact" 
        ref={contactSection.ref} 
        className="section-padding section-light relative z-10 overflow-hidden"
        aria-labelledby="contact-heading"
      >
        {/* Gradient accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-b from-violet-500/10 to-transparent rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
        
        <div className="max-w-3xl mx-auto text-center px-4 sm:px-6 relative z-10">
          <span 
            className={`section-label justify-center transition-all duration-700 ${contactSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          >
            get in touch
          </span>
          <h2 
            id="contact-heading"
            className={`font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold uppercase transition-all duration-700 delay-100 ${contactSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
          >
            let's make <br />
            something.
          </h2>
          <p 
            className={`text-base sm:text-lg mt-4 sm:mt-6 mb-8 sm:mb-12 max-w-xl mx-auto leading-relaxed transition-all duration-700 delay-200 ${contactSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
          >
            we'd like to hear about it. reach out and let's discuss how we can help bring your vision to life.
          </p>
          
          <a 
            href="mailto:hello@neversmall.com.au" 
            className={`inline-flex items-center gap-3 sm:gap-4 text-lg sm:text-xl md:text-2xl lg:text-3xl font-display font-semibold text-gray-900 hover:text-violet-600 transition-all duration-500 group ${contactSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            style={{ transitionDelay: '300ms' }}
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-violet-500 to-rose-500 flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-lg shadow-violet-500/30 flex-shrink-0">
              <Mail size={20} className="text-white" aria-hidden="true" />
            </div>
            <span className="break-all sm:break-normal">hello@neversmall.com.au</span>
          </a>
          
          <div className="divider my-10 sm:my-14" />
          
          <a 
            href="https://instagram.com/neversmall.studios" 
            target="_blank" 
            rel="noopener noreferrer" 
            className={`inline-flex items-center gap-2 text-gray-600 hover:text-violet-600 transition-all duration-300 text-sm font-medium min-h-[44px] px-4 ${contactSection.isVisible ? 'opacity-100' : 'opacity-0'}`}
            style={{ transitionDelay: '400ms' }}
          >
            <Instagram size={16} aria-hidden="true" /> @neversmall.studios
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 sm:py-10 px-4 sm:px-6 border-t border-white/5 relative z-10" role="contentinfo">
        <div className="max-w-6xl mx-auto flex flex-col items-center gap-6 sm:gap-8 md:flex-row md:justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0">
              <Image 
                src="/assets/nss-logo.png" 
                alt=""
                width={36} 
                height={36}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-sm text-gray-500 font-medium">neversmall.</span>
          </div>
          
          <nav className="flex items-center gap-6 sm:gap-8 text-sm text-gray-600" aria-label="Footer navigation">
            <a 
              href="https://instagram.com/neversmall.studios" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-violet-400 transition-colors min-h-[44px] flex items-center"
            >
              instagram
            </a>
            <a 
              href="mailto:hello@neversmall.com.au"
              className="hover:text-violet-400 transition-colors min-h-[44px] flex items-center"
            >
              email
            </a>
          </nav>
          
          <p className="text-gray-600 text-xs sm:text-sm text-center md:text-right">
            © {new Date().getFullYear()} neversmall studios. melbourne.
          </p>
        </div>
      </footer>
    </main>
  )
}
