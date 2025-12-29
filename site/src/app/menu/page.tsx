'use client'

import { useState, useEffect, useCallback } from 'react'
import { ArrowLeft, Camera, Film, Share2, Target, Menu, X, Instagram, Sun, Moon, Mail } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

/* ========================================
   DATA
   ======================================== */
const services = [
  {
    title: 'videography',
    icon: Film,
    description: 'From event recaps to brand campaigns. We shoot, edit, and deliver content ready to post.',
    items: [
      { name: 'event coverage', detail: 'recaps, behind the scenes, highlights' },
      { name: 'brand campaigns', detail: 'hero videos, launch content, brand films' },
      { name: 'short-form content', detail: 'reels, tiktoks, stories' },
      { name: 'interviews', detail: 'testimonials, founder stories, case studies' },
    ],
  },
  {
    title: 'photography',
    icon: Camera,
    description: 'Product shots, lifestyle imagery, event coverage. Whatever you need to look good.',
    items: [
      { name: 'product photography', detail: 'studio and lifestyle shots' },
      { name: 'campaign shoots', detail: 'lifestyle, lookbooks, brand imagery' },
      { name: 'event photography', detail: 'coverage, candids, key moments' },
      { name: 'creative direction', detail: 'concept, styling, production' },
    ],
  },
  {
    title: 'social media',
    icon: Share2,
    description: 'We can run your socials or just support what you're already doing. Flexible.',
    items: [
      { name: 'content calendar', detail: 'planning and scheduling' },
      { name: 'copywriting', detail: 'captions, hooks, CTAs' },
      { name: 'analytics', detail: 'reporting and insights' },
      { name: 'strategy', detail: 'platform approach, content pillars' },
    ],
  },
  {
    title: 'meta ads',
    icon: Target,
    description: 'Paid social that actually converts. Setup, creative, optimisation.',
    items: [
      { name: 'campaign setup', detail: 'strategy, targeting, structure' },
      { name: 'retargeting', detail: 'audience segmentation, lookalikes' },
      { name: 'creative testing', detail: 'a/b testing copy, visuals, formats' },
      { name: 'optimisation', detail: 'performance tracking, iteration' },
    ],
  },
]

/* ========================================
   HOOKS
   ======================================== */
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

function useScrollPosition() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return scrolled
}

/* ========================================
   MAIN COMPONENT
   ======================================== */
