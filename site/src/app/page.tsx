'use client'

import { useState, useEffect, useRef } from 'react'
import { ArrowRight, Mail, ArrowUpRight, Play, Camera, Film, Share2, Target, Menu, X, Instagram } from 'lucide-react'
import Image from 'next/image'

/* ========================================
   DATA - Real clients from Instagram
   ======================================== */
const workItems = [
  {
    title: 'tang events',
    category: 'Event Coverage',
    description: 'melbourne club nights and festivals. big moments captured and amplified for socials.',
    vibe: 'dark',
    accent: 'bg-gradient-to-br from-emerald-900/30 via-gray-900 to-gray-950',
  },
  {
    title: 'pretty privilege club',
    category: 'Content Creation',
    description: 'rooftop vibes and golden hour. immersive lifestyle content.',
    vibe: 'light',
    accent: 'bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50',
  },
  {
    title: 'golden wok',
    category: 'Food & Beverage',
    description: 'making food look as good as it tastes. product and lifestyle photography.',
    vibe: 'dark',
    accent: 'bg-gradient-to-br from-amber-900/30 via-gray-900 to-gray-950',
  },
  {
    title: 'naught gin',
    category: 'Brand Content',
    description: 'premium spirits deserve premium content. moody, elevated, intentional.',
    vibe: 'dark',
    accent: 'bg-gradient-to-br from-red-900/20 via-gray-900 to-gray-950',
  },
  {
    title: 'mix & matcha',
    category: 'Social Content',
    description: 'cafe culture meets content strategy. fresh, vibrant, scroll-stopping.',
    vibe: 'light',
    accent: 'bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50',
  },
  {
    title: 'australian fashion week',
    category: 'Event Coverage',
    description: 'runway moments and backstage access. fashion at its finest.',
    vibe: 'dark',
    accent: 'bg-gradient-to-br from-purple-900/20 via-gray-900 to-gray-950',
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <a href="#" className="flex items-center gap-3 group">
            <div className={`w-10 h-10 sm:w-11 sm:h-11 transition-all duration-700 ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
              <Image 
                src="/assets/NSS Logo.jpg" 
                alt="neversmall studios" 
                width={44} 
                height={44}
                className="w-full h-full object-cover rounded-full"
                priority
              />
            </div>
            <span className={`text-white font-semibold text-lg tracking-tight transition-all duration-700 delay-75 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
              neversmall.
            </span>
          </a>
          
          <div className={`hidden md:flex items-center gap-8 lg:gap-10 transition-all duration-700 delay-150 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
            <a href="#work" className="nav-link">Work</a>
            <a href="#services" className="nav-link">Services</a>
            <a href="#about" className="nav-link">About</a>
            <a href="https://instagram.com/neversmall.studios" target="_blank" rel="noopener noreferrer" className="nav-link">
              <Instagram size={18} />
            </a>
          </div>
          
          <div className={`hidden md:block transition-all duration-700 delay-225 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
            <a href="#contact" className="btn-primary text-sm py-2.5 px-6">Let's Talk</a>
          </div>

          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`md:hidden w-11 h-11 flex items-center justify-center rounded-full transition-all duration-300 ${mobileMenuOpen ? 'bg-white/10' : ''}`}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? <X size={22} className="text-white" /> : <Menu size={22} className="text-white" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden fixed inset-0 top-[68px] bg-[#050505]/98 backdrop-blur-xl transition-all duration-500 ${mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
          <div className="flex flex-col items-center justify-center h-full gap-8 px-6">
            <a href="#work" onClick={closeMobileMenu} className="text-3xl font-display font-bold text-white lowercase">work</a>
            <a href="#services" onClick={closeMobileMenu} className="text-3xl font-display font-bold text-white lowercase">services</a>
            <a href="#about" onClick={closeMobileMenu} className="text-3xl font-display font-bold text-white lowercase">about</a>
            <a href="https://instagram.com/neversmall.studios" target="_blank" rel="noopener noreferrer" onClick={closeMobileMenu} className="text-3xl font-display font-bold text-white lowercase flex items-center gap-3">
              <Instagram size={28} /> instagram
            </a>
            <a href="#contact" onClick={closeMobileMenu} className="btn-primary mt-6 text-lg px-8 py-4">Let's Talk</a>
            <p className="slogan text-lg text-center mt-8 opacity-60">don't sell yourself short.</p>
          </div>
        </div>
      </nav>

      {/* Hero Section - Editorial Impact */}
      <section id="main-content" className="relative min-h-screen flex items-center px-4 sm:px-6 lg:px-8 bg-[#050505] overflow-hidden">
        <div className="hero-gradient" />
        
        {/* Decorative elements */}
        <div className="absolute top-20 right-10 w-32 h-32 rounded-full bg-gradient-to-br from-amber-500/10 to-transparent blur-3xl" />
        <div className="absolute bottom-40 left-10 w-48 h-48 rounded-full bg-gradient-to-br from-emerald-500/10 to-transparent blur-3xl" />
        
        <div className="max-w-7xl mx-auto w-full relative z-10 pt-24 sm:pt-32 pb-20">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left - Text */}
            <div>
              <div className={`flex items-center gap-4 mb-8 transition-all duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden logo-glow">
                  <Image src="/assets/NSS Logo.jpg" alt="neversmall studios" width={64} height={64} className="w-full h-full object-cover" priority />
                </div>
                <div>
                  <p className="text-white font-semibold text-lg">neversmall studios</p>
                  <p className="text-gray-500 text-sm">creative agency • melbourne</p>
                </div>
              </div>
              
              <h1 className={`font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.9] transition-all duration-700 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <span className="text-white">CONTENT</span><br />
                <span className="text-white">PRODUCTION</span><br />
                <span className="text-gradient-warm">&amp; STRATEGY</span>
              </h1>
              
              <p className={`slogan slogan-large mt-8 transition-all duration-700 delay-400 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
                don't sell yourself short.
              </p>
              
              <p className={`text-gray-400 text-lg max-w-md mt-6 leading-relaxed transition-all duration-700 delay-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
                full-service creative for melbourne brands who actually care about quality. every client is different—so is every project.
              </p>
              
              <div className={`flex flex-wrap gap-4 mt-10 transition-all duration-700 delay-600 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
                <a href="#work" className="btn-primary">
                  See Our Work
                  <ArrowRight size={18} />
                </a>
                <a href="#contact" className="btn-secondary">
                  Start a Project
                </a>
              </div>
            </div>
            
            {/* Right - Visual Grid (Instagram-style) */}
            <div className={`hidden lg:grid grid-cols-2 gap-3 transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
              <div className="space-y-3">
                <div className="aspect-[4/5] rounded-2xl bg-gradient-to-br from-emerald-900/40 to-gray-900 flex items-end p-4">
                  <span className="font-display text-2xl font-bold text-white lowercase">tang events</span>
                </div>
                <div className="aspect-square rounded-2xl bg-gradient-to-br from-amber-100 to-orange-50 flex items-end p-4">
                  <span className="font-display text-xl font-bold text-gray-900 lowercase">pretty privilege</span>
                </div>
              </div>
              <div className="space-y-3 pt-8">
                <div className="aspect-square rounded-2xl bg-gradient-to-br from-amber-900/40 to-gray-900 flex items-end p-4">
                  <span className="font-display text-xl font-bold text-white uppercase">GOLDEN WOK</span>
                </div>
                <div className="aspect-[4/5] rounded-2xl bg-gradient-to-br from-red-900/30 to-gray-900 flex items-end p-4">
                  <span className="font-display text-2xl font-bold text-white lowercase">naught gin</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 scroll-indicator transition-all duration-700 delay-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          <span className="text-[10px] text-gray-600 tracking-[0.3em] uppercase">Scroll</span>
          <div className="scroll-indicator-line" />
        </div>
      </section>

      {/* Work Section - Gallery Grid */}
      <section id="work" ref={workSection.ref} className="section-padding bg-[#050505]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 sm:mb-16">
            <div>
              <h2 className={`font-display text-5xl sm:text-6xl md:text-7xl font-bold text-white uppercase tracking-tight transition-all duration-700 ${workSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                CLIENT WINS
              </h2>
              <p className={`text-gray-400 text-lg mt-4 max-w-xl transition-all duration-700 delay-100 ${workSection.isVisible ? 'opacity-100' : 'opacity-0'}`}>
                every brand has a story. we don't do cookie-cutter—each client gets something that actually fits them.
              </p>
            </div>
            <a 
              href="https://instagram.com/neversmall.studios" 
              target="_blank" 
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 text-gray-400 hover:text-white transition-all group text-sm font-medium ${workSection.isVisible ? 'opacity-100' : 'opacity-0'}`}
            >
              <Instagram size={18} />
              <span>@neversmall.studios</span>
              <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>
          
          {/* Work Grid - Varied Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {workItems.map((item, index) => (
              <div 
                key={index}
                className={`group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-700 ${
                  index === 0 || index === 5 ? 'sm:col-span-2 lg:col-span-1 aspect-[16/10] sm:aspect-[2/1] lg:aspect-[16/10]' : 'aspect-[4/5]'
                } ${item.accent} ${workSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: `${200 + index * 100}ms` }}
              >
                {/* Play icon for videos */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                    item.vibe === 'light' ? 'bg-black/10' : 'bg-white/10'
                  }`}>
                    <Play size={24} className={`ml-1 ${item.vibe === 'light' ? 'text-black/70' : 'text-white/70'}`} />
                  </div>
                </div>
                
                {/* Content */}
                <div className="absolute inset-0 p-5 sm:p-6 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <span className={`text-xs font-medium tracking-wider uppercase ${
                      item.vibe === 'light' ? 'text-black/50' : 'text-white/50'
                    }`}>
                      {item.category}
                    </span>
                    <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                      <ArrowUpRight size={18} className={item.vibe === 'light' ? 'text-black/50' : 'text-white/50'} />
                    </div>
                  </div>
                  
                  <div>
                    <h3 className={`font-display text-2xl sm:text-3xl font-bold lowercase tracking-tight ${
                      item.vibe === 'light' ? 'text-black' : 'text-white'
                    }`}>
                      {item.title}
                    </h3>
                    <p className={`text-sm mt-2 max-w-xs leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                      item.vibe === 'light' ? 'text-black/60' : 'text-white/60'
                    }`}>
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Hover overlay */}
                <div className={`absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100 ${
                  item.vibe === 'light' ? 'bg-black/5' : 'bg-white/5'
                }`} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section - Menu Style on Light */}
      <section id="services" ref={servicesSection.ref} className="section-padding section-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16 sm:mb-20">
            <h2 className={`font-display text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight transition-all duration-700 ${servicesSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              MENU
            </h2>
            <p className={`slogan slogan-dark slogan-large mt-6 transition-all duration-700 delay-100 ${servicesSection.isVisible ? 'opacity-100' : 'opacity-0'}`}>
              don't sell yourself short.
            </p>
            <p className={`text-gray-600 text-lg max-w-2xl mx-auto mt-4 leading-relaxed transition-all duration-700 delay-200 ${servicesSection.isVisible ? 'opacity-100' : 'opacity-0'}`}>
              we're a team of creatives, storytellers, and marketers delivering full-service support: content, production, and strategy. all in one place.
            </p>
          </div>
          
          {/* Services Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {serviceCategories.map((category, index) => {
              const Icon = category.icon
              return (
                <div 
                  key={index} 
                  className={`transition-all duration-700 ${servicesSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                  style={{ transitionDelay: `${300 + index * 100}ms` }}
                >
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-xl bg-black/5 flex items-center justify-center">
                      <Icon size={18} className="text-gray-700" strokeWidth={1.5} />
                    </div>
                    <h3 className="font-display text-sm font-bold tracking-wider uppercase text-black">
                      {category.title}
                    </h3>
                  </div>
                  <ul className="space-y-3">
                    {category.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="text-gray-600 text-sm leading-relaxed">
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <h2 className={`font-display text-5xl sm:text-6xl md:text-7xl font-bold text-white uppercase tracking-tight transition-all duration-700 ${aboutSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                WHAT IT'S LIKE<br />
                <span className="text-gradient-warm">WORKING WITH US</span>
              </h2>
              
              <div className={`space-y-5 text-gray-400 text-base sm:text-lg leading-relaxed mt-8 transition-all duration-700 delay-200 ${aboutSection.isVisible ? 'opacity-100' : 'opacity-0'}`}>
                <p>
                  we're a small creative team in melbourne. we work with brands in events, food & beverage, music, and lifestyle—people who give a damn about how their story is told.
                </p>
                <p>
                  we're not the cheapest. we're also not trying to be. what we are is obsessive about quality, honest about what works, and genuinely invested in making you look good.
                </p>
                <p>
                  every project is different because every client is different. that's the point.
                </p>
              </div>
              
              <a 
                href="#contact" 
                className={`inline-flex items-center gap-2 mt-10 text-white font-medium group transition-all duration-700 delay-300 ${aboutSection.isVisible ? 'opacity-100' : 'opacity-0'}`}
              >
                let's chat about your project
                <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform duration-300" />
              </a>
            </div>
            
            {/* Visual */}
            <div className={`relative transition-all duration-1000 delay-300 ${aboutSection.isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
              <div className="relative bg-gradient-to-br from-gray-900 to-gray-950 rounded-3xl p-8 sm:p-12 text-center border border-gray-800/50">
                <div className="w-28 h-28 sm:w-36 sm:h-36 mx-auto rounded-full overflow-hidden logo-glow-strong mb-8 animate-float">
                  <Image src="/assets/NSS Logo.jpg" alt="neversmall studios" width={144} height={144} className="w-full h-full object-cover" />
                </div>
                <p className="font-display text-2xl sm:text-3xl font-bold text-white">neversmall.</p>
                <p className="text-gray-500 text-sm mt-2">creative agency • melbourne</p>
                <p className="slogan slogan-medium mt-6">don't sell yourself short.</p>
                
                <div className="flex justify-center gap-4 mt-8">
                  <a 
                    href="https://instagram.com/neversmall.studios" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                  >
                    <Instagram size={20} className="text-white" />
                  </a>
                  <a 
                    href="mailto:hello@neversmall.com.au"
                    className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                  >
                    <Mail size={20} className="text-white" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" ref={contactSection.ref} className="section-padding section-light relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className={`font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold uppercase tracking-tight transition-all duration-700 ${contactSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            LET'S MAKE<br />
            <span className="text-gray-400">SOMETHING</span>
          </h2>
          
          <p className={`slogan slogan-dark slogan-large mt-8 transition-all duration-700 delay-100 ${contactSection.isVisible ? 'opacity-100' : 'opacity-0'}`}>
            don't sell yourself short.
          </p>
          
          <p className={`text-gray-600 text-lg mt-6 mb-12 max-w-xl mx-auto leading-relaxed transition-all duration-700 delay-200 ${contactSection.isVisible ? 'opacity-100' : 'opacity-0'}`}>
            got something in mind? we'd love to hear about it. no pressure, no hard sell—just a conversation about how we might help.
          </p>
          
          <a 
            href="mailto:hello@neversmall.com.au" 
            className={`inline-flex items-center gap-4 text-2xl sm:text-3xl md:text-4xl font-display font-bold text-black hover:text-gray-600 transition-colors group ${contactSection.isVisible ? 'opacity-100' : 'opacity-0'}`}
            style={{ transitionDelay: '300ms' }}
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-black flex items-center justify-center group-hover:scale-110 transition-transform">
              <Mail size={24} className="text-white" />
            </div>
            <span className="break-all sm:break-normal">hello@neversmall.com.au</span>
          </a>
          
          <div className="flex justify-center gap-6 mt-12">
            <a 
              href="https://instagram.com/neversmall.studios" 
              target="_blank" 
              rel="noopener noreferrer" 
              className={`inline-flex items-center gap-2 text-gray-500 hover:text-black transition-colors text-sm font-medium ${contactSection.isVisible ? 'opacity-100' : 'opacity-0'}`}
              style={{ transitionDelay: '400ms' }}
            >
              <Instagram size={18} />
              @neversmall.studios
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 sm:py-12 px-4 sm:px-6 lg:px-8 bg-[#050505] border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full overflow-hidden">
                <Image src="/assets/NSS Logo.jpg" alt="neversmall studios" width={40} height={40} className="w-full h-full object-cover" />
              </div>
              <div>
                <span className="text-white font-semibold">neversmall.</span>
                <p className="text-gray-600 text-xs">creative agency • melbourne</p>
              </div>
            </div>
            
            <p className="slogan slogan-small opacity-50">don't sell yourself short.</p>
            
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <a href="https://instagram.com/neversmall.studios" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-2">
                <Instagram size={16} /> Instagram
              </a>
              <a href="mailto:hello@neversmall.com.au" className="hover:text-white transition-colors">
                Email
              </a>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-gray-600 text-xs">
              © {new Date().getFullYear()} neversmall studios. melbourne, australia.
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}
