import React, { useEffect, useRef, useState, useCallback } from 'react'
import './App.css'
import content from './content.json'

// Real content pulled from weinrothlaw.com (WP REST API). Hebrew team pages only (drop /en/ duplicates).
const teamMembers = content.team.filter(m => !m.link.includes('/en/'))
const blogPosts = content.posts.filter(p => p.image).slice(0, 9)
const achievements = [
  { img: '/assets/wl/BDI-2025.png', label: 'BDI 2025' },
  { img: '/assets/wl/DUNS-2025.webp', label: 'DUNS 2025' },
  { img: '/assets/wl/DUNS-2024.png', label: 'DUNS 2024' },
  { img: '/assets/wl/DUNS-2023.png', label: 'DUNS 2023' },
  { img: '/assets/wl/Bdi-001-26_leading-comp-stamp_625x347_P2.png', label: 'BDI Leading 2026' },
  { img: '/assets/wl/Bdi-001-23_leading-comp-stamp_625x347_P-2.jpg', label: 'BDI Leading 2023' },
]

const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

function useReveal() {
  useEffect(() => {
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
              const children = el.querySelectorAll('.reveal-child')
              children.forEach((child, i) => {
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
  }, [])
}

function useParallax() {
  useEffect(() => {
    if (prefersReducedMotion) return
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
  }, [])
}

function Nav() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
      <div className="nav__inner">
        <div className="nav__logo">
          <img src="/logo.png" alt="וינרוט ושות'" className="nav__logo-img" />
          <a href="#contact" className="nav__cta" onClick={() => setOpen(false)}>יצירת קשר</a>
        </div>
        <div className={`nav__links ${open ? 'nav__links--open' : ''}`}>
          <a href="#about" onClick={() => setOpen(false)}>אודות</a>
          <a href="#practice" onClick={() => setOpen(false)}>תחומי פעילות</a>
          <a href="#team" onClick={() => setOpen(false)}>הצוות</a>
          <a href="#achievements" onClick={() => setOpen(false)}>הישגים</a>
          <a href="#blog" onClick={() => setOpen(false)}>מאמרים</a>
        </div>
        <div className="nav__actions">
          <button className={`nav__toggle ${open ? 'nav__toggle--open' : ''}`} onClick={() => setOpen(!open)} aria-label="תפריט">
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
    </nav>
  )
}

const practiceAreas = [
  { icon: '⚖️', title: 'ליטיגציה אזרחית ופלילית', desc: 'ייצוג בכל הערכאות השיפוטיות, ליטיגציה מסחרית מורכבת ובוררויות בינלאומיות מול ICC.' },
  { icon: '🏛️', title: 'צווארון לבן', desc: 'ייצוג בתיקי ניירות ערך, מרמה, הלבנת הון ועבירות כלכליות מול רשויות האכיפה.' },
  { icon: '🏗️', title: 'נדל"ן תכנון ובניה', desc: 'ליווי עסקאות נדל"ן מורכבות, תמ"א 38, פרויקטי תשתית והתחדשות עירונית.' },
  { icon: '📊', title: 'משפט מסחרי', desc: 'ייעוץ לחברות ישראליות ובינלאומיות בהיבטים מסחריים, רגולציה ומיזוגים.' },
  { icon: '🏦', title: 'בנקאות', desc: 'ייצוג וייעוץ בתחום הבנקאי, אשראי, ניירות ערך ורגולציה פיננסית.' },
  { icon: '👥', title: 'תובענות ייצוגיות', desc: 'ניסיון רב בייצוג תובעים ונתבעים בתובענות ייצוגיות ונגזרות מורכבות.' },
  { icon: '📋', title: 'משפט מנהלי', desc: 'עתירות לבג"ץ, מכרזים ציבוריים, רשויות מקומיות ורגולציה מנהלית.' },
  { icon: '👨‍👩‍👧‍👧', title: 'דיני משפחה', desc: 'גירושין, הסכמי ממון, ירושה וצוואות, ייפוי כוח מתמשך ומעמד אישי.' },
  { icon: '📝', title: 'דיני עבודה', desc: 'ייצוג מעסיקים ועובדים, הסכמים קיבוציים, תביעות והליכי פיטורים.' },
]

const heroPhotos = [
  '/hero1.png',
  '/hero2.png',
  '/hero4.png',
  '/hero5.png',
]

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

