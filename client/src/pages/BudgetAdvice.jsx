import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import { useGroq } from '../hooks/useGroq'

const FALLBACK = {
  totalCost: "₹0–₹30,000",
  timeline: "6–12 months",
  freeOptions: ["freeCodeCamp.org — 100% free full-stack curriculum", "NPTEL courses — Free with optional paid certificate", "YouTube: full courses by Indian educators"],
  paidOptions: ["Udemy courses on sale — ₹399–₹799 each", "Coursera with financial aid — effectively free"],
  loanOptions: ["Vidyalakshmi Portal — loans up to ₹7.5L without collateral", "PM YASASVI Scheme — up to ₹1.25L/year for OBC/EWS"],
  tip: "Start 100% free for 6 months. Only spend money after your first paid internship or freelance project."
}

export default function BudgetAdvice() {
  const navigate = useNavigate()
  const { academicData, selectedCareer, t } = useUser()
  const { call, loading } = useGroq()
  const [advice, setAdvice] = useState(null)

  useEffect(() => {
    const fetch = async () => {
      const data = await call('budget', {
        career: selectedCareer?.career || 'Software Engineer',
        income: academicData?.income,
        city: academicData?.city
      })
      setAdvice(data || FALLBACK)
    }
    fetch()
  }, [])

  if (loading || !advice) return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg,#FFFBF7,#FFF7ED,#F0F9FF)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px' }}>
      <div style={{ width: 44, height: 44, borderRadius: '50%', border: '3px solid transparent', borderTopColor: '#F97316', animation: 'spin-slow 0.8s linear infinite' }} />
      <span style={{ fontSize: '15px', color: 'var(--ink-60)' }}>{t('Calculating your budget plan...', 'बजट योजना बना रहे हैं...')}</span>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg,#FFFBF7,#FFFBEB 30%,#F0F9FF)', overflow: 'hidden' }}>
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '40px 24px' }}>

        <div style={{ marginBottom: '32px', animation: 'slideUp 0.5s ease forwards' }}>
          <button onClick={() => navigate('/schemes')} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: 'var(--ink-60)', fontSize: '14px', cursor: 'pointer', marginBottom: '16px', padding: 0 }}>
            ← {t('Back', 'वापस')}
          </button>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px,4vw,38px)', color: 'var(--ink)', marginBottom: '8px' }}>
            {t('Budget-Aware Career Plan', 'बजट के अनुसार करियर योजना')}
          </h1>
          <p style={{ fontSize: '15px', color: 'var(--ink-60)' }}>
            {t('Customised for your family income', 'आपकी पारिवारिक आय के अनुसार')}
          </p>
        </div>

        {/* Summary stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px', animation: 'slideUp 0.5s 0.1s ease forwards', opacity: 0 }}>
          <div style={{ padding: '24px', background: 'linear-gradient(135deg,#FFFBEB,#FEF3C7)', borderRadius: 'var(--radius-xl)', border: '1px solid rgba(245,158,11,0.2)', textAlign: 'center' }}>
            <div style={{ fontSize: '28px', marginBottom: '8px' }}>💰</div>
            <div style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: '20px', color: '#F59E0B' }}>{advice.totalCost}</div>
            <div style={{ fontSize: '12px', color: 'var(--ink-60)', marginTop: '4px' }}>{t('Estimated total cost', 'अनुमानित कुल लागत')}</div>
          </div>
          <div style={{ padding: '24px', background: 'linear-gradient(135deg,#ECFDF5,#D1FAE5)', borderRadius: 'var(--radius-xl)', border: '1px solid rgba(16,185,129,0.2)', textAlign: 'center' }}>
            <div style={{ fontSize: '28px', marginBottom: '8px' }}>⏱️</div>
            <div style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: '20px', color: '#10B981' }}>{advice.timeline}</div>
            <div style={{ fontSize: '12px', color: 'var(--ink-60)', marginTop: '4px' }}>{t('Time to first job', 'पहली नौकरी तक')}</div>
          </div>
        </div>

        {/* Free options */}
        <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: '28px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--ink-10)', marginBottom: '16px', animation: 'slideUp 0.5s 0.2s ease forwards', opacity: 0 }}>
          <h3 style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '16px', color: 'var(--ink)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ padding: '4px 12px', background: '#ECFDF5', color: '#10B981', borderRadius: 'var(--radius-full)', fontSize: '12px', fontWeight: 700 }}>FREE</span>
            {t('100% Free Options', '100% मुफ़्त विकल्प')}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {advice.freeOptions?.map((opt, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '14px 16px', background: '#F0FDF4', borderRadius: 'var(--radius-md)', border: '1px solid rgba(16,185,129,0.15)' }}>
                <span style={{ fontSize: '16px', flexShrink: 0 }}>✅</span>
                <span style={{ fontSize: '14px', color: 'var(--ink)', lineHeight: 1.5 }}>{opt}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Paid options */}
        <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: '28px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--ink-10)', marginBottom: '16px', animation: 'slideUp 0.5s 0.3s ease forwards', opacity: 0 }}>
          <h3 style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '16px', color: 'var(--ink)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ padding: '4px 12px', background: '#FFF7ED', color: '#F97316', borderRadius: 'var(--radius-full)', fontSize: '12px', fontWeight: 700 }}>BUDGET</span>
            {t('Affordable Paid Options', 'किफ़ायती भुगतान विकल्प')}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {advice.paidOptions?.map((opt, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '14px 16px', background: '#FFF7ED', borderRadius: 'var(--radius-md)', border: '1px solid rgba(249,115,22,0.15)' }}>
                <span style={{ fontSize: '16px', flexShrink: 0 }}>💡</span>
                <span style={{ fontSize: '14px', color: 'var(--ink)', lineHeight: 1.5 }}>{opt}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Loan options */}
        <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: '28px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--ink-10)', marginBottom: '16px', animation: 'slideUp 0.5s 0.35s ease forwards', opacity: 0 }}>
          <h3 style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '16px', color: 'var(--ink)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ padding: '4px 12px', background: '#F0F9FF', color: '#0EA5E9', borderRadius: 'var(--radius-full)', fontSize: '12px', fontWeight: 700 }}>LOAN/AID</span>
            {t('Loans & Financial Aid', 'ऋण और वित्तीय सहायता')}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {advice.loanOptions?.map((opt, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '14px 16px', background: '#F0F9FF', borderRadius: 'var(--radius-md)', border: '1px solid rgba(14,165,233,0.15)' }}>
                <span style={{ fontSize: '16px', flexShrink: 0 }}>🏦</span>
                <span style={{ fontSize: '14px', color: 'var(--ink)', lineHeight: 1.5 }}>{opt}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pro tip */}
        <div style={{ padding: '24px', background: 'linear-gradient(135deg,#FFF7ED,#FFFBEB)', borderRadius: 'var(--radius-xl)', border: '1px solid rgba(249,115,22,0.2)', marginBottom: '24px', animation: 'slideUp 0.5s 0.4s ease forwards', opacity: 0 }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '24px', flexShrink: 0 }}>🌟</span>
            <div>
              <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '14px', color: 'var(--saffron)', marginBottom: '6px' }}>{t('Pro Tip', 'प्रो टिप')}</div>
              <p style={{ fontSize: '14px', color: 'var(--ink)', lineHeight: 1.6 }}>{advice.tip}</p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '16px' }}>
          <button onClick={() => navigate('/interview')} style={{ flex: 1, padding: '14px', borderRadius: 'var(--radius-full)', background: 'linear-gradient(135deg,#F97316,#F59E0B)', color: 'white', border: 'none', fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '15px', cursor: 'pointer', boxShadow: 'var(--shadow-saffron)' }}>
            {t('Practice Interview →', 'इंटरव्यू अभ्यास →')}
          </button>
        </div>
      </div>
    </div>
  )
}
