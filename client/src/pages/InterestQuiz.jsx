import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import { questions } from '../data/questions'

export default function InterestQuiz() {
  const navigate = useNavigate()
  const { language, setQuizAnswers, t } = useUser()
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState([])
  const [selected, setSelected] = useState(null)
  const [direction, setDirection] = useState('in')

  const q = questions[current]
  const progress = ((current) / questions.length) * 100

  const handleSelect = (option) => {
    if (selected) return
    setSelected(option)
    const newAnswers = [...answers, option.domain]
    setTimeout(() => {
      if (current < questions.length - 1) {
        setDirection('out')
        setTimeout(() => {
          setAnswers(newAnswers)
          setCurrent(c => c + 1)
          setSelected(null)
          setDirection('in')
        }, 300)
      } else {
        setQuizAnswers(newAnswers)
        navigate('/academic')
      }
    }, 500)
  }

  const colors = ['#F97316', '#0EA5E9', '#10B981', '#F59E0B']
  const bgs = ['#FFF7ED', '#F0F9FF', '#ECFDF5', '#FFFBEB']

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #FFFBF7 0%, #FFF7ED 30%, #F0F9FF 100%)', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>

      {/* BG decoration */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: `linear-gradient(to right, #F97316 ${progress}%, #E5E7EB ${progress}%)`, transition: 'all 0.4s ease', zIndex: 10 }} />
      <div style={{ position: 'absolute', top: '20%', right: '-60px', width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(249,115,22,0.06), transparent)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '20%', left: '-40px', width: 160, height: 160, borderRadius: '50%', background: 'radial-gradient(circle, rgba(14,165,233,0.06), transparent)', pointerEvents: 'none' }} />

      {/* Top bar */}
      <div style={{ padding: '20px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 5 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: 32, height: 32, borderRadius: '8px', background: 'linear-gradient(135deg, #F97316, #F59E0B)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <span style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '18px', color: 'var(--ink)' }}>PathFinder</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '13px', color: 'var(--ink-60)', fontWeight: 500 }}>
            {t(`Question ${current + 1} of ${questions.length}`, `प्रश्न ${current + 1} / ${questions.length}`)}
          </span>
          {/* Mini dots */}
          <div style={{ display: 'flex', gap: '4px' }}>
            {questions.map((_, i) => (
              <div key={i} style={{ width: i === current ? 20 : 6, height: 6, borderRadius: '3px', background: i < current ? '#F97316' : i === current ? '#F97316' : '#E5E7EB', transition: 'all 0.3s ease' }} />
            ))}
          </div>
        </div>
      </div>

      {/* Question area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px 40px', maxWidth: '680px', margin: '0 auto', width: '100%' }}>

        {/* Question number pill */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 16px', background: 'rgba(249,115,22,0.08)', borderRadius: 'var(--radius-full)', marginBottom: '20px', border: '1px solid rgba(249,115,22,0.15)', animation: `${direction === 'in' ? 'slideUp' : 'fadeIn'} 0.4s ease forwards` }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--saffron)', fontFamily: 'var(--font-head)' }}>{current + 1}/{questions.length}</span>
          <span style={{ fontSize: '12px', color: 'var(--ink-60)' }}>
            {t('Interest Quiz', 'रुचि प्रश्नोत्तरी')}
          </span>
        </div>

        {/* Question text */}
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(22px, 4vw, 34px)',
          color: 'var(--ink)', textAlign: 'center', lineHeight: 1.3, marginBottom: '40px',
          animation: `${direction === 'in' ? 'slideUp' : 'fadeIn'} 0.4s 0.05s ease forwards`, opacity: 0
        }}>
          {language === 'hi' ? q.hi : q.en}
        </h2>

        {/* Options */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', width: '100%' }}>
          {q.options.map((opt, i) => {
            const isSelected = selected?.en === opt.en
            return (
              <button
                key={i}
                onClick={() => handleSelect(opt)}
                style={{
                  padding: '20px', borderRadius: 'var(--radius-lg)',
                  background: isSelected ? colors[i] : bgs[i],
                  border: `2px solid ${isSelected ? colors[i] : colors[i] + '33'}`,
                  cursor: 'pointer', textAlign: 'left', transition: 'all 0.25s',
                  transform: isSelected ? 'scale(1.03)' : 'scale(1)',
                  boxShadow: isSelected ? `0 12px 32px ${colors[i]}40` : 'var(--shadow-sm)',
                  animation: `popIn 0.4s ${0.1 + i * 0.06}s ease forwards`, opacity: 0
                }}
                onMouseEnter={e => { if (!selected) { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 12px 28px ${colors[i]}30` }}}
                onMouseLeave={e => { if (!selected) { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)' }}}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{ width: 28, height: 28, borderRadius: '8px', background: isSelected ? 'rgba(255,255,255,0.25)' : colors[i] + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.25s' }}>
                    <span style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '13px', color: isSelected ? 'white' : colors[i] }}>
                      {['A','B','C','D'][i]}
                    </span>
                  </div>
                  <span style={{ fontSize: '15px', fontWeight: 500, color: isSelected ? 'white' : 'var(--ink)', lineHeight: 1.4, transition: 'color 0.25s' }}>
                    {language === 'hi' ? opt.hi : opt.en}
                  </span>
                </div>
              </button>
            )
          })}
        </div>

        {/* Hint */}
        <p style={{ marginTop: '28px', fontSize: '13px', color: 'var(--ink-40)', textAlign: 'center' }}>
          {t('Tap any option to continue', 'जारी रखने के लिए किसी भी विकल्प पर टैप करें')}
        </p>
      </div>
    </div>
  )
}
