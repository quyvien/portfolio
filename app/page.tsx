import Image from 'next/image'
import { Header } from '@/components/Header'
import { HeroSceneLoader } from '@/components/HeroSceneLoader'
import { MotionController } from '@/components/MotionController'
import { mentoringPhotos, portfolio, skillGroups } from '@/data/portfolio'

function Hero() {
  return (
    <section className="hero wrap" id="home" aria-labelledby="hero-heading">
      <div className="hero-dragon-layer" aria-hidden="true">
        <HeroSceneLoader />
        <div className="scene-instruction"><span className="scene-dot" /> CYBER SIGIL DRAGON / POINTER REACTIVE</div>
      </div>
      <div className="hero-layout">
        <div className="hero-title">
          <h1 id="hero-heading">Software<br />Developer</h1>
          <div className="hero-tags" aria-label="Background and direction"><span>C#</span><span>SQL</span><span>Next.js</span><span>3D Web</span></div>
        </div>
        <div className="hero-identity">
          <span className="status-label"><span className="small-dot" />OPEN TO OPPORTUNITIES</span>
          <p className="eyebrow hero-direction">01 /<br />ASPIRING SOFTWARE ENGINEER</p>
          <p className="hero-name">{portfolio.name}</p>
          <p className="eyebrow hero-application">THIRD-YEAR IT STUDENT<br />HUFLIT · VIETNAM</p>
        </div>
        <figure className="hero-media">
          <div className="hero-portrait"><Image src="/assets/tsan-quy-vien.jpg" alt="Portrait of Quy Vien" width={1536} height={2048} priority sizes="(max-width: 700px) 360px, 400px" /></div>
          <figcaption><span>SOFTWARE DEVELOPMENT / LEARNING THROUGH PROJECTS</span><span aria-hidden="true">↗</span></figcaption>
        </figure>
        <div className="hero-intro">
          <p>{portfolio.intro}</p>
          <div className="hero-links">
            <a className="pill-link" href="#projects">View Projects <span aria-hidden="true">↗</span></a>
            <a className="text-link" href={portfolio.github}>GitHub <span aria-hidden="true">↗</span></a>
            <a className="text-link" href="#contact">Contact Me <span aria-hidden="true">↓</span></a>
          </div>
        </div>
      </div>
      <div className="hero-foot eyebrow"><span>↳ &nbsp; LEARN. BUILD. IMPROVE.</span><a href="#perspective">SCROLL TO EXPLORE <span aria-hidden="true">↓</span></a></div>
    </section>
  )
}

function Perspective() {
  return (
    <section className="typography-feature" id="perspective" aria-labelledby="perspective-heading">
      <div className="wrap">
        <div className="eyebrow feature-label"><span>LEARNING THROUGH PRACTICE</span><span aria-hidden="true">↙</span></div>
        <h2 id="perspective-heading"><span className="type-line">Learning by building.</span><span className="type-line">Developing with purpose.</span></h2>
        <p>Curiosity is the starting point. Making something useful is the direction.</p>
      </div>
    </section>
  )
}

