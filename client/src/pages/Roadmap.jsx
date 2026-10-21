import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import { useGroq } from '../hooks/useGroq'

const DUMMY_ROADMAP = {
  career: "Software Engineer",
  phases: [
    { month: "0–3 months", title: "Foundation", color: "#F97316", items: ["Learn HTML, CSS, JavaScript basics", "Complete FreeCodeCamp Responsive Web Design", "Build 2 simple static websites", "Open a GitHub account and push code daily"], resources: ["freeCodeCamp.org (Free)", "The Odin Project (Free)", "YouTube: Traversy Media"] },
    { month: "3–6 months", title: "Core Skills", color: "#0EA5E9", items: ["Learn React.js fundamentals", "Understand REST APIs and databases", "Build 3 full-stack mini projects", "Start solving problems on LeetCode (Easy)"], resources: ["React Official Docs (Free)", "MongoDB University (Free)", "CS50 by Harvard on edX (Free)"] },
    { month: "6–12 months", title: "Job Ready", color: "#10B981", items: ["Build a strong portfolio with 5 projects", "Contribute to open source on GitHub", "Apply to 10 companies weekly", "Prepare for DSA interviews"], resources: ["Naukri.com / LinkedIn (Free)", "GeeksForGeeks DSA (Free)", "Internshala for internships (Free)"] },
  ]
}

export default function Roadmap() {
  const navigate = useNavigate()
  const { selectedCareer, academicData, t } = useUser()
  const { call, loading } = useGroq()
  const [roadmap, setRoadmap] = useState(null)
  const [activePhase, setActivePhase] = useState(0)

  useEffect(() => {
    const fetch = async () => {
      if (!selectedCareer) { setRoadmap(DUMMY_ROADMAP); return }
      const data = await call('roadmap', { career: selectedCareer.career, marks: academicData?.marks, stream: academicData?.stream })
      setRoadmap(data?.roadmap || DUMMY_ROADMAP)
    }
    fetch()
  }, [])

  if (loading || !roadmap) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg,#FFFBF7,#FFF7ED,#F0F9FF)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px' }}>
        <div style={{ width: 48, height: 48, borderRadius: '50%', border: '3px solid transparent', borderTopColor: '#F97316', animation: 'spin-slow 0.8s linear infinite' }} />
        <span style={{ fontSize: '15px', color: 'var(--ink-60)' }}>{t('Building your roadmap...', 'आपका रोडमैप बन रहा है...')}</span>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #FFFBF7, #FFF7ED 30%, #F0F9FF)', overflow: 'hidden' }}>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 24px' }}>

        {/* Header */}
        <div style={{ marginBottom: '40px', animation: 'slideUp 0.5s ease forwards' }}>
          <button onClick={() => navigate('/result')} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: 'var(--ink-60)', fontSize: '14px', cursor: 'pointer', marginBottom: '20px', padding: '0' }}>
            ← {t('Back to results', 'परिणामों पर वापस')}
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: 56, height: 56, borderRadius: '16px', background: 'linear-gradient(135deg, #FFF7ED, #FED7AA)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', border: '1px solid rgba(249,115,22,0.2)' }}>🗺️</div>
            <div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 4vw, 36px)', color: 'var(--ink)', lineHeight: 1.2 }}>
                {t('Your Roadmap', 'आपका रोडमैप')}
              </h1>
              <p style={{ fontSize: '14px', color: 'var(--saffron)', fontWeight: 600, fontFamily: 'var(--font-head)' }}>{roadmap.career}</p>
            </div>
          </div>
        </div>

        {/* Phase tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', background: 'white', padding: '6px', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', animation: 'slideUp 0.5s 0.1s ease forwards', opacity: 0 }}>
          {roadmap.phases.map((phase, i) => (
            <button key={i} onClick={() => setActivePhase(i)} style={{ flex: 1, padding: '12px 8px', borderRadius: 'var(--radius-md)', border: 'none', background: activePhase === i ? phase.color : 'transparent', color: activePhase === i ? 'white' : 'var(--ink-60)', fontFamily: 'var(--font-head)', fontWeight: 600, fontSize: '13px', cursor: 'pointer', transition: 'all 0.25s' }}>
              {phase.month}
            </button>
          ))}
        </div>

        {/* Active phase content */}
        {roadmap.phases.map((phase, i) => i === activePhase && (
          <div key={i} style={{ animation: 'scaleIn 0.3s ease forwards' }}>

            {/* Phase header */}
            <div style={{ padding: '24px', background: `${phase.color}10`, borderRadius: 'var(--radius-xl)', border: `1px solid ${phase.color}25`, marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: phase.color }} />
                <span style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '18px', color: 'var(--ink)' }}>{phase.title}</span>
                <span style={{ fontSize: '13px', padding: '3px 12px', background: phase.color, color: 'white', borderRadius: 'var(--radius-full)', fontWeight: 600 }}>{phase.month}</span>
              </div>
            </div>

            {/* Milestones */}
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '15px', color: 'var(--ink)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: 24, height: 24, borderRadius: '8px', background: `${phase.color}20`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>🎯</span>
                {t('Milestones', 'लक्ष्य')}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {phase.items.map((item, j) => (
                  <div key={j} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', padding: '16px', background: 'white', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--ink-10)', animation: `slideIn 0.4s ${j * 0.08}s ease forwards`, opacity: 0 }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: `${phase.color}15`, border: `2px solid ${phase.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: phase.color }}>{j + 1}</span>
                    </div>
                    <span style={{ fontSize: '15px', color: 'var(--ink)', lineHeight: 1.5, fontWeight: 400 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Resources */}
            <div style={{ padding: '24px', background: 'white', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--ink-10)' }}>
              <h3 style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '15px', color: 'var(--ink)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>📚</span> {t('Free Resources', 'मुफ़्त संसाधन')}
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {phase.resources.map((res, j) => (
                  <span key={j} style={{ padding: '8px 16px', background: `${phase.color}10`, color: phase.color, borderRadius: 'var(--radius-full)', fontSize: '13px', fontWeight: 500, border: `1px solid ${phase.color}25` }}>
                    ✓ {res}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '32px', gap: '16px' }}>
          <button onClick={() => navigate('/skillgap')} style={{ flex: 1, padding: '14px', borderRadius: 'var(--radius-full)', background: 'white', color: 'var(--ink)', border: '1.5px solid var(--ink-20)', fontFamily: 'var(--font-head)', fontWeight: 600, fontSize: '15px', cursor: 'pointer', transition: 'all 0.2s' }}>
            {t('Skill Gap Analysis →', 'कौशल अंतर विश्लेषण →')}
          </button>
          <button onClick={() => navigate('/schemes')} style={{ flex: 1, padding: '14px', borderRadius: 'var(--radius-full)', background: 'linear-gradient(135deg, #F97316, #F59E0B)', color: 'white', border: 'none', fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '15px', cursor: 'pointer', boxShadow: 'var(--shadow-saffron)', transition: 'all 0.2s' }}>
            {t('Govt Schemes →', 'सरकारी योजनाएं →')}
          </button>
        </div>
      </div>
    </div>
  )
}
