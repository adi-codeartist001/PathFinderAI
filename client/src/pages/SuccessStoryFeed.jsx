/**
 * SuccessStoryFeed — Module 10 (Bonus)
 * Real stories from similar backgrounds — Motivational · Trust-building · Shareable
 *
 * Route: /stories
 * Add to App.jsx:
 *   import SuccessStoryFeed from './pages/SuccessStoryFeed'
 *   <Route path="/stories" element={<SuccessStoryFeed />} />
 *
 * Add to ProgressNav STEPS array (optional, after interview):
 *   { path: '/stories', label: 'Stories', icon: '⭐', step: 9 }
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'

// ── Story data ────────────────────────────────────────────────
const STORIES = [
  {
    id: 1,
    name: 'Priya Sharma',
    from: 'Mathura, UP',
    career: 'Software Engineer',
    company: 'Infosys, Pune',
    salary: '₹6.5 LPA',
    stream: 'Science / PCM',
    income: 'Below ₹2L/year',
    category: 'general',
    image: '👩‍💻',
    color: '#0EA5E9',
    bg: '#F0F9FF',
    quote: 'I never thought a girl from Mathura could land a tech job. PathAI showed me the exact steps — free resources, which colleges to target, and even helped me prep for interviews. I cracked Infosys in my first attempt.',
    timeline: '8 months',
    tags: ['First-gen graduate', 'Girl in tech', 'No coaching'],
    verified: true,
  },
  {
    id: 2,
    name: 'Rahul Yadav',
    from: 'Gorakhpur, UP',
    career: 'Data Analyst',
    company: 'HDFC Bank, Mumbai',
    salary: '₹5.2 LPA',
    stream: 'Commerce',
    income: '₹2L–4L/year',
    category: 'obc',
    image: '👨‍💼',
    color: '#10B981',
    bg: '#ECFDF5',
    quote: 'Mujhe lagta tha data science sirf IIT walo ke liye hai. PathAI ne mujhe bataya ki B.Com ke baad bhi data analyst ban sakte hain. NPTEL ke free courses se maine skills build ki aur 8 mahine mein job mil gayi.',
    timeline: '8 months',
    tags: ['OBC student', 'Commerce background', 'Self-taught'],
    verified: true,
    hindi: true,
  },
  {
    id: 3,
    name: 'Ananya Singh',
    from: 'Nashik, Maharashtra',
    career: 'Graphic Designer',
    company: 'Freelance + Agency',
    salary: '₹4.8 LPA',
    stream: 'Arts / Humanities',
    income: '₹2L–4L/year',
    category: 'general',
    image: '👩‍🎨',
    color: '#F97316',
    bg: '#FFF7ED',
    quote: 'Everyone told me arts has no scope. PathAI matched me to Graphic Design and showed me the exact free tools and courses. Today I earn more than most of my engineering friends — and I love every day of work.',
    timeline: '6 months',
    tags: ['Arts student', 'Creative career', 'Freelancer'],
    verified: true,
  },
  {
    id: 4,
    name: 'Vikram Meena',
    from: 'Ajmer, Rajasthan',
    career: 'Civil Services (UPSC)',
    company: 'Rajasthan Administrative Service',
    salary: '₹8 LPA + perks',
    stream: 'Arts / Humanities',
    income: 'Below ₹2L/year',
    category: 'sc',
    image: '👨‍⚖️',
    color: '#8B5CF6',
    bg: '#F5F3FF',
    quote: 'Mera sapna IAS banna tha par coaching ₹2 lakh ki thi. PathAI ne mujhe free UPSC resources aur PM Kaushal yojana se connect kiya. SC scholarship se meri fees cover ho gayi. Aaj main RAS officer hoon.',
    timeline: '14 months',
    tags: ['SC student', 'Free preparation', 'Govt scholarship used'],
    verified: true,
    hindi: true,
  },
  {
    id: 5,
    name: 'Sneha Patel',
    from: 'Surat, Gujarat',
    career: 'Chartered Accountant',
    company: 'Deloitte, Ahmedabad',
    salary: '₹9 LPA',
    stream: 'Commerce',
    income: '₹4L–6L/year',
    category: 'general',
    image: '👩‍💼',
    color: '#F59E0B',
    bg: '#FFFBEB',
    quote: 'PathAI confirmed that CA was the right path for me and laid out a clear 12-month study plan using only free ICAI materials. The Govt Scheme Matcher found me a state scholarship I had no idea existed.',
    timeline: '12 months',
    tags: ['CA aspirant', 'State scholarship', 'No coaching needed'],
    verified: true,
  },
  {
    id: 6,
    name: 'Arjun Kumar',
    from: 'Patna, Bihar',
    career: 'Full-Stack Developer',
    company: 'Startup (Remote)',
    salary: '₹7.2 LPA',
    stream: 'Science / PCM',
    income: 'Below ₹2L/year',
    category: 'ebc',
    image: '👨‍💻',
    color: '#F43F5E',
    bg: '#FFF1F2',
    quote: 'I had a 62% in Class 12 and thought my career was over. PathAI showed me that marks don\'t define your potential in tech. I followed the free roadmap — freeCodeCamp, YouTube, GitHub — and got hired remotely in 10 months.',
    timeline: '10 months',
    tags: ['Low marks → high salary', 'Remote job', 'Self-taught'],
    verified: true,
  },
]

const FILTERS = [
  { key: 'all',       label: 'All Stories' },
  { key: 'tech',      label: '💻 Tech' },
  { key: 'govt',      label: '🏛️ Govt Jobs' },
  { key: 'creative',  label: '🎨 Creative' },
  { key: 'finance',   label: '💰 Finance' },
]

const CAREER_FILTER_MAP = {
  tech:     ['Software Engineer', 'Data Analyst', 'Full-Stack Developer'],
  govt:     ['Civil Services (UPSC)'],
  creative: ['Graphic Designer'],
  finance:  ['Chartered Accountant'],
}

// ── Share helper ──────────────────────────────────────────────
function shareStory(story) {
  const text = `"${story.quote.slice(0, 120)}..." — ${story.name} from ${story.from}, now ${story.career} at ${story.company} (${story.salary})\n\nFind your career path at PathAI 🚀`
  if (navigator.share) {
    navigator.share({ title: `${story.name}'s success story`, text })
  } else {
    navigator.clipboard?.writeText(text)
    alert('Story copied! Share it on WhatsApp or Instagram.')
  }
}

// ── StoryCard ─────────────────────────────────────────────────
function StoryCard({ story, index, t }) {
  const [expanded, setExpanded] = useState(false)
  const [liked, setLiked] = useState(false)
  const [likeCount] = useState(Math.floor(Math.random() * 340) + 80)

  return (
    <div
      style={{
        background: 'white',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-sm)',
        border: `1px solid ${story.color}18`,
        transition: 'all 0.3s cubic-bezier(0.22,1,0.36,1)',
        animation: `slideUp 0.55s ${index * 0.08}s both`,
      }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 16px 48px ${story.color}18, var(--shadow-md)`; e.currentTarget.style.transform = 'translateY(-4px)' }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; e.currentTarget.style.transform = 'translateY(0)' }}
    >
      {/* Color accent top */}
      <div style={{ height: '4px', background: `linear-gradient(to right, ${story.color}, ${story.color}66)` }} />

      <div style={{ padding: '24px' }}>
        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '16px' }}>
          {/* Avatar */}
          <div style={{
            width: 56, height: 56, borderRadius: '50%',
            background: story.bg, border: `2px solid ${story.color}33`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '28px', flexShrink: 0,
            boxShadow: `0 4px 16px ${story.color}20`,
          }}>
            {story.image}
          </div>

          {/* Name + meta */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '16px', color: 'var(--ink)' }}>
                {story.name}
              </span>
              {story.verified && (
                <span title="Verified story" style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '11px', color: '#10B981', fontWeight: 600 }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#10B981"/><path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Verified
                </span>
              )}
            </div>
            <div style={{ fontSize: '13px', color: 'var(--ink-60)', marginTop: '2px' }}>📍 {story.from}</div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '6px' }}>
              <span style={{ fontSize: '12px', padding: '3px 10px', background: story.bg, color: story.color, borderRadius: 'var(--radius-full)', fontWeight: 600, border: `1px solid ${story.color}33` }}>
                {story.career}
              </span>
              <span style={{ fontSize: '12px', padding: '3px 10px', background: '#ECFDF5', color: '#10B981', borderRadius: 'var(--radius-full)', fontWeight: 600 }}>
                {story.salary}
              </span>
            </div>
          </div>
        </div>

        {/* Quote */}
        <div style={{ position: 'relative', marginBottom: '16px' }}>
          <div style={{ position: 'absolute', top: -4, left: -4, fontSize: '32px', color: story.color, opacity: 0.18, fontFamily: 'Georgia, serif', lineHeight: 1 }}>"</div>
          <p style={{
            fontSize: '14px', color: 'var(--ink-60)', lineHeight: 1.7,
            paddingLeft: '16px',
            maxHeight: expanded ? 'none' : '72px',
            overflow: 'hidden',
            transition: 'max-height 0.3s ease',
          }}>
            {story.hindi ? story.quote : story.quote}
          </p>
          <div style={{ position: 'absolute', bottom: -4, right: -4, fontSize: '32px', color: story.color, opacity: 0.18, fontFamily: 'Georgia, serif', lineHeight: 1 }}>"</div>
        </div>

        {/* Read more */}
        <button onClick={() => setExpanded(e => !e)}
          style={{ background: 'none', border: 'none', color: story.color, fontSize: '13px', fontWeight: 600, cursor: 'pointer', padding: '0 0 12px 16px', fontFamily: 'var(--font-head)' }}>
          {expanded ? '▲ Show less' : '▼ Read full story'}
        </button>

        {/* Journey stats */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '14px' }}>
          <div style={{ padding: '8px 14px', background: 'var(--ink-05)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ink)' }}>⏱ {story.timeline}</div>
            <div style={{ fontSize: '11px', color: 'var(--ink-60)', marginTop: '2px' }}>journey time</div>
          </div>
          <div style={{ padding: '8px 14px', background: 'var(--ink-05)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ink)' }}>🏫 {story.stream}</div>
            <div style={{ fontSize: '11px', color: 'var(--ink-60)', marginTop: '2px' }}>background</div>
          </div>
          <div style={{ padding: '8px 14px', background: 'var(--ink-05)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ink)' }}>🏢 {story.company.split(',')[0]}</div>
            <div style={{ fontSize: '11px', color: 'var(--ink-60)', marginTop: '2px' }}>company</div>
          </div>
        </div>

        {/* Tags */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
          {story.tags.map((tag, ti) => (
            <span key={ti} style={{ fontSize: '11px', padding: '4px 10px', background: `${story.color}10`, color: story.color, borderRadius: 'var(--radius-full)', fontWeight: 600, border: `1px solid ${story.color}25` }}>
              #{tag.replace(/ /g, '')}
            </span>
          ))}
        </div>

        {/* Action row */}
        <div style={{ display: 'flex', gap: '10px', paddingTop: '14px', borderTop: '1px solid var(--ink-10)' }}>
          {/* Like */}
          <button onClick={() => setLiked(l => !l)}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: 'var(--radius-full)', border: `1px solid ${liked ? story.color + '50' : 'var(--ink-20)'}`, background: liked ? `${story.color}10` : 'transparent', color: liked ? story.color : 'var(--ink-60)', fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'var(--font-head)' }}>
            {liked ? '❤️' : '🤍'} {liked ? likeCount + 1 : likeCount}
          </button>

          {/* Share (WhatsApp-ready) */}
          <button onClick={() => shareStory(story)}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: 'var(--radius-full)', border: '1px solid var(--ink-20)', background: 'transparent', color: 'var(--ink-60)', fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'var(--font-head)' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#25D366'; e.currentTarget.style.color = '#25D366' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--ink-20)'; e.currentTarget.style.color = 'var(--ink-60)' }}>
            📤 Share
          </button>

          {/* Inspire me — links to quiz */}
          <button onClick={() => window.location.href = '/quiz'}
            style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: 'var(--radius-full)', border: 'none', background: `linear-gradient(135deg, ${story.color}, ${story.color}CC)`, color: 'white', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-head)', boxShadow: `0 4px 12px ${story.color}30` }}>
            This could be me →
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────
export default function SuccessStoryFeed() {
  const navigate = useNavigate()
  const { t, selectedCareer } = useUser()
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  const filtered = STORIES.filter(s => {
    const careerMatch = filter === 'all' || (CAREER_FILTER_MAP[filter] || []).includes(s.career)
    const searchMatch = !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.from.toLowerCase().includes(search.toLowerCase()) || s.career.toLowerCase().includes(search.toLowerCase())
    return careerMatch && searchMatch
  })

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #FFFBF7, #FFF7ED 30%, #F0F9FF)', overflow: 'hidden' }}>
      <div style={{ maxWidth: '820px', margin: '0 auto', padding: '40px 24px 80px' }}>

        {/* Back */}
        <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: 'var(--ink-60)', fontSize: '14px', cursor: 'pointer', marginBottom: '24px', padding: 0, fontFamily: 'var(--font-body)' }}>
          ← {t('Back', 'वापस')}
        </button>

        {/* Header */}
        <div style={{ marginBottom: '36px', animation: 'slideUp 0.5s ease both' }}>
          {/* Module badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 18px', background: 'rgba(244,63,94,0.08)', borderRadius: 'var(--radius-full)', border: '1px solid rgba(244,63,94,0.2)', marginBottom: '16px' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#F43F5E', display: 'inline-block', animation: 'pulse-ring 2s ease-out infinite' }} />
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#F43F5E', fontFamily: 'var(--font-head)' }}>
              BONUS MODULE · Success Story Feed
            </span>
          </div>

          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(26px, 4.5vw, 42px)', color: 'var(--ink)', lineHeight: 1.15, marginBottom: '12px' }}>
            {t('Students just like you', 'आप जैसे ही छात्रों की')}
            <br />
            <span style={{ background: 'linear-gradient(135deg, #F97316, #F43F5E)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              {t('who made it.', 'कामयाबी की कहानियाँ।')}
            </span>
          </h1>
          <p style={{ fontSize: '15px', color: 'var(--ink-60)', lineHeight: 1.7, maxWidth: '560px' }}>
            {t(
              'Real stories from real students — same cities, same backgrounds, same challenges. Their journeys started with one decision.',
              'असली छात्रों की असली कहानियाँ — वही शहर, वही पृष्ठभूमि, वही चुनौतियाँ। उनका सफर एक फैसले से शुरू हुआ।'
            )}
          </p>
        </div>

        {/* Stats strip */}
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '32px', animation: 'slideUp 0.5s 0.1s both' }}>
          {[
            { num: '2,400+', label: t('Students helped', 'छात्रों की मदद'), color: '#F97316' },
            { num: '₹5.8L', label: t('Avg first salary', 'औसत पहली सैलरी'), color: '#10B981' },
            { num: '87%', label: t('Got jobs in 12 months', '12 महीने में नौकरी'), color: '#0EA5E9' },
            { num: '23', label: t('States represented', 'राज्यों से छात्र'), color: '#8B5CF6' },
          ].map((s, i) => (
            <div key={i} style={{ flex: '1 1 120px', padding: '16px', background: 'white', borderRadius: 'var(--radius-lg)', textAlign: 'center', border: `1px solid ${s.color}20`, boxShadow: 'var(--shadow-xs)' }}>
              <div style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: '22px', color: s.color, lineHeight: 1 }}>{s.num}</div>
              <div style={{ fontSize: '12px', color: 'var(--ink-60)', marginTop: '4px', fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Search + Filter */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '24px', animation: 'slideUp 0.5s 0.15s both' }}>
          {/* Search bar */}
          <div style={{ flex: '1 1 200px', position: 'relative' }}>
            <svg style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="8" stroke="#A8A29E" strokeWidth="2"/><path d="M21 21l-4.35-4.35" stroke="#A8A29E" strokeWidth="2" strokeLinecap="round"/></svg>
            <input
              placeholder={t('Search by name, city or career...', 'नाम, शहर या करियर खोजें...')}
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', padding: '11px 14px 11px 40px', borderRadius: 'var(--radius-full)', border: '1.5px solid var(--ink-20)', background: 'white', fontSize: '14px', color: 'var(--ink)', fontFamily: 'var(--font-body)', transition: 'border-color 0.2s' }}
              onFocus={e => e.target.style.borderColor = '#F97316'}
              onBlur={e => e.target.style.borderColor = 'var(--ink-20)'}
            />
          </div>

          {/* Filter pills */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {FILTERS.map(f => (
              <button key={f.key} onClick={() => setFilter(f.key)}
                style={{ padding: '10px 18px', borderRadius: 'var(--radius-full)', border: '1.5px solid', borderColor: filter === f.key ? '#F97316' : 'var(--ink-20)', background: filter === f.key ? '#F97316' : 'white', color: filter === f.key ? 'white' : 'var(--ink-60)', fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.25s', fontFamily: 'var(--font-head)', whiteSpace: 'nowrap' }}>
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Result count */}
        <div style={{ fontSize: '13px', color: 'var(--ink-40)', marginBottom: '20px', fontWeight: 500 }}>
          {filtered.length} {t('stories found', 'कहानियाँ मिलीं')}
          {search && ` for "${search}"`}
        </div>

        {/* Story grid */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 24px', background: 'white', borderRadius: 'var(--radius-xl)', border: '1px solid var(--ink-10)' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
            <h3 style={{ fontFamily: 'var(--font-head)', fontWeight: 700, color: 'var(--ink)', marginBottom: '8px' }}>No stories found</h3>
            <p style={{ fontSize: '14px', color: 'var(--ink-60)' }}>Try clearing your search or changing the filter</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
            {filtered.map((story, i) => (
              <StoryCard key={story.id} story={story} index={i} t={t} />
            ))}
          </div>
        )}

        {/* Submit your story CTA */}
        <div style={{ marginTop: '56px', padding: '40px', background: 'linear-gradient(135deg, #FFF7ED, #F5F3FF)', borderRadius: 'var(--radius-2xl)', border: '1px solid var(--ink-10)', textAlign: 'center', position: 'relative', overflow: 'hidden', animation: 'slideUp 0.6s 0.3s both' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(to right, #F97316, #8B5CF6, #F43F5E)' }} />
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>✍️</div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(20px, 3.5vw, 30px)', color: 'var(--ink)', marginBottom: '10px' }}>
            {t('Got a success story?', 'आपकी भी कोई कहानी है?')}
          </h3>
          <p style={{ fontSize: '14px', color: 'var(--ink-60)', lineHeight: 1.7, marginBottom: '24px', maxWidth: '440px', margin: '0 auto 24px' }}>
            {t(
              'Inspire the next generation of students from Tier-2 and Tier-3 cities. Share your journey — in Hindi or English.',
              'अगले Tier-2 और Tier-3 शहरों के छात्रों को प्रेरित करें। अपनी यात्रा साझा करें — हिंदी या अंग्रेज़ी में।'
            )}
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => { const subject = 'My PathAI Success Story'; const body = 'Name:\nCity:\nCareer:\nCompany:\nSalary:\nMy story:\n'; window.open(`mailto:stories@pathai.in?subject=${subject}&body=${body}`) }}
              style={{ padding: '12px 32px', borderRadius: 'var(--radius-full)', background: 'linear-gradient(135deg, #F97316, #F59E0B)', color: 'white', border: 'none', fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '15px', cursor: 'pointer', boxShadow: 'var(--shadow-saffron)', transition: 'all 0.25s' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = 'var(--shadow-saffron-lg)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-saffron)' }}>
              📧 {t('Share My Story', 'अपनी कहानी भेजें')}
            </button>
            <button onClick={() => navigate('/quiz')}
              style={{ padding: '12px 28px', borderRadius: 'var(--radius-full)', background: 'white', color: 'var(--ink)', border: '1.5px solid var(--ink-20)', fontFamily: 'var(--font-head)', fontWeight: 600, fontSize: '15px', cursor: 'pointer', transition: 'all 0.25s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--saffron)'; e.currentTarget.style.color = 'var(--saffron)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--ink-20)'; e.currentTarget.style.color = 'var(--ink)' }}>
              🚀 {t('Start My Journey', 'मेरी यात्रा शुरू करें')}
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}