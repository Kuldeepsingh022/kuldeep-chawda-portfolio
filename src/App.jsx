import { lazy, Suspense, useEffect, useState } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import TiltCard from './components/TiltCard'
import SkillSphere from './components/SkillSphere'
import Typewriter from './components/Typewriter'
import {
  certifications,
  education,
  experience,
  profile,
  projects,
  skillGroups,
  sphereWords,
  stats,
} from './data'

const Scene = lazy(() => import('./components/Scene'))

const NAV = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'education', label: 'Education' },
  { id: 'contact', label: 'Contact' },
]

const reveal = {
  initial: { opacity: 0, y: 50, rotateX: 18 },
  whileInView: { opacity: 1, y: 0, rotateX: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
}

function useMedia(query) {
  const [match, setMatch] = useState(() => window.matchMedia(query).matches)
  useEffect(() => {
    const mq = window.matchMedia(query)
    const on = () => setMatch(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [query])
  return match
}

function useActiveSection() {
  const [active, setActive] = useState('home')
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    )
    NAV.forEach((n) => {
      const el = document.getElementById(n.id)
      if (el) io.observe(el)
    })
    return () => io.disconnect()
  }, [])
  return active
}

function SectionTitle({ kicker, title }) {
  return (
    <motion.div className="section-title" {...reveal}>
      <span className="kicker">{kicker}</span>
      <h2>{title}</h2>
    </motion.div>
  )
}

function Navbar() {
  const active = useActiveSection()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 30)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
  }, [open])

  return (
    <header className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
      <a href="#home" className="logo" onClick={() => setOpen(false)}>
        <span className="logo-cube">K</span>
        <span>Kuldeep<b>.Singh</b></span>
      </a>
      <nav className={`nav-links ${open ? 'open' : ''}`}>
        {NAV.map((n) => (
          <a
            key={n.id}
            href={`#${n.id}`}
            className={active === n.id ? 'active' : ''}
            onClick={() => setOpen(false)}
          >
            {n.label}
          </a>
        ))}
        <a href={`mailto:${profile.email}`} className="btn btn-primary nav-cta" onClick={() => setOpen(false)}>
          Hire Me
        </a>
      </nav>
      <button
        className={`burger ${open ? 'open' : ''}`}
        aria-label="Toggle menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <span />
        <span />
        <span />
      </button>
    </header>
  )
}

