import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import { useGroq } from '../hooks/useGroq'

// Domain-specific fallbacks — only used if Groq API fails
const DOMAIN_FALLBACKS = {
  'Software Engineer': [
    { name: "HTML & CSS", current: 40, required: 80, color: "#F97316", priority: "High" },
    { name: "JavaScript", current: 25, required: 90, color: "#0EA5E9", priority: "High" },
    { name: "React.js", current: 10, required: 75, color: "#10B981", priority: "High" },
    { name: "Node.js / Backend", current: 5, required: 60, color: "#F59E0B", priority: "Medium" },
    { name: "Databases", current: 15, required: 65, color: "#8B5CF6", priority: "Medium" },
    { name: "Git & GitHub", current: 20, required: 70, color: "#EC4899", priority: "Medium" },
    { name: "Problem Solving (DSA)", current: 30, required: 80, color: "#14B8A6", priority: "High" },
  ],
  'Doctor': [
    { name: "Biology & Physiology", current: 55, required: 95, color: "#F97316", priority: "High" },
    { name: "Chemistry", current: 50, required: 90, color: "#0EA5E9", priority: "High" },
    { name: "Clinical Reasoning", current: 10, required: 85, color: "#10B981", priority: "High" },
    { name: "Anatomy", current: 20, required: 90, color: "#F59E0B", priority: "High" },
    { name: "Patient Communication", current: 30, required: 75, color: "#8B5CF6", priority: "Medium" },
    { name: "Medical Ethics", current: 15, required: 70, color: "#EC4899", priority: "Medium" },
  ],
  'Data Analyst': [
    { name: "Mathematics & Statistics", current: 45, required: 85, color: "#F97316", priority: "High" },
    { name: "Excel / Google Sheets", current: 30, required: 80, color: "#0EA5E9", priority: "High" },
    { name: "Python / R", current: 10, required: 75, color: "#10B981", priority: "High" },
    { name: "SQL", current: 15, required: 80, color: "#F59E0B", priority: "High" },
    { name: "Data Visualisation", current: 20, required: 70, color: "#8B5CF6", priority: "Medium" },
    { name: "Business Acumen", current: 25, required: 65, color: "#14B8A6", priority: "Medium" },
  ],
  'Chartered Accountant': [
    { name: "Accountancy", current: 50, required: 90, color: "#F97316", priority: "High" },
    { name: "Taxation & GST", current: 20, required: 85, color: "#0EA5E9", priority: "High" },
    { name: "Financial Reporting", current: 25, required: 80, color: "#10B981", priority: "High" },
    { name: "Auditing", current: 10, required: 75, color: "#F59E0B", priority: "High" },
    { name: "Business Law", current: 30, required: 70, color: "#8B5CF6", priority: "Medium" },
    { name: "Tally / ERP Software", current: 15, required: 65, color: "#EC4899", priority: "Medium" },
  ],
  'Teacher': [
    { name: "Subject Knowledge", current: 55, required: 90, color: "#F97316", priority: "High" },
    { name: "Communication Skills", current: 40, required: 85, color: "#0EA5E9", priority: "High" },
    { name: "Classroom Management", current: 20, required: 80, color: "#10B981", priority: "High" },
    { name: "Lesson Planning", current: 15, required: 75, color: "#F59E0B", priority: "Medium" },
    { name: "Digital Tools (PPT, Zoom)", current: 25, required: 65, color: "#8B5CF6", priority: "Medium" },
    { name: "Student Psychology", current: 20, required: 70, color: "#14B8A6", priority: "Medium" },
  ],
  'default': [
    { name: "Communication Skills", current: 35, required: 80, color: "#F97316", priority: "High" },
    { name: "Domain Knowledge", current: 25, required: 85, color: "#0EA5E9", priority: "High" },
    { name: "Problem Solving", current: 30, required: 75, color: "#10B981", priority: "High" },
    { name: "Computer Literacy", current: 40, required: 70, color: "#F59E0B", priority: "Medium" },
    { name: "English Communication", current: 35, required: 65, color: "#8B5CF6", priority: "Medium" },
    { name: "Time Management", current: 45, required: 70, color: "#EC4899", priority: "Medium" },
  ]
}

const getFallback = (careerName) => {
  if (!careerName) return DOMAIN_FALLBACKS['default']
  const key = Object.keys(DOMAIN_FALLBACKS).find(k =>
    careerName.toLowerCase().includes(k.toLowerCase())
  )
  return DOMAIN_FALLBACKS[key] || DOMAIN_FALLBACKS['default']
}