function HeroSection() {
  const [photoIndex, setPhotoIndex] = useState(0)
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  const stat1 = useRef(null); const stat2 = useRef(null); const stat3 = useRef(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setPhotoIndex(prev => {
        let next
        do { next = Math.floor(Math.random() * heroPhotos.length) } while (next === prev)
        return next
      })
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const onMouse = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 6
      const y = (e.clientY / window.innerHeight - 0.5) * 4
      setMouse({ x, y })
    }
    window.addEventListener('mousemove', onMouse, { passive: true })
    return () => window.removeEventListener('mousemove', onMouse)
  }, [])

  return (
    <section className="hero">
      <div className="hero__bg">
        {heroPhotos.map((url, i) => (
          <div key={i} className={`hero__photo ${i === photoIndex ? 'hero__photo--active' : ''}`} style={{ backgroundImage: `url(${url})` }} />
        ))}
        <div className="hero__bg-gradient" style={{ transform: `translate(${mouse.x * 0.5}px, ${mouse.y * 0.5}px)` }}></div>
        <div className="hero__bg-parallax" style={{ transform: `translate(${mouse.x * 0.3}px, ${mouse.y * 0.3}px)` }}></div>
      </div>
      <div className="hero__content">
        <div className="hero__content-blur"></div>
        <div className="hero__content-inner reveal-stagger">
          <div className="hero__badge reveal-child">מובילים בתחום המשפט בישראל</div>
          <h1 className="hero__title reveal-child">
            <span className="hero__title-line">משרד עו"ד</span>
            <span className="hero__title-line hero__title-line--accent">ד"ר י. וינרוט ושות'</span>
          </h1>
          <p className="hero__desc reveal-child">ניסיון של למעלה מ-50 שנה בליטיגציה אזרחית, פלילית ומסחרית. מייצגים את הלקוחות המובילים בישראל.</p>
          <div className="hero__actions reveal-child">
            <a href="#contact" className="btn btn--primary">ייעוץ ראשוני</a>
            <a href="#practice" className="btn btn--outline">תחומי פעילות</a>
          </div>
          <div className="hero__stats reveal-child">
            <Stat target={50} suffix="+" label="שנות ניסיון" />
            <Stat target={15} suffix="+" label="עורכי דין" />
            <Stat target={5} suffix="" label="דירוגי BDI" />
          </div>
        </div>
      </div>
    </section>
  )
}

