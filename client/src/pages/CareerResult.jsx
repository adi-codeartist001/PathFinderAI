import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import { useGroq } from '../hooks/useGroq'

const DUMMY_RESULTS = [
  { career: "Software Engineer", match: 92, salary: "₹4–18 LPA", demand: "High", reason: "Your analytical mind and interest in tech make this a perfect fit.", icon: "💻", color: "#0EA5E9", bg: "#F0F9FF" },
  { career: "Data Analyst", match: 84, salary: "₹4–12 LPA", demand: "High", reason: "Strong with numbers and pattern-finding, this path suits you well.", icon: "📊", color: "#10B981", bg: "#ECFDF5" },
  { career: "Product Manager", match: 71, salary: "₹8–25 LPA", demand: "Medium", reason: "Your blend of people skills and logical thinking works great here.", icon: "🚀", color: "#F59E0B", bg: "#FFFBEB" },
]

export default function CareerResult() {
  const navigate = useNavigate()
  const { quizAnswers, academicData, setCareerResults, setSelectedCareer, userName, t } = useUser()
  const { call, loading } = useGroq()
  const [results, setResults] = useState(null)
  const [selectedIndex, setSelectedIndex] = useState(null)
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    const fetch = async () => {
      if (!academicData) { setResults(DUMMY_RESULTS); return }
      const data = await call('career-suggest', { interests: quizAnswers, ...academicData })
      if (data?.careers) { setResults(data.careers); setCareerResults(data.careers) }
      else setResults(DUMMY_RESULTS)
    }
    fetch()
  }, [])

  const handleSelect = (career, i) => {
    setSelectedIndex(i)
    setSelectedCareer(career)
    setShowConfetti(true)
    setTimeout(() => navigate('/roadmap'), 1200)
  }

  if (loading || !results) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #FFFBF7, #FFF7ED, #F0F9FF)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '24px' }}>
        <div style={{ position: 'relative', width: 80, height: 80 }}>
          <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '3px solid #FED7AA', animation: 'spin-slow 1s linear infinite' }} />
          <div style={{ position: 'absolute', inset: '8px', borderRadius: '50%', border: '3px solid transparent', borderTopColor: '#F97316', animation: 'spin-slow 0.6s linear infinite' }} />
          <div style={{ position: 'absolute', inset: '50%', transform: 'translate(-50%,-50%)', fontSize: '28px' }}>🤖</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: 'var(--ink)', marginBottom: '8px' }}>
            {t('Analyzing your profile...', 'आपकी प्रोफ़ाइल का विश्लेषण हो रहा है...')}
          </h3>
          <p style={{ fontSize: '14px', color: 'var(--ink-60)' }}>
            {t('AI is finding your perfect career matches', 'AI आपके लिए सही करियर ढूंढ रहा है')}
          </p>
        </div>
        {['Analyzing interests...', 'Matching career paths...', 'Calculating compatibility...'].map((msg, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: 'white', borderRadius: 'var(--radius-full)', boxShadow: 'var(--shadow-sm)', animation: `fadeIn 0.5s ${i * 0.3}s ease forwards`, opacity: 0 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#F97316', animation: 'bounce-soft 1s ease infinite' }} />
            <span style={{ fontSize: '13px', color: 'var(--ink-60)' }}>{msg}</span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #FFFBF7, #FFF7ED 30%, #F0F9FF 80%)', position: 'relative', overflow: 'hidden' }}>

      {/* Confetti */}
      {showConfetti && (
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 50 }}>
          {Array.from({ length: 40 }).map((_, i) => (
            <div key={i} style={{
              position: 'absolute', top: '-20px', left: `${Math.random() * 100}%`,
              width: `${Math.random() * 8 + 4}px`, height: `${Math.random() * 8 + 4}px`,
              borderRadius: Math.random() > 0.5 ? '50%' : '2px',
              background: ['#F97316','#0EA5E9','#10B981','#F59E0B','#F43F5E'][i % 5],
              animation: `slideUp ${Math.random() * 0.5 + 0.5}s ${Math.random() * 0.3}s ease forwards`,
              transform: `rotate(${Math.random() * 360}deg)`
            }} />
          ))}
        </div>
      )}

      {/* BG blobs */}
      <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle, rgba(249,115,22,0.07), transparent)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '40px 24px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px', animation: 'slideUp 0.5s ease forwards' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 20px', background: 'rgba(16,185,129,0.08)', borderRadius: 'var(--radius-full)', border: '1px solid rgba(16,185,129,0.2)', marginBottom: '20px' }}>
            <span style={{ fontSize: '14px' }}>✨</span>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--green)' }}>{t('Your results are ready!', 'आपके परिणाम तैयार हैं!')}</span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 5vw, 44px)', color: 'var(--ink)', lineHeight: 1.2, marginBottom: '12px' }}>
            {t(`Here are your top career matches`, `${userName ? userName + ', ' : ''}आपके शीर्ष करियर मिलान`)}
            {userName && <span style={{ display: 'block', fontStyle: 'italic', color: 'var(--saffron)' }}>{userName}</span>}
          </h1>
          <p style={{ fontSize: '15px', color: 'var(--ink-60)' }}>
            {t('Based on your interests and academic profile', 'आपकी रुचियों और शैक्षणिक प्रोफ़ाइल के आधार पर')}
          </p>
        </div>

        {/* Career cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {results.map((career, i) => {
            const isSelected = selectedIndex === i
            const c = career.color || ['#0EA5E9','#10B981','#F59E0B'][i]
            const bg = career.bg || ['#F0F9FF','#ECFDF5','#FFFBEB'][i]
            return (
              <div key={i} style={{ background: 'white', borderRadius: 'var(--radius-xl)', border: `2px solid ${isSelected ? c : 'transparent'}`, boxShadow: isSelected ? `0 16px 48px ${c}25` : 'var(--shadow-md)', transition: 'all 0.3s', transform: isSelected ? 'scale(1.02)' : 'scale(1)', animation: `slideUp 0.5s ${0.1 * i + 0.2}s ease forwards`, opacity: 0, overflow: 'hidden' }}>

                {/* Top accent bar */}
                <div style={{ height: '4px', background: `linear-gradient(to right, ${c}, ${c}88)` }} />

                <div style={{ padding: '28px 32px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>

                    {/* Left */}
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                        <div style={{ width: 48, height: 48, borderRadius: '14px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', border: `1px solid ${c}22` }}>
                          {career.icon || ['💻','📊','🚀'][i]}
                        </div>
                        <div>
                          <h3 style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '20px', color: 'var(--ink)' }}>{career.career}</h3>
                          <div style={{ display: 'flex', gap: '8px', marginTop: '4px', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '12px', padding: '3px 10px', background: bg, color: c, borderRadius: 'var(--radius-full)', fontWeight: 600, border: `1px solid ${c}33` }}>
                              {career.salary}
                            </span>
                            <span style={{ fontSize: '12px', padding: '3px 10px', background: career.demand === 'High' ? '#ECFDF5' : '#FFFBEB', color: career.demand === 'High' ? '#10B981' : '#F59E0B', borderRadius: 'var(--radius-full)', fontWeight: 600 }}>
                              {career.demand} {t('Demand', 'मांग')}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p style={{ fontSize: '14px', color: 'var(--ink-60)', lineHeight: 1.6 }}>{career.reason}</p>
                    </div>

                    {/* Match meter */}
                    <div style={{ textAlign: 'center', minWidth: '80px' }}>
                      <div style={{ position: 'relative', width: 72, height: 72, margin: '0 auto 8px' }}>
                        <svg viewBox="0 0 72 72" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
                          <circle cx="36" cy="36" r="30" fill="none" stroke="#F5F5F4" strokeWidth="6" />
                          <circle cx="36" cy="36" r="30" fill="none" stroke={c} strokeWidth="6"
                            strokeDasharray={`${2 * Math.PI * 30}`}
                            strokeDashoffset={`${2 * Math.PI * 30 * (1 - career.match / 100)}`}
                            strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s ease' }} />
                        </svg>
                        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: '16px', color: c }}>{career.match}%</span>
                        </div>
                      </div>
                      <span style={{ fontSize: '11px', color: 'var(--ink-60)', fontWeight: 500 }}>{t('Match', 'मिलान')}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleSelect(career, i)}
                    style={{ marginTop: '20px', width: '100%', padding: '14px', borderRadius: 'var(--radius-full)', background: isSelected ? c : bg, color: isSelected ? 'white' : c, border: `1.5px solid ${c}`, fontFamily: 'var(--font-head)', fontWeight: 600, fontSize: '15px', cursor: 'pointer', transition: 'all 0.25s' }}
                    onMouseEnter={e => { e.target.style.background = c; e.target.style.color = 'white' }}
                    onMouseLeave={e => { if (!isSelected) { e.target.style.background = bg; e.target.style.color = c }}}
                  >
                    {isSelected ? t('✓ Selected! Loading roadmap...', '✓ चुना गया! रोडमैप लोड हो रहा है...') : t('Choose This Path →', 'यह पथ चुनें →')}
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Bottom tip */}
        <div style={{ marginTop: '32px', padding: '20px', background: 'rgba(249,115,22,0.05)', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(249,115,22,0.12)', textAlign: 'center' }}>
          <p style={{ fontSize: '14px', color: 'var(--ink-60)', lineHeight: 1.6 }}>
            💡 {t('Choose any path to see your personalized roadmap, skill gaps, college options and government schemes.', 'किसी भी पथ को चुनें और अपना व्यक्तिगत रोडमैप, कौशल अंतर, कॉलेज विकल्प और सरकारी योजनाएं देखें।')}
          </p>
        </div>
      </div>
    </div>
  )
}
