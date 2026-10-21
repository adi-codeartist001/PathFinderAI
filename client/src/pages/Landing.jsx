import { useEffect, useRef, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import LandingVoice from '../components/LandingVoice'
import { useUser } from '../context/UserContext'


const CAREERS = ['Engineer','Doctor','Designer','CA','Lawyer','Data Scientist','Entrepreneur','Teacher','Architect','Pilot']

const FEATURES = [
  { icon: '🎯', title: 'Interest Quiz', desc: '10 smart questions map your passions to real career domains', color: '#F97316', bg: '#FFF7ED', glow: 'rgba(249,115,22,0.15)', path: '/quiz' },
  { icon: '🤖', title: 'AI Career Engine', desc: 'AI analyses your complete profile to surface your top 3 matches', color: '#0EA5E9', bg: '#F0F9FF', glow: 'rgba(14,165,233,0.15)', path: '/result' },
  { icon: '🗺️', title: 'Step-by-Step Roadmap', desc: '3, 6 & 12-month milestones with free YouTube & NPTEL resources', color: '#10B981', bg: '#ECFDF5', glow: 'rgba(16,185,129,0.15)', path: '/roadmap' },
  { icon: '🎓', title: 'College Predictor', desc: 'Find colleges by your marks, city & budget with AI matching', color: '#8B5CF6', bg: '#F5F3FF', glow: 'rgba(139,92,246,0.15)', path: '/colleges' },
  { icon: '🏛️', title: 'Govt Scheme Matcher', desc: 'Auto-match PM Kaushal, scholarships & state schemes to your profile', color: '#F59E0B', bg: '#FFFBEB', glow: 'rgba(245,158,11,0.15)', path: '/schemes' },
  { icon: '🎤', title: 'AI Mock Interview', desc: 'Practice with a robot interviewer in Hindi & English, get scored instantly', color: '#F43F5E', bg: '#FFF1F2', glow: 'rgba(244,63,94,0.15)', path: '/interview' },
  { icon: '⭐', title: 'Success Stories', desc: 'Real stories from Tier-2/3 students who made it', color: '#F43F5E', bg: '#FFF1F2', glow: 'rgba(244,63,94,0.15)', path: '/stories' },
]

const STATS = [
  { num: '50+', label: 'Career Paths', icon: '🎯' },
  { num: '100%', label: 'Free Forever', icon: '💚' },
  { num: '20+', label: 'Govt Schemes', icon: '🏛️' },
  { num: 'Hindi', label: '+ English', icon: '🌐' },
]

const MARQUEE_ITEMS = [
  '🏆 IIT JEE Prep','💻 Software Engineering','🏥 NEET & Medicine','⚖️ CLAT & Law',
  '📊 Data Science','🎨 Design Careers','💼 MBA & Business','🏛️ UPSC & Civil Services',
  '✈️ Aviation & Pilot','🔬 Research & PhD','📱 App Development','🎓 Study Abroad',
]

export default function Landing() {
  const navigate = useNavigate()
  const { t } = useUser()
  const canvasRef = useRef(null)
  const heroRef = useRef(null)
  const [wordIndex, setWordIndex] = useState(0)
  const [visible, setVisible] = useState(true)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [scrollY, setScrollY] = useState(0)

  // Career word rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setWordIndex(i => (i + 1) % CAREERS.length)
        setVisible(true)
      }, 350)
    }, 2200)
    return () => clearInterval(interval)
  }, [])

  // Scroll parallax
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // 3D mouse tilt on hero
  const handleMouseMove = useCallback((e) => {
    if (!heroRef.current) return
    const rect = heroRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2
    setMousePos({ x, y })
  }, [])

  // Particle canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let W = canvas.width = window.innerWidth
    let H = canvas.height = window.innerHeight

    const particles = Array.from({ length: 70 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 2.5 + 0.5,
      dx: (Math.random() - 0.5) * 0.35,
      dy: (Math.random() - 0.5) * 0.35,
      color: ['#F97316','#0EA5E9','#10B981','#F59E0B','#8B5CF6'][Math.floor(Math.random()*5)],
      opacity: Math.random() * 0.35 + 0.05
    }))

    let raf
    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      particles.forEach(p => {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.globalAlpha = p.opacity
        ctx.fill()
        p.x += p.dx; p.y += p.dy
        if (p.x < 0 || p.x > W) p.dx *= -1
        if (p.y < 0 || p.y > H) p.dy *= -1
      })
      ctx.globalAlpha = 1
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dist = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y)
          if (dist < 110) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = '#F97316'
            ctx.globalAlpha = (1 - dist / 110) * 0.07
            ctx.lineWidth = 0.7
            ctx.stroke()
          }
        }
      }
      ctx.globalAlpha = 1
      raf = requestAnimationFrame(draw)
    }
    draw()
    const onResize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight }
    window.addEventListener('resize', onResize)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize) }
  }, [])

  const tiltStyle = {
    transform: `perspective(1200px) rotateY(${mousePos.x * 6}deg) rotateX(${-mousePos.y * 4}deg)`,
    transition: 'transform 0.12s ease',
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #FFFBF7 0%, #FFF7ED 40%, #F0F9FF 100%)', overflowX: 'hidden' }}>
      <LandingVoice />
      <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }} />

      {/* ── Blob decorations ── */}
      <div style={{ position: 'fixed', top: '-120px', right: '-120px', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(249,115,22,0.10) 0%, transparent 70%)', zIndex: 0, transform: `translateY(${scrollY * 0.15}px)`, pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: '-150px', left: '-150px', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(14,165,233,0.08) 0%, transparent 70%)', zIndex: 0, transform: `translateY(${-scrollY * 0.1}px)`, pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', top: '35%', left: '4%', width: 250, height: 250, borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.07) 0%, transparent 70%)', zIndex: 0, pointerEvents: 'none' }} />

      {/* ── Floating shapes ── */}
      {[
        { top: '12%', left: '6%', size: 52, color: '#FED7AA', delay: '0s', shape: 'circle' },
        { top: '72%', left: '4%', size: 36, color: '#BAE6FD', delay: '1.2s', shape: 'square' },
        { top: '18%', right: '8%', size: 64, color: '#A7F3D0', delay: '0.6s', shape: 'circle' },
        { top: '62%', right: '6%', size: 44, color: '#FDE68A', delay: '1.8s', shape: 'triangle' },
        { top: '42%', left: '2%', size: 28, color: '#DDD6FE', delay: '2.4s', shape: 'square' },
        { top: '85%', right: '12%', size: 32, color: '#FECDD3', delay: '0.3s', shape: 'circle' },
      ].map((s, i) => (
        <div key={i} style={{
          position: 'fixed', top: s.top, left: s.left, right: s.right,
          width: s.size, height: s.size,
          borderRadius: s.shape === 'circle' ? '50%' : s.shape === 'square' ? '12px' : '50% 0 50% 0',
          background: s.color, opacity: 0.65,
          animation: `float ${4 + i * 0.4}s ease-in-out ${s.delay} infinite`,
          zIndex: 0, pointerEvents: 'none',
          boxShadow: `0 8px 24px ${s.color}80`
        }} />
      ))}

      {/* ══════════ NAVBAR ══════════ */}
      <nav style={{ position: 'relative', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 48px' }} className="glass-warm">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: 38, height: 38, borderRadius: '11px', background: 'linear-gradient(135deg, #F97316, #F59E0B)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(249,115,22,0.40)', animation: 'glow 3s ease-in-out infinite' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <span style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: '22px', color: 'var(--ink)', letterSpacing: '-0.3px' }}>PathFinder</span>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button onClick={() => navigate('/quiz')} style={{ padding: '10px 24px', borderRadius: 'var(--radius-full)', background: 'transparent', color: 'var(--ink-60)', fontFamily: 'var(--font-head)', fontWeight: 600, fontSize: '14px', border: '1.5px solid var(--ink-20)', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.target.style.borderColor = 'var(--saffron)'; e.target.style.color = 'var(--saffron)' }}
            onMouseLeave={e => { e.target.style.borderColor = 'var(--ink-20)'; e.target.style.color = 'var(--ink-60)' }}>
            Explore
          </button>
          <button onClick={() => navigate('/language')} className="btn-shimmer" style={{ padding: '10px 28px', borderRadius: 'var(--radius-full)', background: 'linear-gradient(135deg, #F97316, #F59E0B)', color: 'white', fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '14px', boxShadow: 'var(--shadow-saffron)', transition: 'all 0.25s', border: 'none' }}
            onMouseEnter={e => { e.target.style.transform = 'translateY(-2px) scale(1.03)'; e.target.style.boxShadow = 'var(--shadow-saffron-lg)' }}
            onMouseLeave={e => { e.target.style.transform = 'translateY(0) scale(1)'; e.target.style.boxShadow = 'var(--shadow-saffron)' }}>
            Get Started →
          </button>
        </div>
      </nav>

      {/* ══════════ HERO ══════════ */}
      <div ref={heroRef} onMouseMove={handleMouseMove} style={{ position: 'relative', zIndex: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '90px 24px 60px', maxWidth: '900px', margin: '0 auto' }}>

        {/* Live badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 20px', borderRadius: 'var(--radius-full)', background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.22)', marginBottom: '36px', animation: 'slideDown 0.7s ease forwards', backdropFilter: 'blur(8px)' }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981', display: 'inline-block', animation: 'pulse-ring 1.8s ease-out infinite', boxShadow: '0 0 0 0 rgba(16,185,129,0.4)' }} />
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: 600, color: 'var(--saffron)', letterSpacing: '0.02em' }}>
            {t('Free for all students · No sign-up needed', 'सभी छात्रों के लिए मुफ़्त · कोई रजिस्ट्रेशन नहीं')}
          </span>
        </div>

        {/* 3D headline */}
        <div style={tiltStyle}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(44px, 7.5vw, 82px)', lineHeight: 1.08, color: 'var(--ink)', marginBottom: '12px', animation: 'slideUp 0.7s 0.1s ease forwards', opacity: 0 }}>
            Discover your path<br />to becoming a
          </h1>

          {/* Animated career word */}
          <div style={{ height: 'clamp(52px, 9vw, 96px)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
            <span className="gradient-text" style={{
              fontFamily: 'var(--font-display)', fontStyle: 'italic',
              fontSize: 'clamp(44px, 7.5vw, 82px)', lineHeight: 1.08,
              transition: 'opacity 0.35s ease, transform 0.35s cubic-bezier(0.22,1,0.36,1)',
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0) scale(1)' : 'translateY(14px) scale(0.95)',
              display: 'inline-block',
              filter: visible ? 'blur(0)' : 'blur(4px)',
            }}>
              {CAREERS[wordIndex]}
            </span>
          </div>
        </div>

        <p style={{ fontSize: 'clamp(16px, 2.5vw, 19px)', lineHeight: 1.75, color: 'var(--ink-60)', maxWidth: '580px', marginBottom: '52px', animation: 'slideUp 0.7s 0.25s ease forwards', opacity: 0, fontWeight: 400 }}>
          {t(
            'AI-powered career guidance built for students in Tier-2 & Tier-3 cities — in your language, matching your budget.',
            'Tier-2 और Tier-3 शहरों के छात्रों के लिए AI करियर मार्गदर्शन — आपकी भाषा में, आपके बजट के अनुसार।'
          )}
        </p>

        {/* CTA buttons */}
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center', animation: 'slideUp 0.7s 0.35s ease forwards', opacity: 0 }}>
          <button onClick={() => navigate('/language')} className="btn-shimmer"
            style={{ padding: '18px 48px', borderRadius: 'var(--radius-full)', background: 'linear-gradient(135deg, #F97316 0%, #F59E0B 100%)', color: 'white', fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '16px', boxShadow: 'var(--shadow-saffron)', transition: 'all 0.3s cubic-bezier(0.22,1,0.36,1)', border: 'none', position: 'relative', overflow: 'hidden' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px) scale(1.03)'; e.currentTarget.style.boxShadow = 'var(--shadow-saffron-lg)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0) scale(1)'; e.currentTarget.style.boxShadow = 'var(--shadow-saffron)' }}>
            🚀 Find My Career Path
          </button>
          <button onClick={() => navigate('/interview')}
            style={{ padding: '18px 40px', borderRadius: 'var(--radius-full)', background: 'rgba(255,255,255,0.85)', color: 'var(--ink)', fontFamily: 'var(--font-head)', fontWeight: 600, fontSize: '16px', border: '1.5px solid var(--ink-20)', boxShadow: 'var(--shadow-sm)', transition: 'all 0.3s cubic-bezier(0.22,1,0.36,1)', backdropFilter: 'blur(12px)' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.borderColor = 'var(--sky)'; e.currentTarget.style.color = 'var(--sky)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'var(--ink-20)'; e.currentTarget.style.color = 'var(--ink)' }}>
            🤖 Try Mock Interview
          </button>
        </div>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: '48px', marginTop: '72px', flexWrap: 'wrap', justifyContent: 'center', animation: 'slideUp 0.7s 0.5s ease forwards', opacity: 0 }}>
          {STATS.map((s, i) => (
            <div key={i} style={{ textAlign: 'center', animation: `countUp 0.6s ${0.6 + i * 0.1}s ease forwards`, opacity: 0 }}>
              <div style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: '32px', color: 'var(--ink)', lineHeight: 1, letterSpacing: '-0.5px' }}>{s.num}</div>
              <div style={{ fontSize: '13px', color: 'var(--ink-60)', marginTop: '5px', fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════ MARQUEE ══════════ */}
      <div style={{ position: 'relative', zIndex: 5, overflow: 'hidden', padding: '16px 0', background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(12px)', borderTop: '1px solid var(--ink-10)', borderBottom: '1px solid var(--ink-10)', marginBottom: '80px' }}>
        <div className="marquee-track">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 24px', marginRight: '8px', background: 'white', borderRadius: 'var(--radius-full)', fontSize: '13px', fontWeight: 600, color: 'var(--ink-60)', fontFamily: 'var(--font-head)', boxShadow: 'var(--shadow-xs)', border: '1px solid var(--ink-10)', whiteSpace: 'nowrap', flexShrink: 0 }}>
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ══════════ FEATURES ══════════ */}
      <div style={{ position: 'relative', zIndex: 5, maxWidth: '1100px', margin: '0 auto', padding: '0 32px 80px' }}>
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 18px', background: 'rgba(14,165,233,0.08)', borderRadius: 'var(--radius-full)', border: '1px solid rgba(14,165,233,0.2)', marginBottom: '16px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--sky)' }}>Everything you need</span>
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4.5vw, 48px)', color: 'var(--ink)', lineHeight: 1.2 }}>
            Your complete career toolkit
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          {FEATURES.map((f, i) => (
            <div key={i} className="card-3d" onClick={() => navigate(f.path)}
              style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: '32px', cursor: 'pointer', border: `1px solid ${f.color}18`, boxShadow: 'var(--shadow-sm)', animation: `slideUp 0.6s ${0.08 * i + 0.1}s ease forwards`, opacity: 0, position: 'relative', overflow: 'hidden' }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 20px 60px ${f.glow}, var(--shadow-md)` }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = 'var(--shadow-sm)' }}>
              {/* BG glow */}
              <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: 120, height: 120, borderRadius: '50%', background: `radial-gradient(circle, ${f.glow} 0%, transparent 70%)`, pointerEvents: 'none' }} />

              <div style={{ width: 56, height: 56, borderRadius: '16px', background: f.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', marginBottom: '20px', border: `1px solid ${f.color}22`, boxShadow: `0 4px 16px ${f.glow}` }}>
                {f.icon}
              </div>

              <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '18px', color: 'var(--ink)', marginBottom: '10px' }}>{f.title}</div>
              <div style={{ fontSize: '14px', color: 'var(--ink-60)', lineHeight: 1.65 }}>{f.desc}</div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '20px', color: f.color, fontFamily: 'var(--font-head)', fontWeight: 600, fontSize: '13px' }}>
                Explore <span style={{ transition: 'transform 0.2s' }}>→</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════ HOW IT WORKS ══════════ */}
      <div style={{ position: 'relative', zIndex: 5, background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(20px)', borderTop: '1px solid var(--ink-10)', borderBottom: '1px solid var(--ink-10)', padding: '80px 32px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(26px, 4vw, 44px)', color: 'var(--ink)' }}>
              How PathAI works
            </h2>
          </div>

          <div style={{ display: 'flex', gap: '0', alignItems: 'stretch', flexWrap: 'wrap', justifyContent: 'center' }}>
            {[
              { num: '01', title: 'Choose Language', desc: 'Hindi or English — we speak your language', icon: '🌐', color: '#F97316' },
              { num: '02', title: 'Take the Quiz', desc: '10 interest questions + your academic profile', icon: '📝', color: '#0EA5E9' },
              { num: '03', title: 'Get AI Results', desc: 'Top 3 career matches with salary & demand data', icon: '✨', color: '#10B981' },
              { num: '04', title: 'Build Your Future', desc: 'Roadmap, skills, colleges & govt schemes', icon: '🚀', color: '#8B5CF6' },
            ].map((step, i) => (
              <div key={i} style={{ flex: '1 1 200px', padding: '32px 24px', textAlign: 'center', position: 'relative', animation: `slideUp 0.6s ${0.1 * i}s ease forwards`, opacity: 0 }}>
                {/* Connector line */}
                {i < 3 && <div style={{ position: 'absolute', top: '52px', right: 0, width: '50%', height: '2px', background: `linear-gradient(to right, ${step.color}44, transparent)` }} />}

                <div style={{ width: 64, height: 64, borderRadius: '50%', background: `linear-gradient(135deg, ${step.color}18, ${step.color}30)`, border: `2px solid ${step.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '28px', boxShadow: `0 8px 24px ${step.color}25` }}>
                  {step.icon}
                </div>
                <div style={{ fontFamily: 'var(--font-head)', fontSize: '11px', fontWeight: 700, color: step.color, letterSpacing: '0.08em', marginBottom: '8px' }}>STEP {step.num}</div>
                <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '17px', color: 'var(--ink)', marginBottom: '8px' }}>{step.title}</div>
                <div style={{ fontSize: '13px', color: 'var(--ink-60)', lineHeight: 1.6 }}>{step.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════ CTA SECTION ══════════ */}
      <div style={{ position: 'relative', zIndex: 5, padding: '100px 32px', textAlign: 'center' }}>
        <div style={{ maxWidth: '640px', margin: '0 auto', padding: '64px', background: 'linear-gradient(135deg, #FFF7ED, #F0F9FF)', borderRadius: 'var(--radius-2xl)', border: '1px solid var(--ink-10)', boxShadow: 'var(--shadow-xl)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(to right, #F97316, #F59E0B, #0EA5E9, #10B981)' }} />

          <div style={{ fontSize: '48px', marginBottom: '20px' }}>🇮🇳</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(26px, 4vw, 40px)', color: 'var(--ink)', marginBottom: '16px', lineHeight: 1.2 }}>
            Built for <span className="gradient-text">Bharat's</span> next<br />generation
          </h2>
          <p style={{ fontSize: '16px', color: 'var(--ink-60)', lineHeight: 1.7, marginBottom: '36px' }}>
            {t(
              'Whether you\'re from Mathura, Gorakhpur, Nashik or Coimbatore — your career deserves the same guidance as students in metro cities.',
              'चाहे आप मथुरा, गोरखपुर, नाशिक या कोयंबटूर से हों — आपका करियर भी उतना ही महत्वपूर्ण है।'
            )}
          </p>

          <button onClick={() => navigate('/language')} className="btn-shimmer"
            style={{ padding: '18px 56px', borderRadius: 'var(--radius-full)', background: 'linear-gradient(135deg, #F97316 0%, #F59E0B 100%)', color: 'white', fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '17px', boxShadow: 'var(--shadow-saffron)', transition: 'all 0.3s', border: 'none', display: 'inline-block' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px) scale(1.04)'; e.currentTarget.style.boxShadow = 'var(--shadow-saffron-lg)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0) scale(1)'; e.currentTarget.style.boxShadow = 'var(--shadow-saffron)' }}>
            Start Your Journey — It's Free →
          </button>

          <div style={{ marginTop: '24px', fontSize: '13px', color: 'var(--ink-40)' }}>
            No login required · Results in under 2 minutes · Hindi & English
          </div>
        </div>
      </div>

      {/* ══════════ FOOTER ══════════ */}
      <footer style={{ position: 'relative', zIndex: 5, borderTop: '1px solid var(--ink-10)', padding: '32px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', background: 'rgba(255,251,247,0.8)', backdropFilter: 'blur(16px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: 28, height: 28, borderRadius: '8px', background: 'linear-gradient(135deg, #F97316, #F59E0B)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <span style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '16px', color: 'var(--ink)' }}>PathAI</span>
        </div>
        <span style={{ fontSize: '13px', color: 'var(--ink-40)' }}>Built for Bharat · AI Career Counsellor · Hackathon 2026</span>
        <div style={{ display: 'flex', gap: '20px' }}>
          {['Quiz', 'Interview', 'Colleges', 'Schemes'].map(l => (
            <button key={l} onClick={() => navigate('/' + l.toLowerCase())} style={{ background: 'none', border: 'none', fontSize: '13px', color: 'var(--ink-40)', cursor: 'pointer', transition: 'color 0.2s', padding: 0 }}
              onMouseEnter={e => e.target.style.color = 'var(--saffron)'}
              onMouseLeave={e => e.target.style.color = 'var(--ink-40)'}>{l}</button>
          ))}
        </div>
      </footer>
    </div>
  )
}