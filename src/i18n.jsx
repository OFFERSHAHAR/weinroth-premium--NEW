import React, { createContext, useContext, useState } from 'react'

const LANGUAGES = {
  he: { label: 'עברית', dir: 'rtl' },
  en: { label: 'English', dir: 'ltr' },
  ru: { label: 'Русский', dir: 'ltr' },
  fr: { label: 'Français', dir: 'ltr' },
  es: { label: 'Español', dir: 'ltr' },
  ar: { label: 'العربية', dir: 'rtl' },
  de: { label: 'Deutsch', dir: 'ltr' },
}

const T = {
  nav: {
    about: { he: 'אודות', en: 'About', ru: 'О нас', fr: 'À propos', es: 'Sobre', ar: 'حول', de: 'Über uns' },
    practice: { he: 'תחומי פעילות', en: 'Practice Areas', ru: 'Направления', fr: 'Domaines', es: 'Áreas', ar: 'مجالات', de: 'Bereiche' },
    team: { he: 'הצוות', en: 'Team', ru: 'Команда', fr: 'Équipe', es: 'Equipo', ar: 'الفريق', de: 'Team' },
    achievements: { he: 'הישגים', en: 'Achievements', ru: 'Достижения', fr: 'Réalisations', es: 'Logros', ar: 'إنجازات', de: 'Erfolge' },
    articles: { he: 'מאמרים', en: 'Articles', ru: 'Статьи', fr: 'Articles', es: 'Artículos', ar: 'مقالات', de: 'Artikel' },
    contact: { he: 'יצירת קשר', en: 'Contact', ru: 'Контакты', fr: 'Contact', es: 'Contacto', ar: 'اتصل', de: 'Kontakt' },
  },
  hero: {
    badge: { he: 'מובילים בתחום המשפט בישראל', en: 'Leading Law Firm in Israel', ru: 'Ведущая юридическая фирма в Израиле', fr: 'Cabinet d\'avocats leader en Israël', es: 'Bufete líder en Israel', ar: 'مكتب محاماة رائد في إسرائيل', de: 'Führende Anwaltskanzlei in Israel' },
    title1: { he: 'משרד עו"ד', en: 'Law Office', ru: 'Юридическая фирма', fr: 'Cabinet d\'avocats', es: 'Bufete de abogados', ar: 'مكتب محاماة', de: 'Anwaltskanzlei' },
    title2: { he: 'ד"ר י. וינרוט ושות\'', en: 'Dr. J. Weinroth & Co.', ru: 'Д-р Й. Вайнрот и партнёры', fr: 'Dr J. Weinroth & Cie', es: 'Dr. J. Weinroth & Co.', ar: 'د. ي. وينروت وشركاه', de: 'Dr. J. Weinroth & Co.' },
    desc: { he: 'ניסיון של למעלה מ-50 שנה בליטיגציה אזרחית, פלילית ומסחרית. מייצגים את הלקוחות המובילים בישראל.', en: 'Over 50 years of experience in civil, criminal and commercial litigation. Representing leading clients in Israel.', ru: 'Более 50 лет опыта в гражданской, уголовной и коммерческой судебной практике. Представляем ведущих клиентов в Израиле.', fr: 'Plus de 50 ans d\'expérience en contentieux civil, pénal et commercial. Nous représentons les plus grands clients en Israël.', es: 'Más de 50 años de experiencia en litigios civiles, penales y comerciales. Representamos a los principales clientes en Israel.', ar: 'أكثر من 50 عامًا من الخبرة في التقاضي المدني والجنائي والتجاري. نمثل كبار العملاء في إسرائيل.', de: 'Über 50 Jahre Erfahrung in Zivil-, Straf- und Wirtschaftsrecht. Wir vertreten führende Mandanten in Israel.' },
    cta1: { he: 'ייעוץ ראשוני', en: 'Free Consultation', ru: 'Первичная консультация', fr: 'Consultation gratuite', es: 'Consulta gratuita', ar: 'استشارة أولية', de: 'Erstberatung' },
    cta2: { he: 'תחומי פעילות', en: 'Practice Areas', ru: 'Направления', fr: 'Domaines d\'activité', es: 'Áreas de práctica', ar: 'مجالات الممارسة', de: 'Tätigkeitsbereiche' },
    stat1: { he: 'שנות ניסיון', en: 'Years of Experience', ru: 'Лет опыта', fr: 'Années d\'expérience', es: 'Años de experiencia', ar: 'سنوات خبرة', de: 'Jahre Erfahrung' },
    stat2: { he: 'עורכי דין', en: 'Attorneys', ru: 'Адвокатов', fr: 'Avocats', es: 'Abogados', ar: 'محامون', de: 'Anwälte' },
    stat3: { he: 'דירוגי BDI', en: 'BDI Rankings', ru: 'Рейтинги BDI', fr: 'Classements BDI', es: 'Clasificaciones BDI', ar: 'تصنيفات BDI', de: 'BDI-Bewertungen' },
  },
  footer: {
    desc: { he: 'משרד עורכי דין מוביל בישראל, משלב ניסיון רב-דורי עם חדשנות משפטית.', en: 'A leading law firm in Israel, combining multi-generational experience with legal innovation.', ru: 'Ведущая юридическая фирма в Израиле, сочетающая многопоколенный опыт с юридическими инновациями.', fr: 'Un cabinet d\'avocats leader en Israël, alliant une expérience multigénérationnelle à l\'innovation juridique.', es: 'Un bufete de abogados líder en Israel, que combina experiencia multigeneracional con innovación legal.', ar: 'مكتب محاماة رائد في إسرائيل، يجمع بين خبرة متعددة الأجيال والابتكار القانوني.', de: 'Eine führende Anwaltskanzlei in Israel, die generationenübergreifende Erfahrung mit juristischer Innovation verbindet.' },
    quickNav: { he: 'ניווט מהיר', en: 'Quick Links', ru: 'Быстрая навигация', fr: 'Liens rapides', es: 'Enlaces rápidos', ar: 'روابط سريعة', de: 'Schnellnavigation' },
    contactTitle: { he: 'צור קשר', en: 'Contact Us', ru: 'Свяжитесь с нами', fr: 'Contactez-nous', es: 'Contáctenos', ar: 'اتصل بنا', de: 'Kontakt' },
    accessibility: { he: 'הצהרת נגישות', en: 'Accessibility', ru: 'Доступность', fr: 'Accessibilité', es: 'Accesibilidad', ar: 'إمكانية الوصول', de: 'Barrierefreiheit' },
    privacy: { he: 'מדיניות פרטיות', en: 'Privacy Policy', ru: 'Политика конфиденциальности', fr: 'Politique de confidentialité', es: 'Política de privacidad', ar: 'سياسة الخصوصية', de: 'Datenschutz' },
    terms: { he: 'תנאי שימוש', en: 'Terms of Use', ru: 'Условия использования', fr: 'Conditions d\'utilisation', es: 'Términos de uso', ar: 'شروط الاستخدام', de: 'Nutzungsbedingungen' },
  },
  ctaBand: {
    title: { he: 'זקוקים לייעוץ משפטי?', en: 'Need Legal Advice?', ru: 'Нужна юридическая консультация?', fr: 'Besoin de conseils juridiques?', es: '¿Necesita asesoramiento legal?', ar: 'هل تحتاج إلى استشارة قانونية؟', de: 'Benötigen Sie rechtliche Beratung?' },
    desc: { he: 'צוות המשרד עומד לרשותכם. השאירו פרטים ונחזור אליכם בהקדם.', en: 'Our team is at your service. Leave your details and we\'ll get back to you shortly.', ru: 'Наша команда к вашим услугам. Оставьте свои данные, и мы свяжемся с вами в ближайшее время.', fr: 'Notre équipe est à votre service. Laissez vos coordonnées et nous vous recontacterons rapidement.', es: 'Nuestro equipo está a su servicio. Deje sus datos y le responderemos pronto.', ar: 'فريقنا في خدمتك. اترك تفاصيلك وسنعود إليك قريبًا.', de: 'Unser Team steht Ihnen zur Verfügung. Hinterlassen Sie Ihre Daten und wir melden uns bald bei Ihnen.' },
    cta: { he: 'צרו קשר עכשיו', en: 'Contact Us Now', ru: 'Свяжитесь сейчас', fr: 'Contactez-nous', es: 'Contáctenos ahora', ar: 'اتصل بنا الآن', de: 'Kontaktieren Sie uns' },
  },
}

const LangContext = createContext()

export function LangProvider({ children }) {
  const [lang, setLang] = useState('he')
  const dir = LANGUAGES[lang]?.dir || 'rtl'
  return <LangContext.Provider value={{ lang, setLang, dir, t: (path) => path.split('.').reduce((o, k) => o?.[k], T)?.[lang] || path }}>{children}</LangContext.Provider>
}

export function useLang() {
  return useContext(LangContext)
}

export function t(path) {
  const ctx = useContext(LangContext)
  return path.split('.').reduce((o, k) => o?.[k], T)?.[ctx.lang] || path
}

export { LANGUAGES }
