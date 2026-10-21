import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import { useGroq } from '../hooks/useGroq'

const TYPE_COLORS = {
  'Government':        { color: '#10B981', bg: '#ECFDF5' },
  'Government-IIT':    { color: '#0EA5E9', bg: '#F0F9FF' },
  'Government-NIT':    { color: '#0EA5E9', bg: '#F0F9FF' },
  'Central University':{ color: '#8B5CF6', bg: '#F5F3FF' },
  'Private':           { color: '#F97316', bg: '#FFF7ED' },
  'Deemed':            { color: '#F59E0B', bg: '#FFFBEB' },
}

// ── College Predictor Logic ─────────────────────────────────
// Cutoff-based predictor: maps stream + marks → likely colleges
const PREDICTOR_DATA = {
  'Science / PCM': [
    { name: 'IIT Bombay', cutoff: 99, type: 'Government-IIT', exam: 'JEE Advanced', city: 'Mumbai', fees: 220000, rating: 4.9, naac: 'A++' },
    { name: 'IIT Delhi', cutoff: 99, type: 'Government-IIT', exam: 'JEE Advanced', city: 'New Delhi', fees: 220000, rating: 4.9, naac: 'A++' },
    { name: 'NIT Trichy', cutoff: 97, type: 'Government-NIT', exam: 'JEE Main', city: 'Tiruchirappalli', fees: 75000, rating: 4.6, naac: 'A++' },
    { name: 'NIT Warangal', cutoff: 96, type: 'Government-NIT', exam: 'JEE Main', city: 'Warangal', fees: 70000, rating: 4.5, naac: 'A+' },
    { name: 'BITS Pilani', cutoff: 95, type: 'Deemed', exam: 'BITSAT', city: 'Pilani', fees: 500000, rating: 4.7, naac: 'A' },
    { name: 'HBTU Kanpur', cutoff: 82, type: 'Government', exam: 'JEE Main', city: 'Kanpur', fees: 35000, rating: 4.3, naac: 'A' },
    { name: 'GLA University', cutoff: 65, type: 'Private', exam: 'Direct/JEE', city: 'Mathura', fees: 80000, rating: 4.2, naac: 'A' },
    { name: 'Manipal University Jaipur', cutoff: 60, type: 'Private', exam: 'MU-OET', city: 'Jaipur', fees: 120000, rating: 4.2, naac: 'A+' },
    { name: 'LNCT Bhopal', cutoff: 50, type: 'Private', exam: 'Direct', city: 'Bhopal', fees: 65000, rating: 3.9, naac: 'A' },
    { name: 'Invertis University', cutoff: 40, type: 'Private', exam: 'Direct', city: 'Bareilly', fees: 55000, rating: 3.7, naac: 'B+' },
  ],
  'Science / PCB': [
    { name: 'AIIMS Delhi', cutoff: 99, type: 'Government', exam: 'NEET', city: 'New Delhi', fees: 5000, rating: 5.0, naac: 'A++' },
    { name: 'Maulana Azad Medical College', cutoff: 98, type: 'Government', exam: 'NEET', city: 'New Delhi', fees: 12000, rating: 4.8, naac: 'A+' },
    { name: 'BHU Medical College', cutoff: 94, type: 'Central University', exam: 'NEET', city: 'Varanasi', fees: 15000, rating: 4.6, naac: 'A++' },
    { name: 'KGMU Lucknow', cutoff: 90, type: 'Government', exam: 'NEET', city: 'Lucknow', fees: 20000, rating: 4.5, naac: 'A' },
    { name: 'Kasturba Medical College', cutoff: 85, type: 'Deemed', exam: 'NEET', city: 'Manipal', fees: 1200000, rating: 4.6, naac: 'A+' },
    { name: 'Era Medical College', cutoff: 70, type: 'Private', exam: 'NEET', city: 'Lucknow', fees: 800000, rating: 4.1, naac: 'A' },
    { name: 'Rohilkhand Medical College', cutoff: 55, type: 'Private', exam: 'NEET', city: 'Bareilly', fees: 650000, rating: 3.8, naac: 'B+' },
  ],
  'Commerce': [
    { name: 'SRCC Delhi', cutoff: 97, type: 'Government', exam: 'CUET', city: 'New Delhi', fees: 25000, rating: 4.8, naac: 'A++' },
    { name: 'LSR Delhi', cutoff: 96, type: 'Government', exam: 'CUET', city: 'New Delhi', fees: 22000, rating: 4.7, naac: 'A++' },
    { name: 'IIM Indore (IPM)', cutoff: 95, type: 'Government', exam: 'IPMAT', city: 'Indore', fees: 460000, rating: 4.9, naac: 'A+' },
    { name: 'BHU Commerce', cutoff: 80, type: 'Central University', exam: 'CUET', city: 'Varanasi', fees: 12000, rating: 4.4, naac: 'A++' },
    { name: 'Lucknow University Commerce', cutoff: 65, type: 'Government', exam: 'CUET', city: 'Lucknow', fees: 10000, rating: 4.0, naac: 'A' },
    { name: 'GLA University BBA', cutoff: 55, type: 'Private', exam: 'Direct', city: 'Mathura', fees: 60000, rating: 4.0, naac: 'A' },
    { name: 'Teerthanker Mahaveer University', cutoff: 45, type: 'Private', exam: 'Direct', city: 'Moradabad', fees: 45000, rating: 3.8, naac: 'A' },
  ],
  'Arts / Humanities': [
    { name: 'Lady Shri Ram College', cutoff: 96, type: 'Government', exam: 'CUET', city: 'New Delhi', fees: 20000, rating: 4.7, naac: 'A++' },
    { name: 'Jawaharlal Nehru University', cutoff: 90, type: 'Central University', exam: 'JNUET', city: 'New Delhi', fees: 5000, rating: 4.8, naac: 'A++' },
    { name: 'BHU Arts Faculty', cutoff: 80, type: 'Central University', exam: 'CUET', city: 'Varanasi', fees: 8000, rating: 4.5, naac: 'A++' },
    { name: 'Allahabad University', cutoff: 65, type: 'Central University', exam: 'CUET', city: 'Prayagraj', fees: 6000, rating: 4.2, naac: 'A+' },
    { name: 'Lucknow University Arts', cutoff: 55, type: 'Government', exam: 'CUET', city: 'Lucknow', fees: 7000, rating: 4.0, naac: 'A' },
    { name: 'Dr. Bhimrao Ambedkar University', cutoff: 45, type: 'Government', exam: 'CUET', city: 'Agra', fees: 8000, rating: 3.9, naac: 'A' },
  ],
  'Diploma / ITI': [
    { name: 'IIT Roorkee (Diploma)', cutoff: 92, type: 'Government-IIT', exam: 'JEE Main', city: 'Roorkee', fees: 55000, rating: 4.7, naac: 'A++' },
    { name: 'Govt Polytechnic Lucknow', cutoff: 70, type: 'Government', exam: 'JEECUP', city: 'Lucknow', fees: 15000, rating: 4.1, naac: 'A' },
    { name: 'Govt ITI Kanpur', cutoff: 60, type: 'Government', exam: 'State ITI', city: 'Kanpur', fees: 8000, rating: 4.0, naac: 'B+' },
    { name: 'Govt Polytechnic Gorakhpur', cutoff: 50, type: 'Government', exam: 'JEECUP', city: 'Gorakhpur', fees: 12000, rating: 3.9, naac: 'B+' },
    { name: 'Private Polytechnic Agra', cutoff: 40, type: 'Private', exam: 'Direct', city: 'Agra', fees: 35000, rating: 3.7, naac: 'B' },
  ],
}

