import { useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import { useState } from 'react'

export default function LanguageSelect() {
  const navigate = useNavigate()
  const { setLanguage } = useUser()
  const [selected, setSelected] = useState(null)
  const [animating, setAnimating] = useState(false)

  const choose = (lang) => {
    setSelected(lang)
    setAnimating(true)
    setLanguage(lang)
    setTimeout(() => navigate('/quiz'), 600)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #FFFBF7 0%, #FFF7ED 50%, #ECFDF5 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', position: 'relative', overflow: 'hidden' }}>

      {/* BG blobs */}
      <div style={{ position: 'absolute', top: '10%', right: '5%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(249,115,22,0.08), transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '10%', left: '5%', width: 250, height: 250, borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.08), transparent 70%)', pointerEvents: 'none' }} />

      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '56px', animation: 'slideUp 0.5s ease forwards' }}>
        <div style={{ width: 40, height: 40, borderRadius: '12px', background: 'linear-gradient(135deg, #F97316, #F59E0B)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(249,115,22,0.3)' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <span style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: '24px', color: 'var(--ink)' }}>PathFinder</span>
      </div>

      {/* Heading */}
      <div style={{ textAlign: 'center', marginBottom: '48px', animation: 'slideUp 0.5s 0.1s ease forwards', opacity: 0 }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 5vw, 44px)', color: 'var(--ink)', marginBottom: '12px', lineHeight: 1.2 }}>
          Choose your language
        </h2>
        <p style={{ fontSize: '15px', color: 'var(--ink-60)', fontWeight: 400 }}>
          अपनी भाषा चुनें • Choose your language
        </p>
      </div>

      {/* Cards */}
      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', justifyContent: 'center', animation: 'slideUp 0.5s 0.2s ease forwards', opacity: 0 }}>
        {[
          {
            lang: 'en', flag: '🇬🇧', primary: 'English', secondary: 'Continue in English',
            color: '#0EA5E9', bg: 'linear-gradient(135deg, #F0F9FF, #E0F2FE)', border: 'rgba(14,165,233,0.25)'
          },
          {
            lang: 'hi', flag: '🇮🇳', primary: 'हिंदी', secondary: 'हिंदी में जारी रखें',
            color: '#F97316', bg: 'linear-gradient(135deg, #FFF7ED, #FED7AA44)', border: 'rgba(249,115,22,0.25)'
          },
        ].map((opt) => (
          <button
            key={opt.lang}
            onClick={() => choose(opt.lang)}
            style={{
              width: '220px', padding: '36px 24px', borderRadius: 'var(--radius-xl)',
              background: selected === opt.lang ? opt.color : opt.bg,
              border: `2px solid ${selected === opt.lang ? opt.color : opt.border}`,
              cursor: 'pointer', transition: 'all 0.25s',
              transform: selected === opt.lang ? 'scale(1.05)' : 'scale(1)',
              boxShadow: selected === opt.lang ? `0 16px 40px ${opt.color}40` : 'var(--shadow-sm)',
              textAlign: 'center'
            }}
            onMouseEnter={e => { if (selected !== opt.lang) { e.currentTarget.style.transform = 'translateY(-6px) scale(1.02)'; e.currentTarget.style.boxShadow = `0 16px 32px ${opt.color}25` }}}
            onMouseLeave={e => { if (selected !== opt.lang) { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)' }}}
          >
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>{opt.flag}</div>
            <div style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: '28px', color: selected === opt.lang ? 'white' : 'var(--ink)', marginBottom: '8px', transition: 'color 0.25s' }}>{opt.primary}</div>
            <div style={{ fontSize: '13px', color: selected === opt.lang ? 'rgba(255,255,255,0.8)' : 'var(--ink-60)', transition: 'color 0.25s' }}>{opt.secondary}</div>
          </button>
        ))}
      </div>

      <p style={{ marginTop: '40px', fontSize: '13px', color: 'var(--ink-40)', animation: 'fadeIn 0.5s 0.5s ease forwards', opacity: 0 }}>
        You can change this anytime • आप इसे बाद में बदल सकते हैं
      </p>
    </div>
  )
}
