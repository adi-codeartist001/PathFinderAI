import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'

const inputStyle = {
  width: '100%', padding: '14px 16px', borderRadius: 'var(--radius-md)',
  border: '1.5px solid var(--ink-20)', background: 'white', fontSize: '15px',
  color: 'var(--ink)', fontFamily: 'var(--font-body)', transition: 'all 0.2s',
  outline: 'none', boxSizing: 'border-box'
}

// ✅ MUST be outside AcademicInput — if inside, it remounts on every keystroke and loses focus
const Field = ({ label, error, children }) => (
  <div style={{ marginBottom: '20px' }}>
    <label style={{
      display: 'block', fontSize: '13px', fontWeight: 600,
      color: 'var(--ink-60)', marginBottom: '8px',
      fontFamily: 'var(--font-head)', letterSpacing: '0.02em', textTransform: 'uppercase'
    }}>
      {label}
    </label>
    {children}
    {error && <p style={{ fontSize: '12px', color: 'var(--rose)', marginTop: '4px' }}>{error}</p>}
  </div>
)

export default function AcademicInput() {
  const navigate = useNavigate()
  const { setAcademicData, setUserName, t } = useUser()

  const [form, setForm] = useState({
    name: '', stream: '', marks: '', city: '', income: '', category: 'general'
  })
  const [focused, setFocused] = useState(null)
  const [errors, setErrors] = useState({})

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = t('Name is required', 'नाम ज़रूरी है')
    if (!form.stream) e.stream = t('Please select stream', 'स्ट्रीम चुनें')
    if (!form.marks || form.marks < 0 || form.marks > 100) e.marks = t('Enter valid marks (0-100)', '0-100 के बीच अंक डालें')
    if (!form.city.trim()) e.city = t('City is required', 'शहर ज़रूरी है')
    if (!form.income) e.income = t('Please select income range', 'आय सीमा चुनें')
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return
    setUserName(form.name)
    setAcademicData(form)
    navigate('/result')
  }

  const focusStyle = (name) =>
    focused === name
      ? { borderColor: 'var(--saffron)', boxShadow: '0 0 0 3px rgba(249,115,22,0.1)' }
      : {}

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #FFFBF7, #FFF7ED 40%, #F0F9FF)',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '40px 24px',
      position: 'relative', overflow: 'hidden'
    }}>

      <div style={{
        position: 'absolute', top: '5%', right: '5%', width: 250, height: 250,
        borderRadius: '50%', background: 'radial-gradient(circle, rgba(249,115,22,0.07), transparent)',
        pointerEvents: 'none'
      }} />

      {/* Progress indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '32px' }}>
        {['Quiz', 'About You', 'Results'].map((step, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{
                width: 24, height: 24, borderRadius: '50%',
                background: i === 0 ? 'var(--green)' : i === 1 ? 'var(--saffron)' : 'var(--ink-20)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {i === 0
                  ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                      <path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  : <span style={{ fontSize: '11px', fontWeight: 700, color: i === 1 ? 'white' : 'var(--ink-40)' }}>{i + 1}</span>
                }
              </div>
              <span style={{
                fontSize: '13px',
                fontWeight: i === 1 ? 600 : 400,
                color: i === 1 ? 'var(--ink)' : 'var(--ink-40)'
              }}>
                {step}
              </span>
            </div>
            {i < 2 && <div style={{ width: 32, height: 1, background: 'var(--ink-20)' }} />}
          </div>
        ))}
      </div>

      <div style={{
        background: 'white', borderRadius: 'var(--radius-xl)', padding: '40px',
        width: '100%', maxWidth: '520px', boxShadow: 'var(--shadow-lg)',
        border: '1px solid var(--ink-10)'
      }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: 56, height: 56, borderRadius: '16px',
            background: 'linear-gradient(135deg, #FFF7ED, #FED7AA)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px', border: '1px solid rgba(249,115,22,0.2)'
          }}>
            <span style={{ fontSize: '28px' }}>📋</span>
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', color: 'var(--ink)', marginBottom: '8px' }}>
            {t('Tell us about yourself', 'अपने बारे में बताएं')}
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--ink-60)' }}>
            {t('This helps us give you accurate career matches', 'इससे हम आपको सटीक करियर सुझाव दे सकते हैं')}
          </p>
        </div>

        {/* Form */}
        <Field label={t('Your Name', 'आपका नाम')} error={errors.name}>
          <input
            style={{ ...inputStyle, ...focusStyle('name') }}
            placeholder={t('e.g. Rahul Kumar', 'जैसे: राहुल कुमार')}
            value={form.name}
            onChange={e => update('name', e.target.value)}
            onFocus={() => setFocused('name')}
            onBlur={() => setFocused(null)}
          />
        </Field>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <Field label={t('Stream', 'स्ट्रीम')} error={errors.stream}>
            <select
              style={{ ...inputStyle, ...focusStyle('stream'), cursor: 'pointer' }}
              value={form.stream}
              onChange={e => update('stream', e.target.value)}
              onFocus={() => setFocused('stream')}
              onBlur={() => setFocused(null)}
            >
              <option value="">{t('Select...', 'चुनें...')}</option>
              <option value="PCM">PCM (Science)</option>
              <option value="PCB">PCB (Biology)</option>
              <option value="Commerce">Commerce</option>
              <option value="Arts">Arts / Humanities</option>
              <option value="Vocational">Vocational</option>
            </select>
          </Field>

          <Field label={t('Marks %', 'अंक %')} error={errors.marks}>
            <input
              style={{ ...inputStyle, ...focusStyle('marks') }}
              type="number"
              min="0"
              max="100"
              placeholder="e.g. 72"
              value={form.marks}
              onChange={e => update('marks', e.target.value)}
              onFocus={() => setFocused('marks')}
              onBlur={() => setFocused(null)}
            />
          </Field>
        </div>

        <Field label={t('Your City', 'आपका शहर')} error={errors.city}>
          <input
            style={{ ...inputStyle, ...focusStyle('city') }}
            placeholder={t('e.g. Mathura, Agra, Jaipur...', 'जैसे: मथुरा, आगरा, जयपुर...')}
            value={form.city}
            onChange={e => update('city', e.target.value)}
            onFocus={() => setFocused('city')}
            onBlur={() => setFocused(null)}
          />
        </Field>

        <Field label={t('Annual Family Income', 'वार्षिक पारिवारिक आय')} error={errors.income}>
          <select
            style={{ ...inputStyle, ...focusStyle('income'), cursor: 'pointer' }}
            value={form.income}
            onChange={e => update('income', e.target.value)}
            onFocus={() => setFocused('income')}
            onBlur={() => setFocused(null)}
          >
            <option value="">{t('Select range...', 'सीमा चुनें...')}</option>
            <option value="100000">{t('Under ₹1 Lakh/year', '₹1 लाख से कम/साल')}</option>
            <option value="250000">₹1–2.5 {t('Lakh/year', 'लाख/साल')}</option>
            <option value="500000">₹2.5–5 {t('Lakh/year', 'लाख/साल')}</option>
            <option value="800000">₹5–8 {t('Lakh/year', 'लाख/साल')}</option>
            <option value="1500000">{t('Above ₹8 Lakh/year', '₹8 लाख से अधिक/साल')}</option>
          </select>
        </Field>

        <Field label={t('Category', 'श्रेणी')}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
            {['General', 'OBC', 'SC', 'ST', 'EWS', 'Minority'].map(cat => (
              <button
                key={cat}
                onClick={() => update('category', cat.toLowerCase())}
                style={{
                  padding: '10px 8px', borderRadius: 'var(--radius-sm)', cursor: 'pointer',
                  border: `1.5px solid ${form.category === cat.toLowerCase() ? 'var(--saffron)' : 'var(--ink-20)'}`,
                  background: form.category === cat.toLowerCase() ? '#FFF7ED' : 'white',
                  color: form.category === cat.toLowerCase() ? 'var(--saffron)' : 'var(--ink-60)',
                  fontSize: '13px', fontWeight: form.category === cat.toLowerCase() ? 600 : 400,
                  transition: 'all 0.2s'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </Field>

        <button
          onClick={handleSubmit}
          style={{
            width: '100%', padding: '16px', borderRadius: 'var(--radius-full)',
            background: 'linear-gradient(135deg, #F97316, #F59E0B)',
            color: 'white', fontFamily: 'var(--font-head)', fontWeight: 700,
            fontSize: '16px', border: 'none', cursor: 'pointer',
            boxShadow: 'var(--shadow-saffron)', transition: 'all 0.25s', marginTop: '8px'
          }}
          onMouseEnter={e => {
            e.target.style.transform = 'translateY(-2px)'
            e.target.style.boxShadow = '0 16px 40px rgba(249,115,22,0.35)'
          }}
          onMouseLeave={e => {
            e.target.style.transform = 'translateY(0)'
            e.target.style.boxShadow = 'var(--shadow-saffron)'
          }}
        >
          {t('Show My Career Paths →', 'मेरे करियर पथ दिखाएं →')}
        </button>
      </div>
    </div>
  )
}