const FALLBACK_COLLEGES = [
  { name: 'GLA University', city: 'Mathura', state: 'Uttar Pradesh', type: 'Private', fees: 80000, courses: ['B.Tech','BBA','B.Sc'], rating: 4.2, naac: 'A', placement: '70%', whyMatch: 'Strong placement for tech with affordable fees.', entranceExam: 'Direct / JEE', website: 'https://www.gla.ac.in' },
  { name: 'HBTU Kanpur', city: 'Kanpur', state: 'Uttar Pradesh', type: 'Government', fees: 35000, courses: ['B.Tech','M.Tech'], rating: 4.3, naac: 'A', placement: '75%', whyMatch: 'Government college with excellent faculty and low fees.', entranceExam: 'JEE Main', website: 'https://hbtu.ac.in' },
  { name: 'BHU Varanasi', city: 'Varanasi', state: 'Uttar Pradesh', type: 'Central University', fees: 15000, courses: ['BA','B.Sc','B.Tech','MBBS'], rating: 4.5, naac: 'A++', placement: '70%', whyMatch: 'Prestigious central university with world-class faculty.', entranceExam: 'CUET / JEE', website: 'https://www.bhu.ac.in' },
  { name: 'University of Lucknow', city: 'Lucknow', state: 'Uttar Pradesh', type: 'Government', fees: 10000, courses: ['BA','B.Sc','LLB'], rating: 4.0, naac: 'A', placement: '55%', whyMatch: 'Most affordable government university in UP.', entranceExam: 'CUET', website: 'https://www.lkouniv.ac.in' },
]

