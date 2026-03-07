import { useEffect, useRef, useState } from 'react'

type NavLink = { label: string; href: string }

export default function Navbar(): JSX.Element {
  const [open, setOpen] = useState(false)
  const [isAtTop, setIsAtTop] = useState(true)
  const lastScrollY = useRef(0)
  const menuRef = useRef<HTMLDivElement | null>(null)

  const links: NavLink[] = [
    { label: 'LIVE', href: '#live' },
    { label: 'SHOWS', href: '#shows' },
    { label: 'PRODUCER', href: '#producer' },
    { label: 'BOOKING', href: '#booking' },
  ]

  const mid = Math.ceil(links.length / 2)
  const leftLinks = links.slice(0, mid)
  const rightLinks = links.slice(mid)

  useEffect(() => {
    // Prevent background scroll when menu open
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    function handleOutside(e: MouseEvent | TouchEvent) {
      const target = e.target as Node
      if (open && menuRef.current && !menuRef.current.contains(target)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleOutside)
    document.addEventListener('touchstart', handleOutside)
    return () => {
      document.removeEventListener('mousedown', handleOutside)
      document.removeEventListener('touchstart', handleOutside)
    }
  }, [open])

  useEffect(() => {
    // Keep navbar always visible; only background changes when near top.
    function onScroll() {
      const y = window.scrollY || 0
      setIsAtTop(y <= 10)
      lastScrollY.current = y
    }

    const initialY = window.scrollY || 0
    lastScrollY.current = initialY
    setIsAtTop(initialY <= 10)

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [open])

  function handleLinkClick() {
    setOpen(false)
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ease-out pointer-events-auto backdrop-blur-none border-transparent ${
        isAtTop ? 'bg-gradient-to-b from-black/35 via-black/15 to-transparent' : 'bg-transparent'
      }`}
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      <nav className="relative max-w-6xl mx-auto px-6 sm:px-6 lg:px-8" aria-label="Main navigation">
        <div className="flex items-center justify-center h-16 relative">
          <div className="flex-1 hidden md:flex justify-end gap-8">
            {leftLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={handleLinkClick}
                className="text-sm text-white hover:underline py-3 px-2 cursor-pointer font-head tracking-wide"
              >
                {l.label}
              </a>
            ))}
          </div>

          <div className="flex-none mx-6 flex items-center justify-center flex-shrink-0">
            <a href="/" aria-label="Home" className="flex items-center justify-center flex-shrink-0">
              <img
                src="/assets/ARMAH_logo_transparent_white.png"
                alt="ARMAH"
                className="h-[108px] sm:h-[122px] md:h-[135px] w-auto mx-auto object-contain flex-shrink-0"
              />
            </a>
          </div>

          <div className="flex-1 hidden md:flex justify-start gap-8">
            {rightLinks.map((l) => (
              <a
                key={l.href + '-right'}
                href={l.href}
                onClick={handleLinkClick}
                className="text-sm text-white hover:underline py-3 px-2 cursor-pointer font-head tracking-wide"
              >
                {l.label}
              </a>
            ))}
          </div>

          <div className="md:hidden absolute right-4 top-1/2 -translate-y-1/2">
            <button
              onClick={() => setOpen((s) => !s)}
              aria-label="Toggle menu"
              aria-expanded={open}
              className="text-white focus:outline-none bg-transparent p-2 rounded"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {open ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile panel */}
      {open && (
        <div ref={menuRef} className="md:hidden bg-black/80 border-t border-white/10 backdrop-blur-sm">
          <div className="px-4 pt-2 pb-4 space-y-2">
            {links.map((l) => (
              <a
                key={l.href + '-mobile'}
                href={l.href}
                onClick={handleLinkClick}
                className="block text-white text-base font-head tracking-wide"
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