function About() {
  return (
    <section className="about wrap section-space" id="about" aria-labelledby="about-heading">
      <div className="section-heading"><span className="eyebrow">01 / ABOUT</span><h2 id="about-heading">Learning today.<br /><em>Building for tomorrow.</em></h2><p>An IT student interested in useful, user-friendly software.</p></div>
      <article className="chapter chapter-one">
        <div className="chapter-marker"><span className="chapter-number">01</span><span className="eyebrow">EDUCATION</span></div>
        <div className="chapter-copy"><h3>A student.<br />A curious builder.</h3><p>I&apos;m Quy Vien, a third-year Information Technology student at HUFLIT – Ho Chi Minh City University of Foreign Languages and Information Technology. I&apos;m interested in software engineering, web and application development, and database systems.</p></div>
        <aside className="chapter-aside"><span className="eyebrow">EDUCATION</span><p>IT<br />Student</p><span className="aside-rule" /><span className="aside-caption">HUFLIT · Third-year student</span></aside>
      </article>
      <article className="chapter chapter-two">
        <div className="chapter-marker"><span className="chapter-number">02</span><span className="eyebrow">HOW I LEARN</span></div>
        <div className="chapter-copy"><h3>Practical projects.<br />Steady progress.</h3><p>I enjoy learning through university projects and self-study. I&apos;m improving my programming, database design, and software development skills, with a focus on building maintainable, useful, and user-friendly applications.</p></div>
        <div className="process-note" aria-label="My approach to learning"><span className="eyebrow">A QUESTION TO KEEP ASKING</span><p>What would<br />make this<br /><em>more useful?</em></p><span className="hand-arrow" aria-hidden="true">↳</span></div>
      </article>
      <article className="chapter chapter-three">
        <div className="chapter-marker"><span className="chapter-number">03</span><span className="eyebrow">LOOKING AHEAD</span></div>
        <div className="chapter-copy"><h3>Ready to learn.<br />Ready to contribute.</h3><p>I&apos;m looking for opportunities to gain real-world software development experience, learn from a team, and contribute to practical projects as I work toward a Software Engineer career.</p><p className="content-note">Open to internships, fresher and junior developer opportunities, and university project collaboration.</p></div>
        <aside className="future-note"><span className="eyebrow">CAREER DIRECTION</span><span className="future-arrow" aria-hidden="true">↗</span><p>Build stronger foundations.<br />Learn through collaboration.<br /><strong>Develop useful software.</strong></p><span className="application-label">Aspiring Software Engineer</span></aside>
      </article>
    </section>
  )
}

function SkillGlyph({ type }: { type: string }) {
  const paths: Record<string, React.ReactNode> = {
    code: <path d="m24 18-14 14 14 14M40 18l14 14-14 14M36 12 28 52" />,
    web: <><rect x="8" y="11" width="48" height="42" rx="2" /><path d="M8 22h48M15 16.5h1M21 16.5h1M27 16.5h1M27 31l-6 6 6 6M37 31l6 6-6 6" /></>,
    data: <><ellipse cx="32" cy="15" rx="20" ry="7" /><path d="M12 15v17c0 4 9 7 20 7s20-3 20-7V15M12 32v17c0 4 9 7 20 7s20-3 20-7V32" /></>,
    system: <><rect x="7" y="9" width="18" height="14" rx="2" /><rect x="39" y="41" width="18" height="14" rx="2" /><circle cx="16" cy="48" r="8" /><circle cx="48" cy="16" r="8" /><path d="M25 16h15M16 23v17M48 24v17M24 48h15" /></>,
    tools: <path d="M21 19v-5c0-3 2-5 5-5h12c3 0 5 2 5 5v5M9 25h46v30H9zM9 30l18 10h10l18-10M27 37v6h10v-6" />,
  }
  return <div className="skill-icon" aria-hidden="true"><svg viewBox="0 0 64 64">{paths[type]}</svg></div>
}

function Skills() {
  return (
    <section className="wrap section-space" id="skills" aria-labelledby="skills-heading">
      <div className="section-heading"><span className="eyebrow">02 / SKILLS</span><h2 id="skills-heading">Technical<br /><em>foundations.</em></h2><p>Skills I&apos;m developing through coursework and practical projects.</p></div>
      {skillGroups.map((group, index) => (
        <article className={`chapter skill-chapter ${index === 0 ? 'chapter-one' : ''}`} key={group.title}>
          <div className="chapter-marker"><span className="chapter-number">{String(index + 1).padStart(2, '0')}</span></div>
          <div className="chapter-copy"><h3>{group.title}</h3><ul className={`tech-list ${index === 3 ? 'tech-list-concepts' : ''}`} aria-label={group.title}>{group.items.map((item) => <li key={item.label}><span className={`tech-mark ${item.className}`} aria-hidden="true">{item.mark}</span>{item.label}</li>)}</ul></div>
          <SkillGlyph type={group.shortLabel} />
        </article>
      ))}
    </section>
  )
}

