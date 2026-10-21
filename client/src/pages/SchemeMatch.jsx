import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import { schemes } from '../data/questions'

export default function SchemeMatch() {
  const navigate = useNavigate()
  const { academicData, t } = useUser()
  const [expanded, setExpanded] = useState(null)

  const matched = schemes.filter(s => {
    const catMatch = s.category.includes('all') || s.category.includes(academicData?.category || 'general')
    const incomeMatch = !academicData?.income || parseInt(academicData.income) <= s.income
    return catMatch && incomeMatch
  })

  const colors = ['#F97316','#0EA5E9','#10B981','#F59E0B','#8B5CF6','#EC4899','#14B8A6','#F43F5E']
  const bgs = ['#FFF7ED','#F0F9FF','#ECFDF5','#FFFBEB','#F5F3FF','#FFF0F3','#F0FDFA','#FFF1F2']

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #FFFBF7, #ECFDF5 40%, #F0F9FF)', overflow: 'hidden' }}>
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '40px 24px' }}>

        {/* Header */}
        <div style={{ marginBottom: '40px', animation: 'slideUp 0.5s ease forwards' }}>
          <button onClick={() => navigate('/skillgap')} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: 'var(--ink-60)', fontSize: '14px', cursor: 'pointer', marginBottom: '20px', padding: 0 }}>
            ← {t('Back', 'वापस')}
          </button>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 20px', background: 'rgba(16,185,129,0.08)', borderRadius: 'var(--radius-full)', border: '1px solid rgba(16,185,129,0.2)', marginBottom: '16px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--green)' }}>🏛️ {matched.length} {t('schemes matched for you', 'योजनाएं आपके लिए मिलीं')}</span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 4vw, 38px)', color: 'var(--ink)', marginBottom: '8px' }}>
            {t('Government Schemes', 'सरकारी योजनाएं')}
          </h1>
          <p style={{ fontSize: '15px', color: 'var(--ink-60)' }}>
            {t('Scholarships and programs you are eligible for', 'आप जिन छात्रवृत्तियों और कार्यक्रमों के लिए पात्र हैं')}
          </p>
        </div>

        {/* Scheme cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {matched.map((scheme, i) => {
            const isExpanded = expanded === i
            const c = colors[i % colors.length]
            const bg = bgs[i % bgs.length]
            return (
              <div key={i} style={{ background: 'white', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-sm)', border: `1px solid ${c}20`, overflow: 'hidden', transition: 'all 0.3s', animation: `slideUp 0.5s ${i * 0.07}s ease forwards`, opacity: 0 }}>
                <div style={{ height: '3px', background: `linear-gradient(to right, ${c}, ${c}55)` }} />
                <div style={{ padding: '20px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
                        <h3 style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '16px', color: 'var(--ink)' }}>{scheme.name}</h3>
                        <span style={{ fontSize: '11px', padding: '3px 10px', background: bg, color: c, borderRadius: 'var(--radius-full)', fontWeight: 600, border: `1px solid ${c}33` }}>
                          ✓ {t('Eligible', 'पात्र')}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '18px' }}>💰</span>
                        <span style={{ fontSize: '15px', fontWeight: 600, color: c }}>{scheme.benefit}</span>
                      </div>
                    </div>
                    <button onClick={() => setExpanded(isExpanded ? null : i)} style={{ width: 32, height: 32, borderRadius: '50%', background: bg, border: `1px solid ${c}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, transition: 'all 0.2s', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </button>
                  </div>

                  {/* Expanded details */}
                  {isExpanded && (
                    <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: `1px solid ${c}15`, animation: 'slideUp 0.3s ease forwards' }}>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
                        {scheme.category.map((cat, ci) => (
                          <span key={ci} style={{ fontSize: '12px', padding: '4px 12px', background: bg, color: c, borderRadius: 'var(--radius-full)', fontWeight: 500 }}>{cat.toUpperCase()}</span>
                        ))}
                        <span style={{ fontSize: '12px', padding: '4px 12px', background: '#F0FDF4', color: '#16A34A', borderRadius: 'var(--radius-full)', fontWeight: 500 }}>
                          {t('Income limit:', 'आय सीमा:')} ₹{(scheme.income / 100000).toFixed(1)}L
                        </span>
                      </div>
                      <a href={scheme.link} target="_blank" rel="noopener noreferrer"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px', background: c, color: 'white', borderRadius: 'var(--radius-full)', fontSize: '14px', fontWeight: 600, fontFamily: 'var(--font-head)', transition: 'all 0.2s', textDecoration: 'none' }}>
                        {t('Apply Now', 'अभी आवेदन करें')} →
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        <div style={{ marginTop: '32px', display: 'flex', gap: '16px' }}>
          <button onClick={() => navigate('/interview')} style={{ flex: 1, padding: '14px', borderRadius: 'var(--radius-full)', background: 'linear-gradient(135deg, #F97316, #F59E0B)', color: 'white', border: 'none', fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '15px', cursor: 'pointer', boxShadow: 'var(--shadow-saffron)' }}>
            {t('Practice Interview →', 'इंटरव्यू अभ्यास →')}
          </button>
        </div>
      </div>
    </div>
  )
}
