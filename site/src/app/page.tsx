'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { ArrowRight, Mail, ArrowUpRight, Play, Camera, Film, Share2, Target, Menu, X, Instagram, Sun, Moon, ChevronDown, Calendar } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

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
      'creative direction & production',
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
    description: 'club nights and festivals across melbourne. energy captured, amplified for socials.',
  },
  {
    title: 'intelliprop',
    category: 'brand content',
    year: '2024',
    gradient: 'from-slate-800/60 to-slate-600/30',
    image: '/assets/intelliprop.png',
    description: 'interview series for property professionals. story-led content that builds trust.',
  },
  {
    title: 'pretty privilege club',
    category: 'lifestyle',
    year: '2024',
    gradient: 'from-rose-900/60 to-rose-700/30',
    image: '/assets/pretty_privilege.png',
    description: 'rooftop events, golden hour moments. content that matches the vibe.',
  },
  {
    title: 'golden wok',
    category: 'food & beverage',
    year: '2023',
    gradient: 'from-amber-900/60 to-amber-700/30',
    image: '/assets/golden_wok.png',
    description: 'food photography and styling. making dumplings look as good as they taste.',
  },
  {
    title: 'naught gin',
    category: 'brand content',
    year: '2024',
    gradient: 'from-teal-900/60 to-teal-700/30',
    image: '/assets/naught_gin.png',
    description: 'bar culture, real people. brand storytelling that feels genuine.',
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
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return scrolled
}

