import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { Head } from 'vite-react-ssg'
import {
  PageHeader, HeroSection, AboutSection, AboutTeaser, PracticeSection,
  TeamSection, AchievementsSection, ArticlesSection, ContactSection, ContactCTA,
  practiceAreas,
} from './App.jsx'

const SITE = 'https://weinroth-premium-new.onrender.com'
const FIRM = 'משרד עו"ד ד"ר י. וינרוט ושות\''

function Seo({ title, description, path }) {
  const full = `${title} | ${FIRM}`
  const url = `${SITE}${path}`
  return (
    <Head>
      <title>{full}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={full} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={`${SITE}/icons/icon-512.png`} />
      <meta name="twitter:card" content="summary" />
      <html lang="he" dir="rtl" />
    </Head>
  )
}

export function Home() {
  return (
    <>
      <Seo path="/" title="עורכי דין מובילים בישראל"
        description="משרד עו&quot;ד ד&quot;ר י. וינרוט ושות' — ליטיגציה אזרחית, פלילית ומסחרית. מעל 50 שנות ניסיון, מדורג דרך קבע כמשרד מוביל בישראל." />
      <HeroSection />
      <AboutTeaser />
      <PracticeSection showHeader dark />
      <AchievementsSection />
      <ArticlesSection limit={3} />
      <ContactCTA />
    </>
  )
}

export function About() {
  return (
    <>
      <Seo path="/about" title="אודות המשרד"
        description="מאז 1974 — משרד עו&quot;ד ד&quot;ר י. וינרוט ושות' הוא אחד המשרדים המובילים בישראל בליטיגציה אזרחית, פלילית ומסחרית." />
      <PageHeader title="אודות המשרד" subtitle="מסורת של מצוינות משפטית מאז 1974" />
      <AboutSection showHeader={false} />
    </>
  )
}

export function Practice() {
  return (
    <>
      <Seo path="/practice" title="תחומי פעילות"
        description="תחומי ההתמחות של משרד וינרוט: ליטיגציה, צווארון לבן, נדל&quot;ן, משפט מסחרי, בנקאות, תובענות ייצוגיות, משפט מנהלי, דיני משפחה ודיני עבודה." />
      <PageHeader title="תחומי פעילות" subtitle="מומחיות משפטית רחבה במגוון תחומים" />
      <PracticeSection showHeader={false} dark={false} />
    </>
  )
}

export function PracticeDetail() {
  const { slug } = useParams()
  const area = practiceAreas.find(a => a.slug === slug)
  if (!area) return <NotFound />
  const others = practiceAreas.filter(a => a.slug !== slug).slice(0, 4)
  return (
    <>
      <Seo path={`/practice/${area.slug}`} title={area.title}
        description={area.desc} />
      <PageHeader title={area.title} subtitle="תחום פעילות" />
      <section className="section">
        <div className="container">
          <div className="detail__grid reveal-stagger">
            <div className="detail__media reveal-child reveal-mask">
              <img src={area.img} alt={area.title} loading="lazy" />
            </div>
            <div className="detail__body reveal-child reveal-stagger">
              <div className="detail__icon reveal-child">{area.icon}</div>
              <p className="about__text reveal-child">{area.desc}</p>
              <p className="about__text reveal-child">
                עורכי הדין במשרד ד"ר י. וינרוט ושות' מלווים לקוחות בתחום {area.title} מתוך ניסיון
                רב-שנים, מקצועיות בלתי מתפשרת ומחויבות מלאה להשגת התוצאה הטובה ביותר עבור הלקוח.
                נשמח לעמוד לרשותכם ולסייע בכל שאלה.
              </p>
              <Link to="/contact" className="btn btn--primary reveal-child">לייעוץ בנושא {area.title}</Link>
            </div>
          </div>

          <div className="detail__more reveal-stagger">
            <h2 className="section__title reveal-child">תחומי פעילות נוספים</h2>
            <div className="detail__more-links reveal-child">
              {others.map(o => (
                <Link key={o.slug} to={`/practice/${o.slug}`} className="detail__chip">{o.icon} {o.title}</Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export function Team() {
  return (
    <>
      <Seo path="/team" title="הצוות המשפטי"
        description="הכירו את עורכי הדין של משרד ד&quot;ר י. וינרוט ושות' — צוות מוביל ועתיר ניסיון בכל תחומי המשפט." />
      <PageHeader title="הצוות המשפטי" subtitle="הטובים ביותר בתחומם" />
      <TeamSection showHeader={false} />
    </>
  )
}

export function Achievements() {
  return (
    <>
      <Seo path="/achievements" title="הישגים ודירוגים"
        description="משרד וינרוט מדורג דרך קבע כאחד המשרדים המובילים בישראל — BDI, DUNS 100 ודירוגים בינלאומיים." />
      <PageHeader title="הישגים ודירוגים" subtitle="מובילים בתחום המשפט בישראל זה שנים" />
      <AchievementsSection showHeader={false} />
    </>
  )
}

export function Articles() {
  return (
    <>
      <Seo path="/articles" title="מאמרים וחדשות"
        description="מאמרים, עדכונים משפטיים ותובנות מקצועיות מאת עורכי הדין של משרד ד&quot;ר י. וינרוט ושות'." />
      <PageHeader title="מאמרים וחדשות" subtitle="עדכונים משפטיים ותובנות מקצועיות" />
      <ArticlesSection showHeader={false} />
    </>
  )
}

export function Contact() {
  return (
    <>
      <Seo path="/contact" title="צור קשר"
        description="צרו קשר עם משרד עו&quot;ד ד&quot;ר י. וינרוט ושות' — הירקון 3-5, מגדל LYFE B, בני ברק. טלפון 03-7181111." />
      <PageHeader title="צור קשר" subtitle="נשמח לעמוד לרשותכם" />
      <ContactSection showHeader={false} />
    </>
  )
}

export function NotFound() {
  return (
    <>
      <Seo path="/404" title="הדף לא נמצא" description="הדף המבוקש לא נמצא." />
      <PageHeader title="הדף לא נמצא" subtitle="404" />
      <section className="section"><div className="container" style={{ textAlign: 'center' }}>
        <p className="about__text">מצטערים, הדף שחיפשתם אינו קיים.</p>
        <Link to="/" className="btn btn--primary">חזרה לדף הבית</Link>
      </div></section>
    </>
  )
}