export default function SkillGap() {
  const navigate = useNavigate()
  const { selectedCareer, academicData, t } = useUser()
  const { call, loading } = useGroq()
  const [skills, setSkills] = useState(null)
  const [animated, setAnimated] = useState(false)
  const [usingAI, setUsingAI] = useState(false)

  useEffect(() => {
    const fetchSkills = async () => {
      // Always try Groq first
      if (selectedCareer?.career) {
        const data = await call('skillgap', {
          career: selectedCareer.career,
          stream: academicData?.stream || 'General',
          marks: academicData?.marks || 70
        })

        // Handle different response shapes Groq might return
        let skillsArray = null
        if (data?.skills?.length) skillsArray = data.skills
        else if (Array.isArray(data)) skillsArray = data

        if (skillsArray?.length) {
          setSkills({ career: selectedCareer.career, skills: skillsArray })
          setUsingAI(true)
          setTimeout(() => setAnimated(true), 200)
          return
        }
      }

      // Fallback — domain-specific hardcoded data
      const fallbackSkills = getFallback(selectedCareer?.career)
      setSkills({
        career: selectedCareer?.career || 'General',
        skills: fallbackSkills
      })
      setUsingAI(false)
      setTimeout(() => setAnimated(true), 200)
    }
    fetchSkills()
  }, [])

  if (loading || !skills) return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg,#FFFBF7,#FFF7ED,#F0F9FF)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '20px' }}>
      <div style={{ position: 'relative', width: 56, height: 56 }}>
        <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '3px solid #FED7AA', animation: 'spin-slow 1.2s linear infinite' }} />
        <div style={{ position: 'absolute', inset: '8px', borderRadius: '50%', border: '3px solid transparent', borderTopColor: '#F97316', animation: 'spin-slow 0.7s linear infinite' }} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>📊</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: 'var(--ink)', marginBottom: '6px' }}>
          {t('Analysing your skill gaps...', 'आपके कौशल का विश्लेषण हो रहा है...')}
        </h3>
        <p style={{ fontSize: '13px', color: 'var(--ink-60)' }}>
          {t(`For ${selectedCareer?.career || 'your career'}`, `${selectedCareer?.career || 'आपके करियर'} के लिए`)}
        </p>
      </div>
    </div>
  )

  const avgGap = Math.round(skills.skills.reduce((acc, s) => acc + (s.required - s.current), 0) / skills.skills.length)
  const readiness = Math.round(skills.skills.reduce((acc, s) => acc + s.current, 0) / skills.skills.reduce((acc, s) => acc + s.required, 0) * 100)

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #FFFBF7, #FFF7ED 30%, #F0F9FF)', overflow: 'hidden' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 24px' }}>

        {/* Header */}
        <div style={{ marginBottom: '32px', animation: 'slideUp 0.5s ease forwards' }}>
          <button onClick={() => navigate('/roadmap')} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: 'var(--ink-60)', fontSize: '14px', cursor: 'pointer', marginBottom: '16px', padding: 0 }}>
            ← {t('Back to roadmap', 'रोडमैप पर वापस')}
          </button>

          {/* AI badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', background: usingAI ? 'rgba(14,165,233,0.08)' : 'rgba(249,115,22,0.08)', borderRadius: 'var(--radius-full)', border: `1px solid ${usingAI ? 'rgba(14,165,233,0.2)' : 'rgba(249,115,22,0.2)'}`, marginBottom: '14px' }}>
            <span style={{ fontSize: '12px' }}>{usingAI ? '🤖' : '📋'}</span>
            <span style={{ fontSize: '12px', fontWeight: 600, color: usingAI ? '#0EA5E9' : '#F97316' }}>
              {usingAI
                ? t('AI-generated for your profile', 'आपकी प्रोफ़ाइल के लिए AI द्वारा तैयार')
                : t('Based on industry standards', 'उद्योग मानकों के आधार पर')}
            </span>
          </div>

          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 4vw, 38px)', color: 'var(--ink)', marginBottom: '8px' }}>
            {t('Skill Gap Analysis', 'कौशल अंतर विश्लेषण')}
          </h1>
          <p style={{ fontSize: '15px', color: 'var(--saffron)', fontWeight: 600, fontFamily: 'var(--font-head)' }}>
            {skills.career}
          </p>
        </div>

        {/* Summary cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '28px', animation: 'slideUp 0.5s 0.1s ease forwards', opacity: 0 }}>
          {[
            { label: t('Readiness', 'तैयारी'), value: `${readiness}%`, color: '#10B981', bg: '#ECFDF5', icon: '🎯' },
            { label: t('Avg Gap', 'औसत अंतर'), value: `${avgGap}%`, color: '#F97316', bg: '#FFF7ED', icon: '📈' },
            { label: t('Skills to Build', 'सीखने योग्य'), value: skills.skills.filter(s => s.required - s.current > 30).length, color: '#0EA5E9', bg: '#F0F9FF', icon: '🛠️' },
          ].map((card, i) => (
            <div key={i} style={{ padding: '20px', background: card.bg, borderRadius: 'var(--radius-lg)', border: `1px solid ${card.color}22`, textAlign: 'center' }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>{card.icon}</div>
              <div style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: '22px', color: card.color }}>{card.value}</div>
              <div style={{ fontSize: '12px', color: 'var(--ink-60)', fontWeight: 500, marginTop: '4px' }}>{card.label}</div>
            </div>
          ))}
        </div>

        {/* Skill bars */}
        <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: '28px', boxShadow: 'var(--shadow-md)', border: '1px solid var(--ink-10)', animation: 'slideUp 0.5s 0.2s ease forwards', opacity: 0 }}>
          <h3 style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '16px', color: 'var(--ink)', marginBottom: '24px' }}>
            {t('Skills Breakdown', 'कौशल विवरण')}
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {skills.skills.map((skill, i) => {
              const gap = skill.required - skill.current
              return (
                <div key={i} style={{ animation: `slideIn 0.5s ${i * 0.07}s ease forwards`, opacity: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--ink)' }}>{skill.name}</span>
                      <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: 'var(--radius-full)', background: skill.priority === 'High' ? '#FFF0E5' : '#F0F9FF', color: skill.priority === 'High' ? '#F97316' : '#0EA5E9', fontWeight: 600 }}>
                        {skill.priority}
                      </span>
                    </div>
                    <span style={{ fontSize: '12px', color: 'var(--ink-60)' }}>
                      {t('Gap:', 'अंतर:')} <strong style={{ color: gap > 50 ? '#F43F5E' : gap > 30 ? '#F97316' : '#F59E0B' }}>{gap}%</strong>
                    </span>
                  </div>

                  {/* Track */}
                  <div style={{ position: 'relative', height: '10px', background: '#F5F5F4', borderRadius: '5px', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${skill.required}%`, background: `${skill.color}20`, borderRadius: '5px' }} />
                    <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: animated ? `${skill.current}%` : '0%', background: skill.color, borderRadius: '5px', transition: `width 1s ${i * 0.1}s cubic-bezier(0.22,1,0.36,1)`, boxShadow: `0 2px 8px ${skill.color}50` }} />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
                    <span style={{ fontSize: '11px', color: skill.color, fontWeight: 600 }}>{t('Current:', 'वर्तमान:')} {skill.current}%</span>
                    <span style={{ fontSize: '11px', color: 'var(--ink-40)' }}>{t('Target:', 'लक्ष्य:')} {skill.required}%</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Top 3 to focus */}
        <div style={{ marginTop: '24px', padding: '24px', background: 'linear-gradient(135deg, #FFF7ED, #FFF0E5)', borderRadius: 'var(--radius-xl)', border: '1px solid rgba(249,115,22,0.15)', animation: 'slideUp 0.5s 0.4s ease forwards', opacity: 0 }}>
          <h3 style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '15px', color: 'var(--ink)', marginBottom: '12px' }}>
            🔥 {t('Top 3 Skills to Focus on First', 'पहले इन 3 कौशलों पर ध्यान दें')}
          </h3>
          {skills.skills
            .filter(s => s.priority === 'High')
            .sort((a, b) => (b.required - b.current) - (a.required - a.current))
            .slice(0, 3)
            .map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0', borderBottom: i < 2 ? '1px solid rgba(249,115,22,0.1)' : 'none' }}>
                <div style={{ width: 32, height: 32, borderRadius: '10px', background: `${s.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: '14px', color: s.color }}>{i + 1}</span>
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--ink)' }}>{s.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--ink-60)' }}>{s.required - s.current}% {t('gap to close', 'अंतर बंद करना है')}</div>
                </div>
              </div>
            ))}
        </div>

        {/* Nav buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '28px' }}>
          <button onClick={() => navigate('/colleges')}
            style={{ padding: '14px', borderRadius: 'var(--radius-full)', background: 'linear-gradient(135deg, #F97316, #F59E0B)', color: 'white', border: 'none', fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '14px', cursor: 'pointer', boxShadow: 'var(--shadow-saffron)', transition: 'all 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
            🎓 {t('College Finder →', 'कॉलेज खोजें →')}
          </button>
          <button onClick={() => navigate('/schemes')}
            style={{ padding: '14px', borderRadius: 'var(--radius-full)', background: 'white', color: 'var(--green)', border: '1.5px solid var(--green)', fontFamily: 'var(--font-head)', fontWeight: 600, fontSize: '14px', cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
            🏛️ {t('Govt Schemes →', 'सरकारी योजनाएं →')}
          </button>
          <button onClick={() => navigate('/interview')}
            style={{ padding: '14px', borderRadius: 'var(--radius-full)', background: 'white', color: 'var(--sky)', border: '1.5px solid var(--sky)', fontFamily: 'var(--font-head)', fontWeight: 600, fontSize: '14px', cursor: 'pointer', transition: 'all 0.2s', gridColumn: 'span 2' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
            🤖 {t('Practice Mock Interview →', 'मॉक इंटरव्यू अभ्यास →')}
          </button>
        </div>

      </div>
    </div>
  )
}