function Projects() {
  return (
    <section className="projects section-space" id="projects" aria-labelledby="projects-heading">
      <div className="wrap projects-layout">
        <div className="project-sidebar">
          <div className="section-heading"><span className="eyebrow">03 / PROJECTS</span><h2 id="projects-heading">Featured<br /><em>work.</em></h2><p>Practical software projects,<br />built as part of my learning.</p></div>
          <p className="projects-note">Exploring how software can support everyday tasks.</p>
          <div className="project-index" aria-label="Project index"><a href="#project-01"><span>01</span> MenuScan <span aria-hidden="true">↗</span></a></div>
        </div>
        <div id="project-list">
          <article className="project" id="project-01">
            <figure className="project-visual project-visual-one"><Image src="/assets/project-01.svg" alt="Abstract circle and grid illustration accompanying MenuScan" width={1200} height={760} /><figcaption><span>PROJECT 01</span><span>PROJECT ILLUSTRATION</span></figcaption></figure>
            <div className="project-body">
              <div className="project-title"><span className="eyebrow">01 / QR RESTAURANT ORDERING SYSTEM</span><h3>MenuScan</h3><p className="project-summary">A QR restaurant ordering system designed to let customers browse menus and place orders.</p><div className="project-links"><a href="https://github.com/awtichcoder/MenuScan-Web">View Repository <span aria-hidden="true">↗</span></a></div></div>
              <dl className="project-details"><div><dt>Project type</dt><dd>QR Restaurant Ordering System</dd></div><div><dt>Purpose</dt><dd>Help customers access restaurant menus and place orders.</dd></div><div><dt>Technologies</dt><dd>ASP.NET Core MVC · Tailwind CSS</dd></div></dl>
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}

function Mentoring() {
  return (
    <section className="mentoring wrap section-space" id="mentoring" aria-labelledby="mentoring-heading">
      <div className="section-heading"><span className="eyebrow">04 / MENTORING</span><h2 id="mentoring-heading">HUFLIT<br /><em>Mentoring.</em></h2><p>Moments from my participation in the HUFLIT Mentoring program.</p></div>
      <div className="mentoring-gallery">
        {mentoringPhotos.map((photo) => (
          <figure className={`mentoring-photo ${photo.main ? 'mentoring-photo-main' : ''}`} key={photo.src}>
            <a href={photo.src} aria-label={`View ${photo.caption.toLowerCase()}`}><Image src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} /></a>
            <figcaption><span>{photo.caption}</span>{photo.note && <span>{photo.note}</span>}</figcaption>
          </figure>
        ))}
      </div>
      <div className="mentoring-certificate"><div><span className="eyebrow">RECOGNITION</span><h3>Certificate received.</h3><p>I participated in HUFLIT Mentoring and received a certificate.</p></div><p className="mentoring-certificate-note">Certificate image coming soon.</p></div>
    </section>
  )
}

function Contact() {
  return (
    <section className="contact wrap section-space" id="contact" aria-labelledby="contact-heading">
      <div className="contact-top"><span className="eyebrow">05 / CONTACT</span><span className="eyebrow">GOOD THINGS START WITH A CONVERSATION</span></div>
      <h2 id="contact-heading">Let&apos;s connect<br />the <em>dots.</em><span aria-hidden="true">↗</span></h2>
      <div className="contact-bottom"><p>Have an internship, an entry-level development opportunity, or a university project in mind? I&apos;d be happy to connect and discuss how I could contribute and learn.</p><ul className="contact-links"><li><span>Email</span><a href={`mailto:${portfolio.email}`}>{portfolio.email} ↗</a></li><li><span>GitHub</span><a href={portfolio.github}>Visit GitHub ↗</a></li></ul></div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="wrap"><div className="footer-name" aria-hidden="true">{portfolio.name}</div><div className="site-footer"><span>© {new Date().getFullYear()} {portfolio.name}</span><span>Always learning. Always building.</span><a href="#home">Back to top <span aria-hidden="true">↑</span></a></div></footer>
  )
}

export default function Home() {
  return (
    <>
      <Header />
      <main id="main"><Hero /><Perspective /><About /><Skills /><Projects /><Mentoring /><Contact /></main>
      <Footer />
      <MotionController />
    </>
  )
}