// ── Predictor Component ──────────────────────────────────────
function CollegePredictor({ academicData, t }) {
  const [marks, setMarks] = useState(academicData?.marks || '')
  const [stream, setStream] = useState(academicData?.stream || '')
  const [predicted, setPredicted] = useState(null)
  const [predicting, setPredicting] = useState(false)

  const streams = Object.keys(PREDICTOR_DATA)

  const predict = () => {
    if (!marks || !stream) return
    setPredicting(true)
    setPredicted(null)

    setTimeout(() => {
      const pct = parseFloat(marks)
      const streamData = PREDICTOR_DATA[stream] || []

      const sure = streamData.filter(c => pct >= c.cutoff + 3)
      const likely = streamData.filter(c => pct >= c.cutoff && pct < c.cutoff + 3)
      const reach = streamData.filter(c => pct >= c.cutoff - 8 && pct < c.cutoff)

      setPredicted({ sure, likely, reach, marks: pct, stream })
      setPredicting(false)
    }, 1200)
  }

  const renderCollegeRow = (college, category) => {
    const tc = TYPE_COLORS[college.type] || { color: '#64748B', bg: '#F8FAFC' }
    const catColors = {
      sure: { text: '#10B981', bg: '#ECFDF5', label: '✅ Safe' },
      likely: { text: '#F97316', bg: '#FFF7ED', label: '🎯 Likely' },
      reach: { text: '#8B5CF6', bg: '#F5F3FF', label: '⚡ Reach' },
    }
    const cat = catColors[category]

    return (
      <div key={college.name} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 20px', background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--ink-10)', boxShadow: 'var(--shadow-xs)', transition: 'all 0.2s', marginBottom: '10px' }}
        onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.transform = 'translateX(4px)' }}
        onMouseLeave={e => { e.currentTarget.style.boxShadow = 'var(--shadow-xs)'; e.currentTarget.style.transform = 'translateX(0)' }}>

        {/* Category badge */}
        <div style={{ flexShrink: 0, padding: '6px 12px', background: cat.bg, borderRadius: 'var(--radius-full)', fontSize: '11px', fontWeight: 700, color: cat.text, whiteSpace: 'nowrap', fontFamily: 'var(--font-head)' }}>
          {cat.label}
        </div>

        {/* College info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '15px', color: 'var(--ink)' }}>{college.name}</span>
            <span style={{ fontSize: '11px', padding: '2px 8px', background: tc.bg, color: tc.color, borderRadius: 'var(--radius-full)', fontWeight: 600 }}>{college.type}</span>
          </div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '4px' }}>
            <span style={{ fontSize: '12px', color: 'var(--ink-60)' }}>📍 {college.city}</span>
            <span style={{ fontSize: '12px', color: 'var(--ink-60)' }}>💰 ₹{college.fees.toLocaleString('en-IN')}/yr</span>
            <span style={{ fontSize: '12px', color: 'var(--ink-60)' }}>📝 {college.exam}</span>
            <span style={{ fontSize: '12px', color: 'var(--ink-60)' }}>⭐ {college.rating}</span>
          </div>
        </div>

        {/* Cutoff */}
        <div style={{ flexShrink: 0, textAlign: 'center', padding: '8px 12px', background: 'var(--ink-05)', borderRadius: 'var(--radius-md)' }}>
          <div style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: '18px', color: tc.color, lineHeight: 1 }}>{college.cutoff}%</div>
          <div style={{ fontSize: '10px', color: 'var(--ink-60)', marginTop: '2px' }}>cutoff</div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ animation: 'fadeIn 0.4s ease forwards' }}>
      {/* Predictor form */}
      <div style={{ background: 'linear-gradient(135deg, #FFF7ED, #F0F9FF)', borderRadius: 'var(--radius-xl)', padding: '32px', marginBottom: '32px', border: '1px solid var(--ink-10)' }}>
        <h3 style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '18px', color: 'var(--ink)', marginBottom: '6px' }}>
          🎓 College Predictor
        </h3>
        <p style={{ fontSize: '14px', color: 'var(--ink-60)', marginBottom: '24px', lineHeight: 1.6 }}>
          Enter your board exam percentage and stream to see which colleges you can get into
        </p>

        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '20px' }}>
          {/* Stream select */}
          <div style={{ flex: '1 1 200px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--ink-60)', marginBottom: '8px', fontFamily: 'var(--font-head)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Your Stream</label>
            <select value={stream} onChange={e => setStream(e.target.value)}
              style={{ width: '100%', padding: '12px 16px', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--ink-20)', background: 'white', fontSize: '15px', color: 'var(--ink)', cursor: 'pointer', appearance: 'none', backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none'%3E%3Cpath d='M6 9l6 6 6-6' stroke='%2357534E' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E\")", backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center' }}>
              <option value="">Select stream...</option>
              {streams.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* Marks input */}
          <div style={{ flex: '1 1 160px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--ink-60)', marginBottom: '8px', fontFamily: 'var(--font-head)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Your Marks / Percentile %</label>
            <input type="number" min="0" max="100" placeholder="e.g. 78" value={marks} onChange={e => setMarks(e.target.value)}
              style={{ width: '100%', padding: '12px 16px', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--ink-20)', background: 'white', fontSize: '15px', color: 'var(--ink)', transition: 'border-color 0.2s' }}
              onFocus={e => e.target.style.borderColor = '#F97316'}
              onBlur={e => e.target.style.borderColor = 'var(--ink-20)'} />
          </div>
        </div>

        <button onClick={predict} disabled={!marks || !stream || predicting}
          style={{ padding: '14px 40px', borderRadius: 'var(--radius-full)', background: marks && stream ? 'linear-gradient(135deg, #F97316, #F59E0B)' : 'var(--ink-20)', color: marks && stream ? 'white' : 'var(--ink-40)', fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '15px', border: 'none', cursor: marks && stream ? 'pointer' : 'not-allowed', transition: 'all 0.25s', boxShadow: marks && stream ? 'var(--shadow-saffron)' : 'none' }}
          onMouseEnter={e => { if (marks && stream) e.currentTarget.style.transform = 'translateY(-2px)' }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)' }}>
          {predicting ? '🔍 Predicting...' : '🎯 Predict My Colleges'}
        </button>
      </div>

      {/* Loading state */}
      {predicting && (
        <div style={{ textAlign: 'center', padding: '40px', animation: 'fadeIn 0.3s ease' }}>
          <div style={{ position: 'relative', width: 60, height: 60, margin: '0 auto 16px' }}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '3px solid #FED7AA', animation: 'spinSlow 1.2s linear infinite' }} />
            <div style={{ position: 'absolute', inset: '8px', borderRadius: '50%', border: '3px solid transparent', borderTopColor: '#F97316', animation: 'spinSlow 0.7s linear infinite' }} />
            <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>🎓</span>
          </div>
          <p style={{ color: 'var(--ink-60)', fontFamily: 'var(--font-head)', fontWeight: 600 }}>Matching {marks}% with college cutoffs...</p>
        </div>
      )}

      {/* Results */}
      {predicted && (
        <div style={{ animation: 'slideUp 0.5s ease forwards' }}>
          {/* Summary bar */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '24px' }}>
            {[
              { label: 'Safe Colleges', count: predicted.sure.length, color: '#10B981', bg: '#ECFDF5' },
              { label: 'Likely Colleges', count: predicted.likely.length, color: '#F97316', bg: '#FFF7ED' },
              { label: 'Reach Colleges', count: predicted.reach.length, color: '#8B5CF6', bg: '#F5F3FF' },
            ].map(s => (
              <div key={s.label} style={{ flex: '1 1 120px', padding: '16px', background: s.bg, borderRadius: 'var(--radius-lg)', textAlign: 'center', border: `1px solid ${s.color}22` }}>
                <div style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: '28px', color: s.color, lineHeight: 1 }}>{s.count}</div>
                <div style={{ fontSize: '12px', color: s.color + 'BB', marginTop: '4px', fontWeight: 600 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* College lists */}
          {predicted.sure.length === 0 && predicted.likely.length === 0 && predicted.reach.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px', background: 'white', borderRadius: 'var(--radius-xl)', border: '1px solid var(--ink-10)' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>🤔</div>
              <p style={{ fontFamily: 'var(--font-head)', fontWeight: 600, color: 'var(--ink)', marginBottom: '8px' }}>No strong matches found</p>
              <p style={{ fontSize: '14px', color: 'var(--ink-60)' }}>Try a different stream or check the AI-recommended colleges tab</p>
            </div>
          )}

          {predicted.sure.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '15px', color: '#10B981', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                ✅ Safe Choices <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--ink-60)' }}>({predicted.marks}% is above cutoff)</span>
              </h4>
              {predicted.sure.map(c => renderCollegeRow(c, 'sure'))}
            </div>
          )}

          {predicted.likely.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '15px', color: '#F97316', marginBottom: '12px' }}>🎯 Likely Admissions <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--ink-60)' }}>(marks just at cutoff)</span></h4>
              {predicted.likely.map(c => renderCollegeRow(c, 'likely'))}
            </div>
          )}

          {predicted.reach.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '15px', color: '#8B5CF6', marginBottom: '12px' }}>⚡ Reach / Aspirational</h4>
              {predicted.reach.map(c => renderCollegeRow(c, 'reach'))}
            </div>
          )}

          {/* CTA */}
          <div style={{ padding: '20px', background: 'rgba(249,115,22,0.05)', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(249,115,22,0.12)', textAlign: 'center', marginTop: '16px' }}>
            <p style={{ fontSize: '14px', color: 'var(--ink-60)', lineHeight: 1.6 }}>
              💡 <strong>Pro tip:</strong> Switch to the <strong>AI Recommended</strong> tab to see colleges matched to your specific career path and income
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Main Component ──────────────────────────────────────────
export default function CollegeFinder() {
  const navigate = useNavigate()
  const { academicData, selectedCareer, t } = useUser()
  const { call, loading } = useGroq()
  const [colleges, setColleges] = useState([])
  const [filter, setFilter] = useState('all')
  const [expanded, setExpanded] = useState(null)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('predictor') // 'predictor' | 'ai'

  useEffect(() => {
    if (activeTab !== 'ai') return
    const fetchColleges = async () => {
      setError(null)
      const data = await call('colleges', {
        career: selectedCareer?.career || 'Software Engineer',
        stream: academicData?.stream,
        marks: academicData?.marks,
        city: academicData?.city,
        income: academicData?.income,
        category: academicData?.category,
      })
      if (data?.colleges?.length) setColleges(data.colleges)
      else { setError('Could not load AI suggestions. Showing defaults.'); setColleges(FALLBACK_COLLEGES) }
    }
    if (colleges.length === 0) fetchColleges()
  }, [activeTab])

  const filtered = filter === 'all' ? colleges : colleges.filter(c => c.type?.toLowerCase().includes(filter))

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #FFFBF7, #FFF7ED 30%, #F0F9FF)', overflow: 'hidden' }}>
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '40px 24px' }}>

        {/* Header */}
        <div style={{ marginBottom: '32px', animation: 'slideUp 0.5s ease forwards' }}>
          <button onClick={() => navigate('/skillgap')} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: 'var(--ink-60)', fontSize: '14px', cursor: 'pointer', marginBottom: '20px', padding: 0 }}>
            ← {t('Back to Skill Gap', 'कौशल अंतर पर वापस')}
          </button>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(26px, 4vw, 40px)', color: 'var(--ink)', marginBottom: '8px' }}>
            {t('College Finder', 'कॉलेज खोजें')}
          </h1>
          <p style={{ fontSize: '15px', color: 'var(--ink-60)' }}>
            {t('Predict your admissions or get AI-matched college recommendations', 'अपने प्रवेश की भविष्यवाणी करें या AI मिलान कॉलेज सुझाव पाएं')}
          </p>
        </div>

        {/* Tab switcher */}
        <div style={{ display: 'flex', gap: '4px', background: 'white', padding: '5px', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', marginBottom: '28px', border: '1px solid var(--ink-10)', animation: 'slideUp 0.5s 0.1s ease forwards', opacity: 0 }}>
          {[
            { key: 'predictor', label: '🎓 College Predictor', sublabel: 'By marks & stream' },
            { key: 'ai', label: '🤖 AI Recommended', sublabel: 'By career & profile' },
          ].map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              style={{ flex: 1, padding: '12px 16px', borderRadius: 'var(--radius-md)', border: 'none', background: activeTab === tab.key ? 'linear-gradient(135deg, #F97316, #F59E0B)' : 'transparent', color: activeTab === tab.key ? 'white' : 'var(--ink-60)', fontFamily: 'var(--font-head)', fontWeight: 600, fontSize: '14px', cursor: 'pointer', transition: 'all 0.25s', boxShadow: activeTab === tab.key ? 'var(--shadow-saffron)' : 'none' }}>
              {tab.label}
              <div style={{ fontSize: '11px', fontWeight: 500, opacity: 0.8, marginTop: '2px' }}>{tab.sublabel}</div>
            </button>
          ))}
        </div>

        {/* Predictor tab */}
        {activeTab === 'predictor' && (
          <CollegePredictor academicData={academicData} t={t} />
        )}

        {/* AI recommended tab */}
        {activeTab === 'ai' && (
          <>
            {loading && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', padding: '60px 0' }}>
                <div style={{ position: 'relative', width: 64, height: 64 }}>
                  <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '3px solid #FED7AA', animation: 'spinSlow 1.2s linear infinite' }} />
                  <div style={{ position: 'absolute', inset: '8px', borderRadius: '50%', border: '3px solid transparent', borderTopColor: '#F97316', animation: 'spinSlow 0.7s linear infinite' }} />
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>🤖</div>
                </div>
                <p style={{ fontFamily: 'var(--font-head)', fontWeight: 600, color: 'var(--ink-60)' }}>
                  {t('AI finding your colleges...', 'AI कॉलेज ढूंढ रहा है...')}
                </p>
              </div>
            )}

            {!loading && (
              <>
                {/* AI badge */}
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', background: 'rgba(14,165,233,0.08)', borderRadius: 'var(--radius-full)', border: '1px solid rgba(14,165,233,0.2)', marginBottom: '20px' }}>
                  <span style={{ fontSize: '13px' }}>🤖</span>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#0EA5E9' }}>{t('AI-personalised for your profile', 'आपकी प्रोफ़ाइल के लिए AI द्वारा चुना गया')}</span>
                </div>

                {error && (
                  <div style={{ padding: '12px 16px', background: '#FFFBEB', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 'var(--radius-md)', marginBottom: '20px', fontSize: '13px', color: '#92400E' }}>⚠️ {error}</div>
                )}

                {/* Filter tabs */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px', background: 'white', padding: '6px', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
                  {[{ key: 'all', label: t('All', 'सभी') }, { key: 'government', label: t('Government', 'सरकारी') }, { key: 'private', label: t('Private', 'निजी') }, { key: 'deemed', label: 'Deemed' }].map(f => (
                    <button key={f.key} onClick={() => setFilter(f.key)}
                      style={{ flex: 1, padding: '10px 8px', borderRadius: 'var(--radius-md)', border: 'none', background: filter === f.key ? 'var(--saffron)' : 'transparent', color: filter === f.key ? 'white' : 'var(--ink-60)', fontFamily: 'var(--font-head)', fontWeight: 600, fontSize: '13px', cursor: 'pointer', transition: 'all 0.25s' }}>
                      {f.label}
                    </button>
                  ))}
                </div>

                {/* College cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {filtered.map((college, i) => {
                    const tc = TYPE_COLORS[college.type] || { color: '#64748B', bg: '#F8FAFC' }
                    const isOpen = expanded === i
                    return (
                      <div key={i} style={{ background: 'white', borderRadius: 'var(--radius-xl)', boxShadow: isOpen ? 'var(--shadow-md)' : 'var(--shadow-sm)', border: `1px solid ${isOpen ? tc.color + '40' : 'var(--ink-10)'}`, overflow: 'hidden', transition: 'all 0.3s', animation: `slideUp 0.5s ${i * 0.07}s ease forwards`, opacity: 0 }}>
                        <div style={{ height: '3px', background: `linear-gradient(to right, ${tc.color}, ${tc.color}55)` }} />
                        <div style={{ padding: '20px 24px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                            <div style={{ flex: 1 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '6px' }}>
                                <h3 style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '17px', color: 'var(--ink)' }}>{college.name}</h3>
                                <span style={{ fontSize: '11px', padding: '3px 10px', background: tc.bg, color: tc.color, borderRadius: 'var(--radius-full)', fontWeight: 600 }}>{college.type}</span>
                              </div>
                              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '10px' }}>
                                <span style={{ fontSize: '13px', color: 'var(--ink-60)' }}>📍 {college.city}, {college.state}</span>
                                <span style={{ fontSize: '13px', color: 'var(--ink-60)' }}>💰 ₹{college.fees?.toLocaleString('en-IN')}/yr</span>
                                <span style={{ fontSize: '13px', color: 'var(--ink-60)' }}>🎓 NAAC {college.naac}</span>
                                <span style={{ fontSize: '13px', color: '#10B981', fontWeight: 600 }}>💼 {college.placement} placed</span>
                              </div>
                              {college.whyMatch && (
                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 14px', background: `${tc.color}10`, borderRadius: 'var(--radius-full)', border: `1px solid ${tc.color}25` }}>
                                  <span style={{ fontSize: '12px' }}>✨</span>
                                  <span style={{ fontSize: '12px', color: tc.color, fontWeight: 500 }}>{college.whyMatch}</span>
                                </div>
                              )}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                              <div style={{ textAlign: 'center', background: college.rating >= 4.5 ? '#ECFDF5' : '#FFF7ED', padding: '8px 14px', borderRadius: 'var(--radius-md)' }}>
                                <div style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: '20px', color: college.rating >= 4.5 ? '#10B981' : '#F97316', lineHeight: 1 }}>{college.rating}</div>
                                <div style={{ fontSize: '10px', color: 'var(--ink-60)', marginTop: '2px' }}>★ Rating</div>
                              </div>
                              <button onClick={() => setExpanded(isOpen ? null : i)}
                                style={{ width: 32, height: 32, borderRadius: '50%', background: tc.bg, border: `1px solid ${tc.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'transform 0.25s', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke={tc.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                              </button>
                            </div>
                          </div>

                          {isOpen && (
                            <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: `1px solid ${tc.color}15`, animation: 'slideUp 0.3s ease forwards' }}>
                              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '16px' }}>
                                {[
                                  { label: 'Entrance Exam', value: college.entranceExam, color: tc.color, bg: tc.bg },
                                  { label: 'Placement', value: college.placement, color: '#10B981', bg: '#ECFDF5' },
                                  { label: 'NAAC Grade', value: college.naac, color: '#8B5CF6', bg: '#F5F3FF' },
                                ].map(item => (
                                  <div key={item.label} style={{ padding: '10px 16px', background: item.bg, borderRadius: 'var(--radius-md)', border: `1px solid ${item.color}22` }}>
                                    <div style={{ fontSize: '11px', color: 'var(--ink-60)', marginBottom: '3px' }}>{item.label}</div>
                                    <div style={{ fontSize: '14px', fontWeight: 600, color: item.color }}>{item.value}</div>
                                  </div>
                                ))}
                              </div>
                              {college.courses && (
                                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
                                  {college.courses.map((c, ci) => (
                                    <span key={ci} style={{ fontSize: '12px', padding: '3px 10px', background: 'var(--ink-10)', color: 'var(--ink-60)', borderRadius: 'var(--radius-full)' }}>{c}</span>
                                  ))}
                                </div>
                              )}
                              {college.website && college.website !== '#' && (
                                <a href={college.website} target="_blank" rel="noopener noreferrer"
                                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: tc.color, color: 'white', borderRadius: 'var(--radius-full)', fontSize: '13px', fontWeight: 600, fontFamily: 'var(--font-head)' }}>
                                  Visit Official Website →
                                </a>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </>
            )}
          </>
        )}

        {/* Navigation */}
        <div style={{ display: 'flex', gap: '16px', marginTop: '40px' }}>
          <button onClick={() => navigate('/schemes')}
            style={{ flex: 1, padding: '14px', borderRadius: 'var(--radius-full)', background: 'linear-gradient(135deg, #F97316, #F59E0B)', color: 'white', border: 'none', fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '15px', cursor: 'pointer', boxShadow: 'var(--shadow-saffron)', transition: 'all 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
            🏛️ {t('View Govt Schemes →', 'सरकारी योजनाएं →')}
          </button>
          <button onClick={() => navigate('/interview')}
            style={{ flex: 1, padding: '14px', borderRadius: 'var(--radius-full)', background: 'white', color: 'var(--sky)', border: '1.5px solid var(--sky)', fontFamily: 'var(--font-head)', fontWeight: 600, fontSize: '15px', cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
            🤖 {t('Mock Interview →', 'मॉक इंटरव्यू →')}
          </button>
        </div>
      </div>
    </div>
  )
}