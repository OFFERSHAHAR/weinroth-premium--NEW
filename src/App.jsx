import React, { useEffect, useRef, useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import './App.css'
import content from './content.json'
import ChatWidget from './ChatWidget'
import { LangProvider, useLang, LANGUAGES } from './i18n.jsx'

// Real content pulled from weinrothlaw.com (WP REST API). Hebrew team pages only (drop /en/ duplicates).
export const teamMembers = (() => {
  const list = content.team.filter(m => !m.link.includes('/en/'))
  const i = list.findIndex(m => m.name.includes('יחיאל')) // founder — show first
  if (i > 0) list.unshift(list.splice(i, 1)[0])
  return list
})()

export const allPosts = content.posts
export const blogPosts = content.posts.filter(p => p.image)

export const achievements = [
  { img: '/assets/wl/BDI-2025.png', label: 'BDI 2025' },
  { img: '/assets/wl/DUNS-2025.webp', label: 'DUNS 2025' },
  { img: '/assets/wl/DUNS-2024.png', label: 'DUNS 2024' },
  { img: '/assets/wl/DUNS-2023.png', label: 'DUNS 2023' },
  { img: '/assets/wl/Bdi-001-26_leading-comp-stamp_625x347_P2.png', label: 'BDI Leading 2026' },
  { img: '/assets/wl/Bdi-001-23_leading-comp-stamp_625x347_P-2.jpg', label: 'BDI Leading 2023' },
]

export const practiceAreas = [
  { slug: 'litigation', icon: '⚖️', title: 'ליטיגציה אזרחית ופלילית', desc: 'ייצוג בכל הערכאות השיפוטיות, ליטיגציה מסחרית מורכבת ובוררויות בינלאומיות מול ICC.', img: '/assets/wl/practice-1.jpg' },
  { slug: 'white-collar', icon: '🏛️', title: 'צווארון לבן', desc: 'ייצוג בתיקי ניירות ערך, מרמה, הלבנת הון ועבירות כלכליות מול רשויות האכיפה.', img: '/assets/wl/practice-2.jpg' },
  { slug: 'real-estate', icon: '🏗️', title: 'נדל"ן תכנון ובניה', desc: 'ליווי עסקאות נדל"ן מורכבות, תמ"א 38, פרויקטי תשתית והתחדשות עירונית.', img: '/assets/wl/practice-3.jpg' },
  { slug: 'commercial', icon: '📊', title: 'משפט מסחרי', desc: 'ייעוץ לחברות ישראליות ובינלאומיות בהיבטים מסחריים, רגולציה ומיזוגים.', img: '/assets/wl/practice-4.jpg' },
  { slug: 'banking', icon: '🏦', title: 'בנקאות', desc: 'ייצוג וייעוץ בתחום הבנקאי, אשראי, ניירות ערך ורגולציה פיננסית.', img: '/assets/wl/practice-5.jpg' },
  { slug: 'class-actions', icon: '👥', title: 'תובענות ייצוגיות', desc: 'ניסיון רב בייצוג תובעים ונתבעים בתובענות ייצוגיות ונגזרות מורכבות.', img: '/assets/wl/practice-6.jpg' },
  { slug: 'administrative', icon: '📋', title: 'משפט מנהלי', desc: 'עתירות לבג"ץ, מכרזים ציבוריים, רשויות מקומיות ורגולציה מנהלית.', img: '/assets/wl/practice-7.jpg' },
  { slug: 'family', icon: '👨‍👩‍👧‍👧', title: 'דיני משפחה', desc: 'גירושין, הסכמי ממון, ירושה וצוואות, ייפוי כוח מתמשך ומעמד אישי.', img: '/assets/wl/practice-8.jpg' },
  { slug: 'labor', icon: '📝', title: 'דיני עבודה', desc: 'ייצוג מעסיקים ועובדים, הסכמים קיבוציים, תביעות והליכי פיטורים.', img: '/assets/wl/practice-9.jpg' },
]

const heroPhotos = ['/hero1.png', '/hero2.png', '/hero4.png', '/hero5.png']

const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Re-runs when `key` (route path) changes so each page's elements are re-observed.
function useReveal(key) {
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (prefersReducedMotion) {
      document.querySelectorAll('.reveal, .reveal-up, .reveal-scale, .reveal-blur, .reveal-mask, .reveal-child').forEach(el => el.classList.add('revealed'))
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const el = entry.target
            if (el.classList.contains('reveal-stagger')) {
              el.querySelectorAll('.reveal-child').forEach((child, i) => {
                child.style.transitionDelay = `${i * 80}ms`
                child.classList.add('revealed')
              })
            }
            el.classList.add('revealed')
            observer.unobserve(el)
          }
        })
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    )
    document.querySelectorAll('.reveal, .reveal-up, .reveal-scale, .reveal-blur, .reveal-mask, .reveal-stagger').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [key])
}