function AboutSection() {
  return (
    <section id="about" className="about section">
      <div className="container">
        <div className="about__grid reveal-stagger">
          <div className="about__content reveal-child reveal-stagger">
            <h2 className="section__title reveal-child">מי אנחנו</h2>
            <p className="about__text">
              משרד עורכי הדין ד"ר י. וינרוט ושות' ניצב בחוד החנית של הליטיגציה האזרחית,
              המסחרית והפלילית בישראל. עורכי הדין במשרדנו נמנים עם בכירי הליטיגטורים בישראל,
              ומייצגים חברות מסחריות, ישראליות ובינלאומיות, לצד אנשי עסקים, ידוענים ואישי ציבור.
            </p>
            <p className="about__text">
              המשרד, שנוסד בשנת 1974, משלב ניסיון משפטי רב-דורי עם חשיבה חדשנית
              והבנה עמוקה של הסביבה המשפטית והרגולטורית בישראל.
            </p>
            <div className="about__features">
              <div className="about__feature">
                <span className="about__feature-icon">🎓</span>
                <span>3 תארים במשפטים, ממשל ומדיניות ציבורית</span>
              </div>
              <div className="about__feature">
                <span className="about__feature-icon">🏆</span>
                <span>יו"ר (משותף) הוועדה לאיסור הלבנת הון בלשכת עורכי הדין</span>
              </div>
              <div className="about__feature">
                <span className="about__feature-icon">🌐</span>
                <span>ייצוג בבתי הדין הבינלאומיים ICC</span>
              </div>
            </div>
          </div>
          <div className="about__image reveal-child reveal-mask">
            <div className="about__image-frame">
              <div className="about__image-placeholder">
                <span className="about__image-icon">⚖️</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function PracticeSection() {
  return (
    <section id="practice" className="practice section section--dark">
      <div className="container">
        <div className="section__header reveal-stagger">
          <h2 className="section__title reveal-child">תחומי פעילות</h2>
          <p className="section__subtitle reveal-child">מומחיות משפטית רחבה במגוון תחומים</p>
        </div>
        <div className="practice__grid reveal-stagger">
          {practiceAreas.map((area, i) => (
            <div key={i} className="practice__card reveal-child" style={{ '--stagger': i }}>
              <div className="practice__card-icon">{area.icon}</div>
              <h3 className="practice__card-title">{area.title}</h3>
              <p className="practice__card-desc">{area.desc}</p>
              <div className="practice__card-line"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function TeamSection() {
  return (
    <section id="team" className="team section">
      <div className="container">
        <div className="section__header reveal-stagger">
          <h2 className="section__title reveal-child">הצוות המשפטי</h2>
          <p className="section__subtitle reveal-child">הטובים ביותר בתחומם</p>
        </div>
        <div className="team__grid reveal-stagger">
          {teamMembers.map((member, i) => (
            <div key={i} className="team__card reveal-child" style={{ '--stagger': i }}>
              <div className="team__card-avatar">
                {member.photo
                  ? <img src={member.photo} alt={member.name} className="team__card-photo" loading="lazy" />
                  : <span className="team__card-avatar-text">{member.name.charAt(member.name.length - 2)}</span>}
              </div>
              <h3 className="team__card-name">{member.name}</h3>
              {member.role && <span className="team__card-role">{member.role}</span>}
              {member.bio && <p className="team__card-desc">{member.bio.slice(0, 140)}{member.bio.length > 140 ? '…' : ''}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function AchievementsSection() {
  return (
    <section id="achievements" className="achievements section section--dark">
      <div className="container">
        <div className="section__header reveal-stagger">
          <h2 className="section__title reveal-child">הישגים ודירוגים</h2>
          <p className="section__subtitle reveal-child">מובילים בתחום המשפט בישראל זה שנים</p>
        </div>
        <div className="achievements__grid reveal-stagger">
          {achievements.map((a, i) => (
            <div key={i} className="achievements__badge reveal-child" style={{ '--stagger': i }}>
              <img src={a.img} alt={a.label} className="achievements__badge-img" loading="lazy" />
              <span className="achievements__badge-text">{a.label}</span>
              <span className="achievements__badge-sub">משרד מוביל</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function BlogSection() {
  return (
    <section id="blog" className="blog section">
      <div className="container">
        <div className="section__header reveal-stagger">
          <h2 className="section__title reveal-child">מאמרים וחדשות</h2>
          <p className="section__subtitle reveal-child">עדכונים משפטיים ותובנות מקצועיות</p>
        </div>
        <div className="blog__grid reveal-stagger">
          {blogPosts.map((post, i) => (
            <a key={i} href={post.link} target="_blank" rel="noopener" className="blog__card reveal-child" style={{ '--stagger': i }}>
              {post.image && <div className="blog__card-media"><img src={post.image} alt={post.title} loading="lazy" /></div>}
              <div className="blog__card-body">
                <span className="blog__card-cat">{post.date}</span>
                <h3 className="blog__card-title">{post.title}</h3>
                {post.excerpt && <p className="blog__card-excerpt">{post.excerpt.slice(0, 110)}…</p>}
                <div className="blog__card-line"></div>
                <span className="blog__card-link">קרא עוד →</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

function ContactSection() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  return (
    <section id="contact" className="contact section section--dark">
      <div className="container">
        <div className="contact__grid reveal-stagger">
          <div className="contact__info reveal-child reveal-stagger">
            <h2 className="section__title reveal-child">צור קשר</h2>
            <p className="contact__text reveal-child">השאירו פרטים ונחזור אליכם בהקדם</p>
            <div className="contact__details">
              <div className="contact__detail">
                <span className="contact__detail-icon">📍</span>
                <div>
                  <strong>כתובת</strong>
                  <span>הירקון 3-5, מגדל LYFE B, קומה 33, בני ברק</span>
                </div>
              </div>
              <div className="contact__detail">
                <span className="contact__detail-icon">📞</span>
                <div>
                  <strong>טלפון</strong>
                  <a href="tel:+97237181111">03-7181111</a>
                </div>
              </div>
              <div className="contact__detail">
                <span className="contact__detail-icon">✉️</span>
                <div>
                  <strong>דוא"ל</strong>
                  <a href="mailto:office@weinrothlaw.com">office@weinrothlaw.com</a>
                </div>
              </div>
              <div className="contact__detail">
                <span className="contact__detail-icon">💬</span>
                <div>
                  <strong>פייסבוק</strong>
                  <a href="https://www.facebook.com/j.weinrothlaw" target="_blank" rel="noopener">משרד וינרוט</a>
                </div>
              </div>
            </div>
          </div>
          <form className="contact__form reveal-child" onSubmit={e => e.preventDefault()}>
            <div className="contact__form-group">
              <label className="contact__form-label">שם מלא</label>
              <input className="contact__form-input" name="name" value={form.name} onChange={handleChange} placeholder="ישראל ישראלי" />
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

function AgenticOSSection() {
  return (
    <section className="agentic section">
      <div className="container">
        <div className="section__header reveal-stagger">
          <span className="agentic__badge reveal-child">💡 AGENTIC OS</span>
          <h2 className="section__title reveal-child">פתרונות בינה מלאכותית מתקדמים</h2>
          <p className="section__subtitle reveal-child">חדשנות טכנולוגית לשירותכם</p>
        </div>
        <div className="agentic__grid reveal-stagger">
          <div className="agentic__card reveal-child">
            <div className="agentic__card-header">
              <span className="agentic__card-icon">🤖</span>
              <h3>WeinrothAI<br />Legal Agent OS</h3>
            </div>
            <p className="agentic__card-desc">
              מערכת סוכני AI אוטונומית לניהול מסמכים משפטיים, מחקר משפטי,
              ניתוח חוזים וחוות דעת. הסוכנים לומדים את סגנון העבודה של המשרד
              ומבצעים אוטומציה מלאה של תהליכים משפטיים חוזרים.
            </p>
            <ul className="agentic__card-features">
              <li>ניתוח חוזים ותיקים משפטיים בזמן אמת</li>
              <li>מחקר משפטי מבוסס AI עם אסמכתאות לפסיקה</li>
              <li>אוטומציה של כתבי טענות ומסמכים חוזרים</li>
              <li>ממשק ניהול תיקים חכם</li>
            </ul>
            <div className="agentic__card-footer">
              <span className="agentic__card-price">החל מ-₪2,900/חודש</span>
              <button className="btn btn--primary">לפרטים והדגמה</button>
            </div>
          </div>
          <div className="agentic__card reveal-child agentic__card--featured">
            <div className="agentic__card-badge">מומלץ</div>
            <div className="agentic__card-header">
              <span className="agentic__card-icon">🛡️</span>
              <h3>ComplianceGuard<br />Regulatory Agent OS</h3>
            </div>
            <p className="agentic__card-desc">
              מערכת ניטור רגולציה אוטונומית מבוססת AI העוקבת בזמן אמת אחר
              שינויים בחקיקה, פסיקות בתי משפט, תקנות והוראות רגולטוריות –
              ומתריעה על השפעות ישירות על הלקוחות.
            </p>
            <ul className="agentic__card-features">
              <li>ניטור בזמן אמת של שינויים רגולטוריים</li>
              <li>התרעות חכמות לפי תחום עיסוק הלקוח</li>
              <li>דוחות ציות אוטומטיים (Compliance Reports)</li>
              <li>אינטגרציה מלאה עם מערכת ניהול הלקוחות</li>
            </ul>
            <div className="agentic__card-footer">
              <span className="agentic__card-price">החל מ-₪4,500/חודש</span>
              <button className="btn btn--primary">לפרטים והדגמה</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__brand">
            <img src="/logo.png" alt="וינרוט ושות'" className="footer__logo-img" />
            <p className="footer__desc">משרד עורכי דין מוביל בישראל, משלב ניסיון רב-דורי עם חדשנות משפטית.</p>
          </div>
          <div className="footer__links">
            <h4>ניווט מהיר</h4>
            <a href="#about">אודות</a>
            <a href="#practice">תחומי פעילות</a>
            <a href="#team">הצוות</a>
            <a href="#blog">מאמרים</a>
          </div>
          <div className="footer__links">
            <h4>תחומי פעילות</h4>
            <a href="#practice">ליטיגציה</a>
            <a href="#practice">צווארון לבן</a>
            <a href="#practice">נדל"ן</a>
            <a href="#practice">משפט מסחרי</a>
          </div>
          <div className="footer__links">
            <h4>צור קשר</h4>
            <a href="tel:+97237181111">03-7181111</a>
            <a href="mailto:office@weinrothlaw.com">office@weinrothlaw.com</a>
            <a href="https://www.facebook.com/j.weinrothlaw" target="_blank" rel="noopener">פייסבוק</a>
          </div>
        </div>
        <div className="footer__bottom">
          <span>All Rights Reserved © Dr J. Weinroth & Co.</span>
          <div className="footer__legal">
            <a href="#">הצהרת נגישות</a>
            <a href="#">מדיניות פרטיות</a>
            <a href="#">תנאי שימוש</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default function App() {
  useReveal()
  useParallax()

  return (
    <div className="app">
      <Nav />
      <main>
        <HeroSection />
        <AboutSection />
        <PracticeSection />
        <TeamSection />
        <AchievementsSection />
        <AgenticOSSection />
        <BlogSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  )
}