export default function MenuPage() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const scrolled = useScrollPosition()
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [mobileMenuOpen])

  const closeMobileMenu = useCallback(() => setMobileMenuOpen(false), [])

  return (
    <main className="min-h-screen overflow-x-hidden">
      {/* Gradient Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
        <div className="gradient-orb gradient-orb-1" />
        <div className="gradient-orb gradient-orb-2" />
        <div className="gradient-orb gradient-orb-3" />
      </div>

      {/* Navigation */}
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'nav-scrolled py-3' : 'py-4 md:py-5'}`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
            <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden logo-glow transition-all duration-700 ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
              <Image src="/assets/nss-logo.png" alt="" width={44} height={44} className="w-full h-full object-cover" priority />
            </div>
            <span className={`hidden sm:block text-[10px] font-semibold tracking-[0.2em] text-gray-500 uppercase transition-all duration-700 delay-75 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
              neversmall.
            </span>
          </Link>
          
          <div className={`hidden md:flex items-center gap-8 lg:gap-10 transition-all duration-700 delay-150 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
            <Link href="/#work" className="nav-link">work</Link>
            <Link href="/menu" className="nav-link text-violet-400">menu</Link>
            <Link href="/#about" className="nav-link">about</Link>
            <Link href="/#contact" className="nav-link">contact</Link>
          </div>
          
          <div className={`hidden md:flex items-center gap-3 transition-all duration-700 delay-225 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
            <button onClick={toggleTheme} className="theme-toggle" aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <a href="https://instagram.com/neversmall.studios" target="_blank" rel="noopener noreferrer" className="nav-link" aria-label="Instagram">
              <Instagram size={18} />
            </a>
          </div>

          <div className="flex md:hidden items-center gap-2">
            <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle theme">
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className={`menu-btn ${mobileMenuOpen ? 'active' : ''}`} aria-label="Menu">
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`mobile-menu md:hidden ${mobileMenuOpen ? '' : ''}`} aria-hidden={!mobileMenuOpen}>
          <div className="flex flex-col items-center justify-center h-full gap-8 px-6">
            <Link href="/#work" onClick={closeMobileMenu} className="text-2xl font-display font-semibold">work</Link>
            <Link href="/menu" onClick={closeMobileMenu} className="text-2xl font-display font-semibold text-violet-400">menu</Link>
            <Link href="/#about" onClick={closeMobileMenu} className="text-2xl font-display font-semibold">about</Link>
            <Link href="/#contact" onClick={closeMobileMenu} className="text-2xl font-display font-semibold">contact</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-16 sm:pt-40 sm:pb-20 px-4 sm:px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <Link href="/" className={`inline-flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-8 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
            <ArrowLeft size={16} />
            back to home
          </Link>
          
          <h1 className={`font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold uppercase tracking-tight transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            menu
          </h1>
          
          <p className={`slogan slogan-large mt-6 max-w-2xl transition-all duration-700 delay-100 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            Don't sell yourself short.
          </p>
          
          <p className={`text-gray-400 text-base sm:text-lg mt-4 max-w-2xl leading-relaxed transition-all duration-700 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            Everything we do, in one place. Pick what you need or get the lot. We're flexible.
          </p>
        </div>
      </section>

      {/* Services */}
      <section className="section-padding relative z-10 pt-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="space-y-16 sm:space-y-24">
            {services.map((service, index) => {
              const Icon = service.icon
              return (
                <div 
                  key={service.title}
                  className={`grid lg:grid-cols-2 gap-8 lg:gap-16 items-start transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                  style={{ transitionDelay: `${300 + index * 150}ms` }}
                >
                  {/* Left: Title & Description */}
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-rose-500/20 flex items-center justify-center">
                        <Icon size={22} className="text-violet-400" strokeWidth={1.5} />
                      </div>
                      <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold uppercase">
                        {service.title}
                      </h2>
                    </div>
                    <p className="text-gray-400 text-base sm:text-lg leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                  
                  {/* Right: Items */}
                  <div className="glass rounded-2xl p-6 sm:p-8">
                    <ul className="space-y-4">
                      {service.items.map((item) => (
                        <li key={item.name} className="flex items-start gap-4">
                          <div className="w-2 h-2 rounded-full bg-violet-500 mt-2 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-white">{item.name}</p>
                            <p className="text-gray-500 text-sm">{item.detail}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding section-light relative z-10">
        <div className="max-w-3xl mx-auto text-center px-4 sm:px-6">
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold uppercase">
            ready to start?
          </h2>
          <p className="text-gray-600 text-base sm:text-lg mt-4 mb-8 max-w-xl mx-auto">
            Tell us what you need. We'll figure out the best way to make it happen.
          </p>
          <a 
            href="mailto:hello@neversmall.com.au" 
            className="inline-flex items-center gap-3 text-xl sm:text-2xl font-display font-semibold text-gray-900 hover:text-violet-600 transition-colors group"
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-rose-500 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-violet-500/30">
              <Mail size={20} className="text-white" />
            </div>
            hello@neversmall.com.au
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 sm:py-10 px-4 sm:px-6 border-t border-white/5 relative z-10">
        <div className="max-w-6xl mx-auto flex flex-col items-center gap-6 sm:gap-8 md:flex-row md:justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full overflow-hidden">
              <Image src="/assets/nss-logo.png" alt="" width={36} height={36} className="w-full h-full object-cover" />
            </div>
            <span className="text-sm text-gray-500 font-medium">neversmall.</span>
          </div>
          
          <nav className="flex items-center gap-6 sm:gap-8 text-sm text-gray-600">
            <Link href="/#work" className="hover:text-violet-400 transition-colors">work</Link>
            <Link href="/menu" className="hover:text-violet-400 transition-colors text-violet-400">menu</Link>
            <Link href="/#about" className="hover:text-violet-400 transition-colors">about</Link>
            <Link href="/#contact" className="hover:text-violet-400 transition-colors">contact</Link>
          </nav>
          
          <p className="text-gray-600 text-xs sm:text-sm">© {new Date().getFullYear()} neversmall studios</p>
        </div>
      </footer>
    </main>
  )
}