function useParallax(key) {
  useEffect(() => {
    if (typeof window === 'undefined' || prefersReducedMotion) return
    const handleScroll = () => {
      document.querySelectorAll('.parallax').forEach(el => {
        const rect = el.getBoundingClientRect()
        const speed = el.dataset.speed || 0.2
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          el.style.transform = `translateY(${rect.top * speed * 0.1}px)`
        }
      })
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [key])
}

function Nav() {
  const [open, setOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const { pathname } = useLocation()
  const { t, lang, setLang, dir } = useLang()
  const close = () => setOpen(false)

  return (
    <nav className="nav">
      <div className="nav__inner">
        <div className="nav__logo">
          <Link to="/" onClick={close} className="nav__logo-link" aria-label={t('nav.about')}>
            <img src="/logo-white.png" alt="Dr. J. Weinroth & Co. Law Office" className="nav__logo-img" />
          </Link>
        </div>
        <div className={`nav__links ${open ? 'nav__links--open' : ''}`}>
          {[['/about', 'nav.about'], ['/practice', 'nav.practice'], ['/team', 'nav.team'], ['/achievements', 'nav.achievements'], ['/articles', 'nav.articles']].map(([to, key]) => (
            <Link key={to} to={to} onClick={close} className={pathname === to || pathname.startsWith(to + '/') ? 'is-active' : undefined}>{t(key)}</Link>
          ))}
        </div>
        <div className="nav__actions">
          <Link to="/contact" className="nav__cta" onClick={close}>{t('nav.contact')}</Link>
          <div className="nav__lang-wrap">
            <button className={`nav__lang ${langOpen ? 'nav__lang--open' : ''}`} onClick={() => setLangOpen(!langOpen)} aria-label="Language">
              {LANGUAGES[lang]?.label || lang}
            </button>
            {langOpen && <div className="nav__lang-dropdown">
              {Object.entries(LANGUAGES).map(([code, l]) => (
                <button key={code} className={`nav__lang-opt ${code === lang ? 'nav__lang-opt--active' : ''}`} onClick={() => { setLang(code); setLangOpen(false); document.documentElement.dir = l.dir }}>
                  {l.label}
                </button>
              ))}
            </div>}
          </div>
          <button className={`nav__toggle ${open ? 'nav__toggle--open' : ''}`} onClick={() => setOpen(!open)} aria-label={t('nav.about')}>
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
    </nav>
  )
}

function Footer() {
  const { t } = useLang()
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid reveal-stagger">
          <div className="footer__brand reveal-child">
            <img src="/logo.png" alt="Dr. J. Weinroth & Co. Law Office" className="footer__logo-img" />
            <p className="footer__desc">{t('footer.desc')}</p>
          </div>
          <div className="footer__links reveal-child">
            <h4>{t('footer.quickNav')}</h4>
            <Link to="/about">{t('nav.about')}</Link>
            <Link to="/practice">{t('nav.practice')}</Link>
            <Link to="/team">{t('nav.team')}</Link>
            <Link to="/articles">{t('nav.articles')}</Link>
          </div>
          <div className="footer__links reveal-child">
            <h4>{t('nav.practice')}</h4>
            <Link to="/practice/litigation">ליטיגציה</Link>
            <Link to="/practice/white-collar">צווארון לבן</Link>
            <Link to="/practice/real-estate">נדל"ן</Link>
            <Link to="/practice/commercial">משפט מסחרי</Link>
          </div>
          <div className="footer__links reveal-child">
            <h4>{t('footer.contactTitle')}</h4>
            <a href="tel:+97237181111">03-7181111</a>
            <a href="mailto:office@weinrothlaw.com">office@weinrothlaw.com</a>
            <a href="https://www.facebook.com/j.weinrothlaw" target="_blank" rel="noopener">פייסבוק</a>
          </div>
        </div>
        <div className="footer__bottom">
          <span>All Rights Reserved © Dr J. Weinroth & Co.</span>
          <div className="footer__legal">
            <a href="#">{t('footer.accessibility')}</a>
            <a href="#">{t('footer.privacy')}</a>
            <a href="#">{t('footer.terms')}</a>
          </div>
        </div>
        <div className="footer__credit" dir="ltr">
          Site created &amp; managed by <strong>AGENT HUB GURU O&amp;O</strong>
        </div>
      </div>
    </footer>
  )
}

function LayoutBody() {
  const { pathname } = useLocation()
  const { dir } = useLang()
  useReveal(pathname)
  useParallax(pathname)
  useEffect(() => {
    if (typeof window !== 'undefined') { window.scrollTo(0, 0); document.documentElement.dir = dir }
  }, [pathname, dir])
  return (
    <div className="app">
      <Nav />
      <main>
        <Outlet />
      </main>
      <Footer />
      <ChatWidget />
    </div>
  )
}

export function Layout() {
  return <LangProvider><LayoutBody /></LangProvider>
}

// Inner-page header (H1) that clears the fixed nav.
export function PageHeader({ title, subtitle }) {
  return (
    <header className="pagehead">
      <div className="container reveal-stagger">
        <h1 className="pagehead__title reveal-child">{title}</h1>
        {subtitle && <p className="pagehead__sub reveal-child">{subtitle}</p>}
      </div>
    </header>
  )
}

function Stat({ target, suffix, label }) {
  const ref = useRef(null)
  const [val, setVal] = useState('0')
  useEffect(() => {
    if (prefersReducedMotion) { setVal(`${target}${suffix}`); return }
    const el = ref.current
    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      const start = performance.now()
      const dur = 2000 + target * 80
      const anim = (now) => {
        const p = Math.min((now - start) / dur, 1)
        setVal(`${Math.floor((1 - Math.pow(1 - p, 3)) * target)}${suffix}`)
        if (p < 1) requestAnimationFrame(anim)
      }
      requestAnimationFrame(anim)
      obs.unobserve(el)
    }, { threshold: 0.3 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [ref, target, suffix])
  return <div className="hero__stat"><span ref={ref} className="hero__stat-num">{val}</span><span className="hero__stat-label">{label}</span></div>
}

export function HeroSection() {
  const { t } = useLang()
  const [photoIndex, setPhotoIndex] = useState(0)
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  const heroRef = useRef(null)
  const touchX = useRef(null)

  const nextPhoto = () => setPhotoIndex(prev => {
    let next
    do { next = Math.floor(Math.random() * heroPhotos.length) } while (next === prev)
    return next
  })

  useEffect(() => {
    const interval = setInterval(nextPhoto, 5000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const onMouse = (e) => {
      setMouse({ x: (e.clientX / window.innerWidth - 0.5) * 6, y: (e.clientY / window.innerHeight - 0.5) * 4 })
    }
    window.addEventListener('mousemove', onMouse, { passive: true })
    return () => window.removeEventListener('mousemove', onMouse)
  }, [])

  useEffect(() => {
    const el = heroRef.current
    if (!el) return
    const onTouchStart = (e) => { touchX.current = e.touches[0].clientX }
    const onTouchEnd = (e) => {
      const dx = e.changedTouches[0].clientX - touchX.current
      if (Math.abs(dx) > 50) nextPhoto()
    }
    el.addEventListener('touchstart', onTouchStart, { passive: true })
    el.addEventListener('touchend', onTouchEnd, { passive: true })
    return () => { el.removeEventListener('touchstart', onTouchStart); el.removeEventListener('touchend', onTouchEnd) }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const el = heroRef.current
    if (!el) return
    const onScroll = () => {
      const rect = el.getBoundingClientRect()
      const progress = Math.max(0, Math.min(1, -rect.top / rect.height))
      el.style.setProperty('--scroll-progress', progress)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section className="hero" ref={heroRef}>
      <div className="hero__bg">
        {heroPhotos.map((url, i) => (
          <div key={i} className={`hero__photo ${i === photoIndex ? 'hero__photo--active' : ''}`} style={{ backgroundImage: `url(${url})` }} />
        ))}
        <div className="hero__bg-gradient" style={{ transform: `translate(${mouse.x * 0.5}px, ${mouse.y * 0.5}px)` }}></div>
        <div className="hero__bg-parallax" style={{ transform: `translate(${mouse.x * 0.3}px, ${mouse.y * 0.3}px)` }}></div>
      </div>
      <div className="hero__content">
        <div className="hero__content-inner reveal-stagger">
          <div className="hero__badge reveal-child">{t('hero.badge')}</div>
          <h1 className="hero__title reveal-child">
            <span className="hero__title-line">{t('hero.title1')}</span>
            <span className="hero__title-line hero__title-line--accent">{t('hero.title2')}</span>
          </h1>
          <p className="hero__desc reveal-child">{t('hero.desc')}</p>
          <div className="hero__actions reveal-child">
            <Link to="/contact" className="btn btn--primary">{t('hero.cta1')}</Link>
            <Link to="/practice" className="btn btn--outline">{t('hero.cta2')}</Link>
          </div>
          <div className="hero__stats reveal-child">
            <Stat target={50} suffix="+" label={t('hero.stat1')} />
            <Stat target={15} suffix="+" label={t('hero.stat2')} />
            <Stat target={5} suffix="" label={t('hero.stat3')} />
          </div>
        </div>
      </div>
    </section>
  )
}

export function AboutSection({ showHeader = true }) {
  return (
    <section id="about" className="about section">
      <div className="container">
        {showHeader && (
          <div className="section__header reveal-stagger" style={{ textAlign: 'right' }}>
            <h2 className="section__title reveal-child">מי אנחנו</h2>
          </div>
        )}
        <div className="about__editorial reveal-stagger">
          <div className="about__editorial-lead reveal-blur">
            <p className="about__lead-text">
              מאז הקמתו בשנת 1974 על ידי ד"ר יעקב וינרוט ז"ל, משרד עורכי הדין ד"ר י. וינרוט ושות'
              הינו אחד המשרדים המוערכים והמובילים בישראל.
            </p>
          </div>
          <div className="about__editorial-media reveal-mask">
            <img src="/assets/wl/about-new.webp" alt="משרד עורכי הדין ד&quot;ר י. וינרוט ושות'" loading="lazy" />
          </div>
          <div className="about__editorial-body reveal-child">
            <p className="about__text">
              משרדנו מתמחה במגוון תחומי המשפט המסחרי, האזרחי, הציבורי והפלילי. צוות המשרד מורכב
              מעורכי דין מובילים ועתירי ניסיון, המייצגים ומייעצים למגוון לקוחות, לרבות אנשי ציבור
              ותקשורת ואנשי עסקים בכירים, גופים ציבוריים ופרטיים, תאגידים ורשויות מקומיות.
            </p>
            <p className="about__text">
              עורכי הדין במשרד מתאפיינים בנחישות, מסירות, ומקצועיות מהמעלה הראשונה. המשרד מדורג דרך קבע כאחד
              המשרדים המובילים בארץ בזכות מחויבותו הבלתי מתפשרת למצוינות משפטית.
            </p>
            <blockquote className="about__quote">
              בסוגיית של פשעי הצווארון הלבן וליטיגציה אזרחית ומסחרית, המוניטין של ד"ר י. וינרוט
              ושות' הינו בלתי מעורער.
              <cite>European Legal 500</cite>
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  )
}

export function AboutTeaser() {
  return (
    <section className="about section">
      <div className="container">
        <div className="about__teaser reveal-stagger">
          <div className="about__teaser-media reveal-mask">
            <img src="/assets/wl/about-new.webp" alt="משרד עורכי הדין ד&quot;ר י. וינרוט ושות'" loading="lazy" />
          </div>
          <div className="about__teaser-body reveal-child">
            <span className="about__teaser-label">מאז 1974</span>
            <h2 className="about__teaser-title">משרד עורכי דין מוביל בישראל</h2>
            <p className="about__text">
              מאז הקמתו על ידי ד"ר יעקב וינרוט ז"ל, משרדנו מתמחה בליטיגציה אזרחית, פלילית ומסחרית,
              ומייצג את הלקוחות המובילים במשק.
            </p>
            <div className="about__teaser-features">
              <span>מדורג דרך קבע כמשרד מוביל (BDI · DUNS 100)</span>
              <span>ייצוג בבתי הדין הבינלאומיים ICC</span>
            </div>
            <Link to="/about" className="btn btn--outline">קראו עוד עלינו</Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export function PracticeSection({ showHeader = true, dark = true }) {
  const [feat, ...rest] = practiceAreas
  const [secA, secB, ...list] = rest
  return (
    <section id="practice" className={`practice section ${dark ? 'section--dark' : ''}`}>
      <div className="container">
        {showHeader && (
          <div className="section__header reveal-stagger">
            <h2 className="section__title reveal-child">תחומי פעילות</h2>
            <p className="section__subtitle reveal-child">מומחיות משפטית רחבה במגוון תחומים</p>
          </div>
        )}
        <div className="prac">
          {/* Featured — large hero area */}
          <Link to={`/practice/${feat.slug}`} className="prac__featured reveal-mask">
            <div className="prac__featured-img">
              <img src={feat.img} alt={feat.title} loading="lazy" />
            </div>
            <div className="prac__featured-body">
              <span className="prac__tag">תחום מוביל</span>
              <h3 className="prac__featured-title">{feat.title}</h3>
              <p className="prac__featured-desc">{feat.desc}</p>
              <span className="prac__link">פרטים נוספים →</span>
            </div>
          </Link>

          {/* Two secondary — side by side */}
          <div className="prac__secondary">
            {[secA, secB].map((area, i) => (
              <Link key={area.slug} to={`/practice/${area.slug}`} className="prac__secondary-card reveal-up" style={{ '--stagger': i }}>
                <div className="prac__secondary-img">
                  <img src={area.img} alt={area.title} loading="lazy" />
                </div>
                <div className="prac__secondary-body">
                  <h4 className="prac__secondary-title">{area.title}</h4>
                  <p className="prac__secondary-desc">{area.desc}</p>
                  <span className="prac__link">→</span>
                </div>
              </Link>
            ))}
          </div>

          {/* Magazine list — numbered, minimal */}
          <div className="prac__list reveal-stagger">
            {list.map((area, i) => (
              <Link key={area.slug} to={`/practice/${area.slug}`} className="prac__list-item reveal-child">
                <span className="prac__list-num">{String(i + 4).padStart(2, '0')}</span>
                <div className="prac__list-body">
                  <h4 className="prac__list-title">{area.title}</h4>
                  <p className="prac__list-desc">{area.desc}</p>
                </div>
                <span className="prac__list-arrow">→</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export function TeamSection({ showHeader = true }) {
  return (
    <section id="team" className="team section">
      <div className="container">
        {showHeader && (
          <div className="section__header reveal-stagger">
            <h2 className="section__title reveal-child">הצוות המשפטי</h2>
            <p className="section__subtitle reveal-child">הטובים ביותר בתחומם</p>
          </div>
        )}
        <div className="team__gallery reveal-stagger">
          {teamMembers.map((member, i) => (
            <div key={i} className="team__figure reveal-child" style={{ '--stagger': i }}>
              {member.photo ? (
                <div className="team__figure-media">
                  <img src={member.photo} alt={member.name} loading="lazy" />
                  <div className="team__figure-overlay">
                    <h3 className="team__figure-name">{member.name}</h3>
                    {member.role && <span className="team__figure-role">{member.role}</span>}
                    {member.bio && <p className="team__figure-bio">{member.bio.slice(0, 100)}{member.bio.length > 100 ? '…' : ''}</p>}
                  </div>
                </div>
              ) : (
                <div className="team__figure-media team__figure-media--empty">
                  <span className="team__figure-initial">{member.name.charAt(member.name.length - 2)}</span>
                  <div className="team__figure-overlay">
                    <h3 className="team__figure-name">{member.name}</h3>
                    {member.role && <span className="team__figure-role">{member.role}</span>}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function AchievementsSection({ showHeader = true }) {
  return (
    <section id="achievements" className="achievements section section--dark">
      <div className="container">
        {showHeader && (
          <div className="section__header reveal-stagger">
            <h2 className="section__title reveal-child">הישגים ודירוגים</h2>
            <p className="section__subtitle reveal-child">מובילים בתחום המשפט בישראל זה שנים</p>
          </div>
        )}
        <div className="ach__wall reveal-stagger">
          {achievements.map((a, i) => (
            <div key={i} className="ach__badge reveal-scale" style={{ '--stagger': i }}>
              <img src={a.img} alt={a.label} className="ach__badge-img" loading="lazy" />
              <span className="ach__badge-label">{a.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function ArticlesSection({ showHeader = true, limit }) {
  const posts = limit ? blogPosts.slice(0, limit) : allPosts
  const [featured, ...rest] = posts
  return (
    <section id="articles" className="blog section">
      <div className="container">
        {showHeader && (
          <div className="section__header reveal-stagger">
            <h2 className="section__title reveal-child">מאמרים וחדשות</h2>
            <p className="section__subtitle reveal-child">עדכונים משפטיים ותובנות מקצועיות</p>
          </div>
        )}
        <div className="art__wrap reveal-stagger">
          {featured && (
            <a href={featured.link} target="_blank" rel="noopener" className="art__featured reveal-mask">
              {featured.image && <div className="art__featured-media"><img src={featured.image} alt={featured.title} loading="lazy" /></div>}
              <div className="art__featured-body">
                <span className="art__meta">{featured.date}</span>
                <h3 className="art__featured-title">{featured.title}</h3>
                {featured.excerpt && <p className="art__text">{featured.excerpt.slice(0, 140)}…</p>}
                <span className="art__link">קרא עוד →</span>
              </div>
            </a>
          )}
          <div className="art__grid">
            {rest.map((post, i) => (
              <a key={i} href={post.link} target="_blank" rel="noopener" className="art__card reveal-up" style={{ '--stagger': i }}>
                {post.image && <div className="art__card-media"><img src={post.image} alt={post.title} loading="lazy" /></div>}
                <div className="art__card-body">
                  <span className="art__meta">{post.date}</span>
                  <h3 className="art__card-title">{post.title}</h3>
                  <span className="art__link">→</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export function ContactSection({ showHeader = true }) {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', message: '' })
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  return (
    <section id="contact" className="contact section section--dark">
      <div className="container">
        <div className="contact__grid reveal-stagger">
          <div className="contact__info reveal-child reveal-stagger">
            {showHeader && <h2 className="section__title reveal-child">צור קשר</h2>}
            <p className="contact__text reveal-child">השאירו פרטים ונחזור אליכם בהקדם</p>
            <div className="contact__details">
              <div className="contact__detail">
                <span className="contact__detail-icon">📍</span>
                <div><strong>כתובת</strong><span>הירקון 3-5, מגדל LYFE B, קומה 33, בני ברק</span></div>
              </div>
              <div className="contact__detail">
                <span className="contact__detail-icon">📞</span>
                <div><strong>טלפון</strong><a href="tel:+97237181111">03-7181111</a></div>
              </div>
              <div className="contact__detail">
                <span className="contact__detail-icon">✉️</span>
                <div><strong>דוא"ל</strong><a href="mailto:office@weinrothlaw.com">office@weinrothlaw.com</a></div>
              </div>
              <div className="contact__detail">
                <span className="contact__detail-icon">💬</span>
                <div><strong>פייסבוק</strong><a href="https://www.facebook.com/j.weinrothlaw" target="_blank" rel="noopener">משרד וינרוט</a></div>
              </div>
            </div>
          </div>
          <form className="contact__form reveal-child" onSubmit={e => e.preventDefault()}>
            <div className="contact__form-group">
              <label className="contact__form-label">שם פרטי</label>
              <input className="contact__form-input" name="firstName" value={form.firstName} onChange={handleChange} placeholder="ישראל" />
            </div>
            <div className="contact__form-group">
              <label className="contact__form-label">שם משפחה</label>
              <input className="contact__form-input" name="lastName" value={form.lastName} onChange={handleChange} placeholder="ישראלי" />
            </div>
            <div className="contact__form-group">
              <label className="contact__form-label">אימייל</label>
              <input className="contact__form-input" type="email" name="email" value={form.email} onChange={handleChange} placeholder="your@email.com" />
            </div>
            <div className="contact__form-group">
              <label className="contact__form-label">טלפון</label>
              <input className="contact__form-input" type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="050-0000000" />
            </div>
            <div className="contact__form-group contact__form-group--full">
              <label className="contact__form-label">הודעה</label>
              <textarea className="contact__form-input contact__form-textarea" name="message" value={form.message} onChange={handleChange} placeholder="כיצד נוכל לעזור?"></textarea>
            </div>
            <button type="submit" className="btn btn--primary contact__form-btn">שלח הודעה</button>
          </form>
        </div>
      </div>
    </section>
  )
}

// Compact call-to-action band (used on the home page instead of the full form).
export function ContactCTA() {
  const { t } = useLang()
  return (
    <section className="ctaband section section--dark">
      <div className="container ctaband__inner reveal-stagger">
        <h2 className="section__title reveal-child">{t('ctaBand.title')}</h2>
        <p className="section__subtitle reveal-child">{t('ctaBand.desc')}</p>
        <div className="reveal-child"><Link to="/contact" className="btn btn--primary">{t('ctaBand.cta')}</Link></div>
      </div>
    </section>
  )
}