function useTheme() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')

  useEffect(() => {
    const saved = localStorage.getItem('theme') as 'dark' | 'light' | null
    const initialTheme = saved || 'dark'
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
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false)
  const scrolled = useScrollPosition()
  const { theme, toggleTheme } = useTheme()
  
  const heroSection = useIntersectionObserver()
  const workSection = useIntersectionObserver()
  const servicesSection = useIntersectionObserver()
  const aboutSection = useIntersectionObserver()
  const contactSection = useIntersectionObserver()

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

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

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false)
        setServicesDropdownOpen(false)
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [])

  const closeMobileMenu = useCallback(() => setMobileMenuOpen(false), [])

  return (
    <main className="min-h-screen overflow-x-hidden">
      {/* Animated Gradient Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
        <div className="gradient-orb gradient-orb-1" />
        <div className="gradient-orb gradient-orb-2" />
        <div className="gradient-orb gradient-orb-3" />
      </div>

      {/* Skip Link */}
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
          <Link 
            href="/" 
            className="flex items-center gap-2 sm:gap-3 group"
            aria-label="neversmall studios"
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
          </Link>
          
          {/* Desktop Navigation */}
          <div 
            className={`hidden md:flex items-center gap-8 lg:gap-10 transition-all duration-700 delay-150 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          >
            <a href="#work" className="nav-link">work</a>
            
            {/* Services Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setServicesDropdownOpen(!servicesDropdownOpen)}
                className="nav-link flex items-center gap-1"
                aria-expanded={servicesDropdownOpen}
                aria-haspopup="true"
              >
                menu
                <ChevronDown size={14} className={`transition-transform duration-200 ${servicesDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {servicesDropdownOpen && (
                <div 
                  className="absolute top-full left-0 mt-2 w-56 glass rounded-xl p-2 shadow-xl"
                  onMouseLeave={() => setServicesDropdownOpen(false)}
                >
                  <Link 
                    href="/menu" 
                    className="block px-4 py-3 text-sm hover:bg-white/10 rounded-lg transition-colors"
                    onClick={() => setServicesDropdownOpen(false)}
                  >
                    view full menu
                  </Link>
                  <div className="border-t border-white/10 my-1" />
                  {serviceCategories.map((cat) => (
                    <a 
                      key={cat.title}
                      href={`#services`} 
                      className="block px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                      onClick={() => setServicesDropdownOpen(false)}
                    >
                      {cat.title}
                    </a>
                  ))}
                </div>
              )}
            </div>
            
            <a href="#about" className="nav-link">about</a>
            <a href="#contact" className="nav-link">contact</a>
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
            <a 
              href="https://instagram.com/neversmall.studios" 
              target="_blank" 
              rel="noopener noreferrer"
              className="nav-link"
              aria-label="Instagram"
            >
              <Instagram size={18} aria-hidden="true" />
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
              {mobileMenuOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
            </button>
          </div>
        </div>

      </nav>

      {/* Mobile Menu - Outside nav for proper stacking */}
      <div 
        id="mobile-menu"
        className="mobile-menu md:hidden"
        aria-hidden={!mobileMenuOpen}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <div className="flex flex-col items-center justify-center flex-1 gap-8 px-6">
          <a 
            href="#work" 
            onClick={closeMobileMenu}
            className="text-2xl font-display font-semibold hover:text-violet-400 transition-colors"
            tabIndex={mobileMenuOpen ? 0 : -1}
          >
            work
          </a>
          <Link 
            href="/menu" 
            onClick={closeMobileMenu}
            className="text-2xl font-display font-semibold hover:text-violet-400 transition-colors"
            tabIndex={mobileMenuOpen ? 0 : -1}
          >
            menu
          </Link>
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
            className="text-2xl font-display font-semibold hover:text-violet-400 transition-colors"
            tabIndex={mobileMenuOpen ? 0 : -1}
          >
            contact
          </a>
        </div>
        <div className="pb-8 text-center">
          <p className="slogan slogan-medium mb-4">Don't sell yourself short.</p>
          <a 
            href="https://instagram.com/neversmall.studios" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-violet-400 transition-colors text-sm inline-flex items-center justify-center gap-2"
            tabIndex={mobileMenuOpen ? 0 : -1}
          >
            <Instagram size={16} aria-hidden="true" /> @neversmall.studios
          </a>
        </div>
      </div>

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
              melbourne creative studio
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
              className={`transition-all duration-700 ${heroSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
              style={{ transitionDelay: '900ms' }}
            >
              <a href="#work" className="btn-primary">
                see the work
                <ArrowRight size={16} aria-hidden="true" />
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
              recent projects
            </span>
            <h2 
              id="work-heading"
              className={`font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold uppercase transition-all duration-700 delay-100 ${workSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
            >
              the work
            </h2>
            <p 
              className={`text-base sm:text-lg mt-4 sm:mt-5 leading-relaxed transition-all duration-700 delay-200 ${workSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
            >
              A few things we've made recently. Each one different, each one made to fit.
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
                  <Image
                    src={item.image}
                    alt={`${item.title} - ${item.category}`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                  <div className="card-glow" />
                  
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500">
                      <Play size={20} className="ml-1 text-white" aria-hidden="true" />
                    </div>
                  </div>
                  
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
              services
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
              Video, photo, socials, ads. We handle it all so you don't have to juggle five different freelancers.
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
          
          <div className={`text-center mt-12 transition-all duration-700 delay-700 ${servicesSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <Link href="/menu" className="btn-secondary inline-flex items-center gap-2 text-gray-900 border-gray-300 hover:border-violet-500">
              view full menu
              <ArrowRight size={16} />
            </Link>
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
                about
              </span>
              <h2 
                id="about-heading"
                className={`font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold uppercase transition-all duration-700 delay-100 ${aboutSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
              >
                who we are
              </h2>
              
              <div 
                className={`space-y-4 sm:space-y-5 text-sm sm:text-base leading-relaxed mt-6 sm:mt-8 transition-all duration-700 delay-200 ${aboutSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
              >
                <p>
                  We're a small team in Melbourne making content for events, hospitality, and lifestyle brands. Mostly video and photo, but we do socials and ads too.
                </p>
                <p>
                  We work with people who care about how their brand looks and sounds. The kind who notice when something's off. If that's you, we'll probably get along.
                </p>
                <p>
                  We're selective about who we work with because we want to do good work, not just more work. If the fit's right, we go all in.
                </p>
              </div>
              
              <a 
                href="#contact" 
                className={`inline-flex items-center gap-2 mt-8 sm:mt-10 font-medium group min-h-[44px] hover:text-violet-400 transition-all duration-700 delay-300 ${aboutSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              >
                get in touch
                <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform duration-300" aria-hidden="true" />
              </a>
            </div>
            
            {/* Visual Element */}
            <div 
              className={`relative flex items-center justify-center transition-all duration-1000 delay-300 ${aboutSection.isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
            >
              <div className="relative w-full max-w-sm sm:max-w-md mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-rose-500/10 rounded-3xl blur-3xl scale-110" aria-hidden="true" />
                
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
                  
                  <div className="mt-6 flex items-center justify-center gap-3">
                    <a 
                      href="https://calendar.app.google/cvpH89EUwaVGJiWP6" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-rose-500 flex items-center justify-center hover:scale-110 transition-all duration-300 shadow-lg shadow-violet-500/20"
                      aria-label="Book a call"
                    >
                      <Calendar size={16} className="text-white" aria-hidden="true" />
                    </a>
                    <a 
                      href="https://instagram.com/neversmall.studios" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-violet-500/20 hover:scale-110 transition-all duration-300"
                      aria-label="Instagram"
                    >
                      <Instagram size={16} aria-hidden="true" />
                    </a>
                    <a 
                      href="mailto:hello@neversmall.com.au"
                      className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-violet-500/20 hover:scale-110 transition-all duration-300"
                      aria-label="Email"
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

      {/* Contact Section */}
      <section 
        id="contact" 
        ref={contactSection.ref} 
        className="section-padding section-light relative z-10 overflow-hidden"
        aria-labelledby="contact-heading"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-b from-violet-500/10 to-transparent rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-12 sm:mb-16">
            <span 
              className={`section-label justify-center transition-all duration-700 ${contactSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            >
              contact
            </span>
            <h2 
              id="contact-heading"
              className={`font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold uppercase transition-all duration-700 delay-100 ${contactSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
            >
              let's talk
            </h2>
            <p 
              className={`text-base sm:text-lg mt-4 sm:mt-6 max-w-xl mx-auto leading-relaxed transition-all duration-700 delay-200 ${contactSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
            >
              Got a project in mind? Book a call or drop us a line.
            </p>
          </div>
          
          {/* Contact Cards */}
          <div className="grid sm:grid-cols-3 gap-4 sm:gap-6 mb-12">
            {/* Book a Call - Primary CTA */}
            <a 
              href="https://calendar.app.google/cvpH89EUwaVGJiWP6"
              target="_blank"
              rel="noopener noreferrer"
              className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600 to-rose-500 p-6 sm:p-8 text-center transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-violet-500/30 ${contactSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: '300ms' }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Calendar size={24} className="text-white" aria-hidden="true" />
                </div>
                <h3 className="font-display text-lg sm:text-xl font-bold text-white mb-2">
                  Book a Call
                </h3>
                <p className="text-white/80 text-sm">
                  15 min intro chat
                </p>
                <div className="mt-4 inline-flex items-center gap-2 text-white/90 text-sm font-medium">
                  Schedule now
                  <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" aria-hidden="true" />
                </div>
              </div>
            </a>
            
            {/* Email */}
            <a 
              href="mailto:hello@neversmall.com.au"
              className={`group relative overflow-hidden rounded-2xl bg-white border border-gray-200 p-6 sm:p-8 text-center transition-all duration-500 hover:scale-[1.02] hover:shadow-xl hover:border-violet-200 ${contactSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: '400ms' }}
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-full bg-gradient-to-br from-violet-100 to-rose-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Mail size={24} className="text-violet-600" aria-hidden="true" />
              </div>
              <h3 className="font-display text-lg sm:text-xl font-bold text-gray-900 mb-2">
                Email Us
              </h3>
              <p className="text-gray-500 text-sm break-all">
                hello@neversmall.com.au
              </p>
              <div className="mt-4 inline-flex items-center gap-2 text-violet-600 text-sm font-medium">
                Send email
                <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" aria-hidden="true" />
              </div>
            </a>
            
            {/* Instagram */}
            <a 
              href="https://instagram.com/neversmall.studios"
              target="_blank"
              rel="noopener noreferrer"
              className={`group relative overflow-hidden rounded-2xl bg-white border border-gray-200 p-6 sm:p-8 text-center transition-all duration-500 hover:scale-[1.02] hover:shadow-xl hover:border-violet-200 ${contactSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: '500ms' }}
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-full bg-gradient-to-br from-violet-100 to-rose-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Instagram size={24} className="text-violet-600" aria-hidden="true" />
              </div>
              <h3 className="font-display text-lg sm:text-xl font-bold text-gray-900 mb-2">
                Instagram
              </h3>
              <p className="text-gray-500 text-sm">
                @neversmall.studios
              </p>
              <div className="mt-4 inline-flex items-center gap-2 text-violet-600 text-sm font-medium">
                View profile
                <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" aria-hidden="true" />
              </div>
            </a>
          </div>
          
          {/* Slogan */}
          <p 
            className={`text-center slogan slogan-medium slogan-dark transition-all duration-700 ${contactSection.isVisible ? 'opacity-100' : 'opacity-0'}`}
            style={{ transitionDelay: '600ms' }}
          >
            Don't sell yourself short.
          </p>
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
          
          <nav className="flex items-center gap-6 sm:gap-8 text-sm text-gray-600" aria-label="Footer">
            <a href="#work" className="hover:text-violet-400 transition-colors min-h-[44px] flex items-center">work</a>
            <Link href="/menu" className="hover:text-violet-400 transition-colors min-h-[44px] flex items-center">menu</Link>
            <a href="#about" className="hover:text-violet-400 transition-colors min-h-[44px] flex items-center">about</a>
            <a href="#contact" className="hover:text-violet-400 transition-colors min-h-[44px] flex items-center">contact</a>
          </nav>
          
          <p className="text-gray-600 text-xs sm:text-sm text-center md:text-right">
            © {new Date().getFullYear()} neversmall studios
          </p>
        </div>
      </footer>
    </main>
  )
}
