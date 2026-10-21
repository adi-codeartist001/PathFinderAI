import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useUser } from '../context/UserContext'

const STEPS = [
  { path: '/quiz',      label: 'Quiz',      icon: '🎯', step: 1 },
  { path: '/academic',  label: 'Profile',   icon: '📋', step: 2 },
  { path: '/result',    label: 'Careers',   icon: '✨', step: 3 },
  { path: '/roadmap',   label: 'Roadmap',   icon: '🗺️', step: 4 },
  { path: '/skillgap',  label: 'Skills',    icon: '📊', step: 5 },
  { path: '/colleges',  label: 'Colleges',  icon: '🎓', step: 6 },
  { path: '/schemes',   label: 'Schemes',   icon: '🏛️', step: 7 },
  { path: '/interview', label: 'Interview', icon: '🤖', step: 8 },
]

const HIDE_ON = ['/', '/language']

export default function ProgressNav() {
  const navigate = useNavigate()
  const location = useLocation()
  const { selectedCareer, language, setLanguage, t } = useUser()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [exportToast, setExportToast] = useState(false)

  if (HIDE_ON.includes(location.pathname)) return null

  const currentIndex = STEPS.findIndex(s => s.path === location.pathname)
  const progress = currentIndex >= 0 ? ((currentIndex + 1) / STEPS.length) * 100 : 0

  const handleExportPDF = () => {
    setExportToast(true)
    setTimeout(() => setExportToast(false), 3000)
    window.print()
  }

  const toggleLang = () => setLanguage(language === 'en' ? 'hi' : 'en')

  return (
    <>
      {/* ── Export toast ── */}
      {exportToast && (
        <div style={{ position: 'fixed', bottom: '24px', right: '24px', padding: '14px 20px', background: '#10B981', color: 'white', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-green)', zIndex: 999, fontFamily: 'var(--font-head)', fontWeight: 600, fontSize: '14px', animation: 'slideUp 0.4s ease forwards', display: 'flex', alignItems: 'center', gap: '8px' }}>
          ✅ Preparing PDF for parents...
        </div>
      )}

      {/* ── Nav ── */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(255,251,247,0.94)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(249,115,22,0.10)',
      }}>
        {/* Progress bar at very top */}
        <div style={{ height: '3px', background: 'var(--ink-10)', position: 'relative' }}>
          <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${progress}%`, background: 'linear-gradient(to right, #F97316, #F59E0B)', transition: 'width 0.6s cubic-bezier(0.22,1,0.36,1)', borderRadius: '0 2px 2px 0' }} />
        </div>

        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>

          {/* Logo */}
          <div onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: '7px', cursor: 'pointer', flexShrink: 0 }}>
            <div style={{ width: 30, height: 30, borderRadius: '9px', background: 'linear-gradient(135deg, #F97316, #F59E0B)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 3px 8px rgba(249,115,22,0.30)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <span style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: '17px', color: 'var(--ink)' }}>PathAI</span>
          </div>

          {/* Step pills — desktop */}
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '2px', justifyContent: 'center', overflow: 'hidden' }}
            className="desktop-steps">
            {STEPS.map((step, i) => {
              const isDone = i < currentIndex
              const isCurrent = i === currentIndex
              const isLocked = i > currentIndex + 1

              return (
                <div key={step.path} style={{ display: 'flex', alignItems: 'center' }}>
                  <button
                    onClick={() => !isLocked && navigate(step.path)}
                    title={step.label}
                    style={{
                      height: 32,
                      minWidth: isCurrent ? 88 : 32,
                      width: isCurrent ? undefined : 32,
                      borderRadius: 'var(--radius-full)',
                      border: 'none',
                      background: isCurrent
                        ? 'linear-gradient(135deg, #F97316, #F59E0B)'
                        : isDone ? '#ECFDF5' : 'var(--ink-10)',
                      color: isCurrent ? 'white' : isDone ? '#10B981' : 'var(--ink-40)',
                      cursor: isLocked ? 'default' : 'pointer',
                      transition: 'all 0.35s cubic-bezier(0.22,1,0.36,1)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      gap: '5px',
                      fontSize: '13px',
                      fontFamily: 'var(--font-head)',
                      fontWeight: 600,
                      boxShadow: isCurrent ? '0 4px 12px rgba(249,115,22,0.30)' : 'none',
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      padding: isCurrent ? '0 12px' : '0',
                      opacity: isLocked ? 0.3 : 1,
                      flexShrink: 0,
                    }}>
                    {isDone
                      ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      : <span style={{ fontSize: isCurrent ? '13px' : '12px', lineHeight: 1 }}>{step.icon}</span>
                    }
                    {isCurrent && <span style={{ fontSize: '12px' }}>{step.label}</span>}
                  </button>

                  {i < STEPS.length - 1 && (
                    <div style={{ width: 10, height: 2, background: i < currentIndex ? '#10B981' : 'var(--ink-20)', transition: 'background 0.4s', flexShrink: 0 }} />
                  )}
                </div>
              )
            })}
          </div>

          {/* Right actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            {/* Language toggle */}
            <button onClick={toggleLang}
              style={{ padding: '6px 12px', borderRadius: 'var(--radius-full)', background: 'var(--ink-10)', border: 'none', fontSize: '12px', fontFamily: 'var(--font-head)', fontWeight: 600, color: 'var(--ink-60)', cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.target.style.background = 'rgba(249,115,22,0.1)'; e.target.style.color = 'var(--saffron)' }}
              onMouseLeave={e => { e.target.style.background = 'var(--ink-10)'; e.target.style.color = 'var(--ink-60)' }}
              title="Switch language">
              {language === 'en' ? '🇮🇳 हिं' : '🇬🇧 EN'}
            </button>

            {/* Parent mode PDF */}
            {selectedCareer && (
              <button onClick={handleExportPDF}
                data-tooltip="Export for parents"
                style={{ padding: '6px 12px', borderRadius: 'var(--radius-full)', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', fontSize: '12px', fontFamily: 'var(--font-head)', fontWeight: 600, color: '#10B981', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M7 21H17C18.1 21 19 20.1 19 19V8L14 3H7C5.9 3 5 3.9 5 5V19C5 20.1 5.9 21 7 21Z" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M13 3V9H19" stroke="#10B981" strokeWidth="2" strokeLinecap="round"/></svg>
                PDF
              </button>
            )}

            {/* Selected career tag */}
            {selectedCareer && (
              <div style={{ padding: '5px 12px', background: 'rgba(249,115,22,0.08)', borderRadius: 'var(--radius-full)', border: '1px solid rgba(249,115,22,0.2)' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--saffron)', whiteSpace: 'nowrap', fontFamily: 'var(--font-head)', maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}>
                  {selectedCareer.career}
                </span>
              </div>
            )}

            {/* Mobile hamburger */}
            <button onClick={() => setMobileOpen(!mobileOpen)}
              style={{ width: 32, height: 32, borderRadius: 'var(--radius-sm)', background: 'var(--ink-10)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d={mobileOpen ? "M18 6L6 18M6 6l12 12" : "M3 12h18M3 6h18M3 18h18"} stroke="var(--ink-60)" strokeWidth="2" strokeLinecap="round"/></svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div style={{ background: 'white', borderTop: '1px solid var(--ink-10)', padding: '12px 20px 16px', animation: 'slideDown 0.25s ease forwards' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
              {STEPS.map((step, i) => {
                const isDone = i < currentIndex
                const isCurrent = i === currentIndex
                const isLocked = i > currentIndex + 1
                return (
                  <button key={step.path}
                    onClick={() => { if (!isLocked) { navigate(step.path); setMobileOpen(false) } }}
                    style={{ padding: '10px 6px', borderRadius: 'var(--radius-md)', border: 'none', background: isCurrent ? 'linear-gradient(135deg, #F97316, #F59E0B)' : isDone ? '#ECFDF5' : 'var(--ink-10)', color: isCurrent ? 'white' : isDone ? '#10B981' : 'var(--ink-40)', fontFamily: 'var(--font-head)', fontWeight: 600, fontSize: '11px', cursor: isLocked ? 'default' : 'pointer', opacity: isLocked ? 0.3 : 1, textAlign: 'center' }}>
                    <div style={{ fontSize: '18px', marginBottom: '3px' }}>{isDone ? '✓' : step.icon}</div>
                    {step.label}
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </>
  )
}