function Hero() {
  return (
    <section id="home" className="hero">
      <div className="container hero-inner">
        <motion.div
          className="hero-text"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="badge">
            <span className="dot" /> Available for opportunities
          </span>
          <h1>
            Hi, I'm <span className="gradient-text">{profile.name}</span>
          </h1>
          <p className="hero-role">
            <Typewriter words={profile.roles} />
          </p>
          <p className="hero-sub">
            I build scalable React.js apps, RESTful APIs and production e-commerce platforms — shipped fast with
            CI/CD and AI-assisted development.
          </p>
          <div className="hero-actions">
            <a href="#projects" className="btn btn-primary">
              View My Work
            </a>
            <a href="#contact" className="btn btn-ghost">
              Let's Talk
            </a>
          </div>
          <div className="socials">
            <a href={profile.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05C20.6 8.65 21 11.3 21 14.7V21h-4v-5.6c0-1.34-.03-3.06-1.86-3.06-1.87 0-2.15 1.46-2.15 2.96V21H9z" /></svg>
            </a>
            <a href={`mailto:${profile.email}`} aria-label="Email">
              <svg viewBox="0 0 24 24"><path d="M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm9 7.2L4.4 7H4v.6l8 5.4 8-5.4V7h-.4z" /></svg>
            </a>
            <a href={`tel:${profile.phone}`} aria-label="Phone">
              <svg viewBox="0 0 24 24"><path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z" /></svg>
            </a>
          </div>
        </motion.div>
      </div>
      <a href="#about" className="scroll-hint" aria-label="Scroll down">
        <span className="mouse"><span /></span>
        Scroll
      </a>
    </section>
  )
}

function About() {
  return (
    <section id="about" className="section">
      <div className="container">
        <SectionTitle kicker="01 — Introduction" title="About Me" />
        <div className="about-grid">
          <motion.div {...reveal}>
            <TiltCard className="glass about-card">
              <h3>Full-Stack MERN Developer based in Indore 🇮🇳</h3>
              <p>{profile.summary}</p>
              <p>
                Currently a <strong>React JS Developer at Arbutus Infotech</strong>, I architect reusable component
                systems with MUI, wire up API-driven dashboards with TanStack Query, and automate delivery with
                GitHub Actions. I love turning complex requirements into clean, fast and intuitive interfaces.
              </p>
              <div className="about-meta">
                <span>📍 {profile.location}</span>
                <span>🎓 B.Tech CSE, RGPV (2025)</span>
              </div>
            </TiltCard>
          </motion.div>
          <div className="stats">
            {stats.map((s, i) => (
              <motion.div key={s.label} {...reveal} transition={{ ...reveal.transition, delay: i * 0.1 }}>
                <TiltCard className="glass stat" max={20}>
                  <span className="stat-value gradient-text">{s.value}</span>
                  <span className="stat-label">{s.label}</span>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function Skills() {
  return (
    <section id="skills" className="section">
      <div className="container">
        <SectionTitle kicker="02 — Toolbox" title="Technical Skills" />
        <div className="skills-grid">
          <motion.div className="sphere-wrap" {...reveal}>
            <SkillSphere words={sphereWords} />
            <p className="hint">Move your cursor over the sphere to spin it</p>
          </motion.div>
          <div className="skill-cards">
            {skillGroups.map((g, i) => (
              <motion.div key={g.title} {...reveal} transition={{ ...reveal.transition, delay: (i % 2) * 0.1 }}>
                <TiltCard className="glass skill-card">
                  <h3>
                    <span className="skill-icon">{g.icon}</span>
                    {g.title}
                  </h3>
                  <div className="chips">
                    {g.items.map((it) => (
                      <span key={it} className="chip">
                        {it}
                      </span>
                    ))}
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function Experience() {
  return (
    <section id="experience" className="section">
      <div className="container">
        <SectionTitle kicker="03 — Career" title="Work Experience" />
        <div className="timeline">
          {experience.map((job, i) => (
            <motion.div
              key={job.company}
              className="timeline-item"
              initial={{ opacity: 0, x: i % 2 ? 80 : -80, rotateY: i % 2 ? -25 : 25 }}
              whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className={`timeline-dot ${job.current ? 'pulse' : ''}`} />
              <TiltCard className="glass job" max={6}>
                <div className="job-head">
                  <div>
                    <h3>{job.role}</h3>
                    <p className="company">{job.company}</p>
                  </div>
                  <div className="job-meta">
                    <span className={`period ${job.current ? 'current' : ''}`}>{job.period}</span>
                    <span className="loc">{job.location}</span>
                  </div>
                </div>
                <ul>
                  {job.points.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Projects() {
  return (
    <section id="projects" className="section">
      <div className="container">
        <SectionTitle kicker="04 — Portfolio" title="Featured Projects" />
        <div className="projects">
          {projects.map((p, i) => (
            <motion.div key={p.title} {...reveal} transition={{ ...reveal.transition, delay: i * 0.12 }}>
              <TiltCard
                className="glass project"
                max={10}
                style={{ '--a1': p.accent[0], '--a2': p.accent[1] }}
              >
                <div className="project-visual">
                  <div className="cube">
                    <span className="f1" />
                    <span className="f2" />
                    <span className="f3" />
                    <span className="f4" />
                    <span className="f5" />
                    <span className="f6" />
                  </div>
                  <span className="project-num">0{i + 1}</span>
                </div>
                <div className="project-body">
                  <span className="period">{p.period}</span>
                  <h3>{p.title}</h3>
                  <p className="project-sub">{p.subtitle}</p>
                  <ul>
                    {p.points.map((pt) => (
                      <li key={pt}>{pt}</li>
                    ))}
                  </ul>
                  <div className="chips">
                    {p.tech.map((t) => (
                      <span key={t} className="chip">
                        {t}
                      </span>
                    ))}
                  </div>
                  {p.link && (
                    <a className="btn btn-primary btn-sm" href={p.link} target="_blank" rel="noreferrer">
                      Visit Live Site ↗
                    </a>
                  )}
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Education() {
  return (
    <section id="education" className="section">
      <div className="container">
        <SectionTitle kicker="05 — Learning" title="Education & Certifications" />
        <div className="edu-grid">
          <div className="edu-col">
            {education.map((e, i) => (
              <motion.div key={e.school} {...reveal} transition={{ ...reveal.transition, delay: i * 0.1 }}>
                <TiltCard className="glass edu">
                  <span className="edu-icon">🎓</span>
                  <div>
                    <span className="period">{e.period}</span>
                    <h3>{e.school}</h3>
                    <p className="company">{e.board}</p>
                    <p>{e.degree}</p>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </div>
          <div className="edu-col">
            {certifications.map((c, i) => (
              <motion.div key={c.org} {...reveal} transition={{ ...reveal.transition, delay: i * 0.1 }}>
                <TiltCard className="glass edu cert">
                  <span className="edu-icon">🏆</span>
                  <div>
                    {c.period && <span className="period">{c.period}</span>}
                    <h3>{c.title}</h3>
                    <p className="company">{c.org}</p>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))
  const submit = (e) => {
    e.preventDefault()
    const subject = encodeURIComponent(`Portfolio enquiry from ${form.name}`)
    const body = encodeURIComponent(`${form.message}\n\n— ${form.name} (${form.email})`)
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`
  }

  const items = [
    { icon: '✉️', label: 'Email', value: profile.email, href: `mailto:${profile.email}` },
    { icon: '📞', label: 'Phone', value: profile.phone, href: `tel:${profile.phone}` },
    { icon: '💼', label: 'LinkedIn', value: 'kuldeep-singh-chawda', href: profile.linkedin },
    { icon: '📍', label: 'Location', value: profile.location },
  ]

  return (
    <section id="contact" className="section">
      <div className="container">
        <SectionTitle kicker="06 — Get in touch" title="Let's Build Something" />
        <div className="contact-grid">
          <div className="contact-info">
            {items.map((it, i) => (
              <motion.div key={it.label} {...reveal} transition={{ ...reveal.transition, delay: i * 0.08 }}>
                <TiltCard className="glass contact-item" max={14}>
                  <span className="contact-icon">{it.icon}</span>
                  <div>
                    <span className="contact-label">{it.label}</span>
                    {it.href ? (
                      <a href={it.href} target={it.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
                        {it.value}
                      </a>
                    ) : (
                      <span>{it.value}</span>
                    )}
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </div>
          <motion.form className="glass contact-form" onSubmit={submit} {...reveal}>
            <label>
              Your Name
              <input required value={form.name} onChange={update('name')} placeholder="John Doe" />
            </label>
            <label>
              Your Email
              <input required type="email" value={form.email} onChange={update('email')} placeholder="john@company.com" />
            </label>
            <label>
              Message
              <textarea
                required
                rows={5}
                value={form.message}
                onChange={update('message')}
                placeholder="Tell me about your project or role…"
              />
            </label>
            <button type="submit" className="btn btn-primary">
              Send Message 🚀
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  )
}

function Loader({ done }) {
  return (
    <div className={`loader ${done ? 'loader--done' : ''}`} aria-hidden={done}>
      <div className="loader-cube">
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>
      <p>Loading 3D experience…</p>
    </div>
  )
}

export default function App() {
  const isMobile = useMedia('(max-width: 768px)')
  const reducedMotion = useMedia('(prefers-reduced-motion: reduce)')
  const [loaded, setLoaded] = useState(false)
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 1400)
    return () => clearTimeout(t)
  }, [])

  return (
    <>
      <Loader done={loaded} />
      <motion.div className="progress" style={{ scaleX: progress }} />
      <Suspense fallback={null}>
        <Scene isMobile={isMobile} reducedMotion={reducedMotion} />
      </Suspense>
      <div className="bg-gradient" aria-hidden="true" />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Education />
        <Contact />
      </main>
      <footer className="footer">
        <p>
          © {new Date().getFullYear()} {profile.name} · Built with React, Three.js & ❤️
        </p>
        <a href="#home">Back to top ↑</a>
      </footer>
    </>
  )
}
