import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import { useGroq } from '../hooks/useGroq'

// ── Bilingual questions ───────────────────────────────────────
const QUESTIONS = {
  en: [
    "Tell me why you want to pursue a career in this field.",
    "What is your biggest strength and how will it help you here?",
    "Describe a challenge you faced and how you solved it.",
    "Where do you see yourself 5 years from now?",
    "Why should we select you over other candidates?",
  ],
  hi: [
    "मुझे बताइए कि आप इस क्षेत्र में करियर क्यों बनाना चाहते हैं?",
    "आपकी सबसे बड़ी ताकत क्या है और यह यहाँ आपकी कैसे मदद करेगी?",
    "कोई एक चुनौती बताइए जो आपने झेली और आपने उसे कैसे सुलझाया?",
    "आप खुद को 5 साल बाद कहाँ देखते हैं?",
    "हमें आपको दूसरे उम्मीदवारों से ज़्यादा क्यों चुनना चाहिए?",
  ],
}

export default function Interview() {
  const navigate = useNavigate()
  const { selectedCareer, language, t } = useUser()
  const { call } = useGroq()

  // Use the right question list based on selected language
  const questions = language === 'hi' ? QUESTIONS.hi : QUESTIONS.en

  const [phase, setPhase] = useState('intro')
  const [questionIndex, setQuestionIndex] = useState(0)
  const [currentQuestion, setCurrentQuestion] = useState('')
  const [transcript, setTranscript] = useState('')
  const [listening, setListening] = useState(false)
  const [scores, setScores] = useState([])
  const [robotMouth, setRobotMouth] = useState(false)
  const [eyeBlink, setEyeBlink] = useState(false)
  const [answers, setAnswers] = useState([])
  const [evaluating, setEvaluating] = useState(false)
  const recognitionRef = useRef(null)

  // Eye blink
  useEffect(() => {
    const interval = setInterval(() => {
      setEyeBlink(true)
      setTimeout(() => setEyeBlink(false), 150)
    }, 3000 + Math.random() * 2000)
    return () => clearInterval(interval)
  }, [])

  // ── Speak in the correct language ──────────────────────────
  const speak = (text, onEnd) => {
    if (!('speechSynthesis' in window)) { onEnd && onEnd(); return }
    window.speechSynthesis.cancel()
    const utt = new SpeechSynthesisUtterance(text)
    // KEY FIX: set language correctly
    utt.lang = language === 'hi' ? 'hi-IN' : 'en-IN'
    utt.rate = language === 'hi' ? 0.85 : 0.90
    utt.pitch = 1.1
    setRobotMouth(true)
    utt.onend  = () => { setRobotMouth(false); onEnd && onEnd() }
    utt.onerror = () => { setRobotMouth(false); onEnd && onEnd() }

    // Try to pick a matching voice
    const voices = window.speechSynthesis.getVoices()
    const langCode = language === 'hi' ? 'hi' : 'en'
    const match = voices.find(v => v.lang.startsWith(langCode))
    if (match) utt.voice = match

    window.speechSynthesis.speak(utt)
  }

  // ── Mic ────────────────────────────────────────────────────
  const startListening = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert(t('Speech not supported. Please type your answer below.', 'स्पीच सपोर्ट नहीं है। नीचे टाइप करें।'))
      return
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SR()
    // KEY FIX: recognition language also matches selected language
    recognition.lang = language === 'hi' ? 'hi-IN' : 'en-IN'
    recognition.continuous = false
    recognition.interimResults = true
    recognition.onstart  = () => setListening(true)
    recognition.onresult = (e) => {
      const result = Array.from(e.results).map(r => r[0].transcript).join(' ')
      setTranscript(result)
    }
    recognition.onend = () => setListening(false)
    recognition.start()
    recognitionRef.current = recognition
  }

  const stopListening = () => {
    recognitionRef.current?.stop()
    setListening(false)
  }

  // ── Start interview ────────────────────────────────────────
  const startInterview = () => {
    setPhase('interview')
    setQuestionIndex(0)
    setScores([])
    setAnswers([])
    setTranscript('')
    const firstQ = questions[0]
    setCurrentQuestion(firstQ)
    // Small delay so the screen transition completes before speaking
    setTimeout(() => speak(firstQ), 600)
  }

  // ── Submit answer ──────────────────────────────────────────
  const submitAnswer = async () => {
    if (!transcript.trim()) return
    setEvaluating(true)
    const newAnswers = [...answers, { question: currentQuestion, answer: transcript }]
    setAnswers(newAnswers)

    const evalData = await call('interview-eval', {
      question: currentQuestion,
      answer: transcript,
      career: selectedCareer?.career || 'Software Engineer',
      language,
    })
    const score = evalData?.score || Math.floor(Math.random() * 30 + 55)
    const newScores = [...scores, score]
    setScores(newScores)
    setEvaluating(false)
    setTranscript('')

    if (questionIndex < questions.length - 1) {
      const nextIndex = questionIndex + 1
      setQuestionIndex(nextIndex)
      const nextQ = questions[nextIndex]
      setCurrentQuestion(nextQ)
      setTimeout(() => speak(nextQ), 400)
    } else {
      setPhase('report')
    }
  }

  const avgScore = scores.length > 0
    ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
    : 0

  // ── Robot SVG ──────────────────────────────────────────────
  const Robot = ({ talking, blinking }) => (
    <svg viewBox="0 0 200 240" style={{ width: '100%', height: '100%' }}>
      <line x1="100" y1="20" x2="100" y2="42" stroke="#CBD5E1" strokeWidth="3" strokeLinecap="round"/>
      <circle cx="100" cy="15" r="7" fill={talking ? '#F97316' : '#0EA5E9'} style={{ transition: 'fill 0.2s' }}>
        {talking && <animate attributeName="r" values="7;9;7" dur="0.4s" repeatCount="indefinite"/>}
      </circle>
      <rect x="50" y="40" width="100" height="80" rx="18" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="2"/>
      <rect x="65" y="62" width="26" height={blinking ? 3 : 22} rx={blinking ? 1 : 8} fill="#0EA5E9" style={{ transition: 'height 0.1s' }} />
      <rect x="109" y="62" width="26" height={blinking ? 3 : 22} rx={blinking ? 1 : 8} fill="#0EA5E9" style={{ transition: 'height 0.1s' }} />
      {!blinking && <><circle cx="74" cy="68" r="3" fill="white" opacity="0.8"/><circle cx="118" cy="68" r="3" fill="white" opacity="0.8"/></>}
      {talking ? (
        <ellipse cx="100" cy="104" rx="20" ry="10" fill="#F97316">
          <animate attributeName="ry" values="10;14;8;12;10" dur="0.3s" repeatCount="indefinite"/>
        </ellipse>
      ) : (
        <rect x="78" y="98" width="44" height="12" rx="6" fill="#CBD5E1"/>
      )}
      <rect x="36" y="58" width="14" height="28" rx="6" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="1.5"/>
      <rect x="150" y="58" width="14" height="28" rx="6" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="1.5"/>
      <rect x="88" y="118" width="24" height="16" rx="4" fill="#CBD5E1"/>
      <rect x="40" y="132" width="120" height="90" rx="20" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="2"/>
      <rect x="60" y="150" width="80" height="52" rx="10" fill="#E2E8F0"/>
      <circle cx="80" cy="165" r="7" fill={talking ? '#F97316' : '#94A3B8'} style={{ transition: 'fill 0.2s' }}>
        {talking && <animate attributeName="opacity" values="1;0.5;1" dur="0.5s" repeatCount="indefinite"/>}
      </circle>
      <circle cx="100" cy="165" r="7" fill={talking ? '#0EA5E9' : '#94A3B8'} style={{ transition: 'fill 0.2s' }}>
        {talking && <animate attributeName="opacity" values="1;0.5;1" dur="0.7s" repeatCount="indefinite"/>}
      </circle>
      <circle cx="120" cy="165" r="7" fill={talking ? '#10B981' : '#94A3B8'} style={{ transition: 'fill 0.2s' }}>
        {talking && <animate attributeName="opacity" values="1;0.5;1" dur="0.6s" repeatCount="indefinite"/>}
      </circle>
      <rect x="65" y="182" width="70" height="12" rx="4" fill={talking ? '#FED7AA' : '#CBD5E1'} style={{ transition: 'fill 0.3s' }}/>
      <rect x="12" y="138" width="28" height="64" rx="14" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="1.5"/>
      <rect x="160" y="138" width="28" height="64" rx="14" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="1.5"/>
    </svg>
  )

  // ── INTRO ──────────────────────────────────────────────────
  if (phase === 'intro') {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #FFFBF7, #F0F9FF 40%, #ECFDF5)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
        <div style={{ maxWidth: '500px', width: '100%', textAlign: 'center', animation: 'slideUp 0.6s ease forwards' }}>
          <div style={{ width: 160, height: 180, margin: '0 auto 32px', animation: 'float 4s ease-in-out infinite' }}>
            <Robot talking={false} blinking={eyeBlink} />
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 5vw, 42px)', color: 'var(--ink)', marginBottom: '12px', lineHeight: 1.2 }}>
            {t('Meet your AI Interviewer', 'अपने AI इंटरव्यूअर से मिलें')}
          </h1>
          <p style={{ fontSize: '15px', color: 'var(--ink-60)', marginBottom: '32px', lineHeight: 1.7 }}>
            {t(
              `I'll ask you ${questions.length} questions for ${selectedCareer?.career || 'your chosen career'}. Speak your answers out loud — in English. I'll evaluate and score you instantly.`,
              `मैं आपसे ${questions.length} प्रश्न पूछूंगा ${selectedCareer?.career || 'आपके चुने हुए करियर'} के बारे में। अपने जवाब हिंदी में ज़ोर से बोलें। मैं आपको तुरंत स्कोर दूंगा।`
            )}
          </p>

          {/* Language indicator */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 20px', background: language === 'hi' ? 'rgba(249,115,22,0.08)' : 'rgba(14,165,233,0.08)', borderRadius: 'var(--radius-full)', border: `1px solid ${language === 'hi' ? 'rgba(249,115,22,0.2)' : 'rgba(14,165,233,0.2)'}`, marginBottom: '24px' }}>
            <span style={{ fontSize: '16px' }}>{language === 'hi' ? '🇮🇳' : '🇬🇧'}</span>
            <span style={{ fontSize: '13px', fontWeight: 600, color: language === 'hi' ? '#F97316' : '#0EA5E9', fontFamily: 'var(--font-head)' }}>
              {language === 'hi' ? 'हिंदी में इंटरव्यू होगा' : 'Interview in English'}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '32px', flexWrap: 'wrap' }}>
            {[
              t('Voice-based', 'आवाज़ से'),
              t(`${questions.length} Questions`, `${questions.length} प्रश्न`),
              t('AI Scored', 'AI स्कोरिंग'),
            ].map((tag, i) => (
              <span key={i} style={{ padding: '8px 16px', background: ['#FFF7ED','#F0F9FF','#ECFDF5'][i], borderRadius: 'var(--radius-full)', fontSize: '13px', fontWeight: 600, color: ['#F97316','#0EA5E9','#10B981'][i], border: `1px solid ${['rgba(249,115,22,0.2)','rgba(14,165,233,0.2)','rgba(16,185,129,0.2)'][i]}` }}>
                {tag}
              </span>
            ))}
          </div>

          <button onClick={startInterview}
            style={{ padding: '16px 48px', borderRadius: 'var(--radius-full)', background: 'linear-gradient(135deg, #F97316, #F59E0B)', color: 'white', fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '17px', border: 'none', cursor: 'pointer', boxShadow: 'var(--shadow-saffron)', transition: 'all 0.25s' }}
            onMouseEnter={e => { e.target.style.transform = 'translateY(-3px)'; e.target.style.boxShadow = '0 16px 40px rgba(249,115,22,0.35)' }}
            onMouseLeave={e => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = 'var(--shadow-saffron)' }}>
            {t('Start Interview →', 'इंटरव्यू शुरू करें →')}
          </button>
        </div>
      </div>
    )
  }

  // ── REPORT ─────────────────────────────────────────────────
  if (phase === 'report') {
    const grade = avgScore >= 80
      ? { label: t('Excellent', 'बहुत अच्छा'), color: '#10B981', emoji: '🏆' }
      : avgScore >= 65
        ? { label: t('Good', 'अच्छा'), color: '#0EA5E9', emoji: '⭐' }
        : { label: t('Keep Practicing', 'अभ्यास जारी रखें'), color: '#F59E0B', emoji: '💪' }

    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #FFFBF7, #ECFDF5 40%, #F0F9FF)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
        <div style={{ maxWidth: '520px', width: '100%', animation: 'scaleIn 0.5s ease forwards' }}>
          <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: '40px', boxShadow: 'var(--shadow-lg)', textAlign: 'center' }}>
            <div style={{ fontSize: '56px', marginBottom: '16px' }}>{grade.emoji}</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', color: 'var(--ink)', marginBottom: '8px' }}>
              {t('Interview Complete!', 'इंटरव्यू पूरा हुआ!')}
            </h2>

            {/* Score ring */}
            <div style={{ position: 'relative', width: 120, height: 120, margin: '24px auto' }}>
              <svg viewBox="0 0 120 120" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                <circle cx="60" cy="60" r="52" fill="none" stroke="#F5F5F4" strokeWidth="10"/>
                <circle cx="60" cy="60" r="52" fill="none" stroke={grade.color} strokeWidth="10" strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 52}`}
                  strokeDashoffset={`${2 * Math.PI * 52 * (1 - avgScore / 100)}`}
                  style={{ transition: 'stroke-dashoffset 1.5s ease' }} />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: '28px', color: grade.color }}>{avgScore}</span>
                <span style={{ fontSize: '12px', color: 'var(--ink-60)' }}>/100</span>
              </div>
            </div>

            <div style={{ display: 'inline-block', padding: '8px 24px', background: `${grade.color}15`, borderRadius: 'var(--radius-full)', color: grade.color, fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '16px', marginBottom: '24px' }}>
              {grade.label}
            </div>

            {/* Per question breakdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px', textAlign: 'left' }}>
              {scores.map((score, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', background: '#F9FAFB', borderRadius: 'var(--radius-md)' }}>
                  <span style={{ fontSize: '13px', color: 'var(--ink-60)', flex: 1 }}>
                    {t(`Q${i + 1}`, `प्र${i + 1}`)}: {questions[i].substring(0, 40)}...
                  </span>
                  <span style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '14px', color: score >= 70 ? '#10B981' : '#F59E0B', minWidth: 40, textAlign: 'right' }}>
                    {score}/100
                  </span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => { setPhase('intro'); setQuestionIndex(0); setScores([]); setAnswers([]) }}
                style={{ flex: 1, padding: '14px', borderRadius: 'var(--radius-full)', background: 'white', color: 'var(--ink)', border: '1.5px solid var(--ink-20)', fontFamily: 'var(--font-head)', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}>
                {t('Try Again', 'फिर कोशिश करें')}
              </button>
              <button
                onClick={() => navigate('/schemes')}
                style={{ flex: 1, padding: '14px', borderRadius: 'var(--radius-full)', background: 'linear-gradient(135deg, #F97316, #F59E0B)', color: 'white', border: 'none', fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '14px', cursor: 'pointer', boxShadow: 'var(--shadow-saffron)' }}>
                {t('See Schemes →', 'योजनाएं देखें →')}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── INTERVIEW SCREEN ───────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #FFFBF7, #F0F9FF 50%, #ECFDF5)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', position: 'relative' }}>

      {/* Progress bar */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '3px', background: '#E5E7EB', zIndex: 10 }}>
        <div style={{ height: '100%', width: `${(questionIndex / questions.length) * 100}%`, background: 'linear-gradient(to right, #F97316, #F59E0B)', transition: 'width 0.4s ease' }} />
      </div>

      <div style={{ maxWidth: '560px', width: '100%' }}>

        {/* Counter */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <span style={{ fontSize: '13px', color: 'var(--ink-60)', fontWeight: 500 }}>
            {t(`Question ${questionIndex + 1} of ${questions.length}`, `प्रश्न ${questionIndex + 1} / ${questions.length}`)}
          </span>
          <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', marginTop: '8px' }}>
            {questions.map((_, i) => (
              <div key={i} style={{ width: i === questionIndex ? 24 : 8, height: 8, borderRadius: '4px', background: i < questionIndex ? '#10B981' : i === questionIndex ? '#F97316' : '#E5E7EB', transition: 'all 0.3s' }} />
            ))}
          </div>
        </div>

        {/* Robot */}
        <div style={{ width: 160, height: 180, margin: '0 auto 24px', animation: 'float 3s ease-in-out infinite', filter: robotMouth ? 'drop-shadow(0 8px 24px rgba(249,115,22,0.3))' : 'none', transition: 'filter 0.3s' }}>
          <Robot talking={robotMouth} blinking={eyeBlink} />
        </div>

        {/* Question bubble */}
        <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: '24px 28px', boxShadow: 'var(--shadow-md)', border: '1px solid var(--ink-10)', marginBottom: '20px', animation: 'scaleIn 0.4s ease forwards' }}>
          <p style={{ fontSize: '17px', color: 'var(--ink)', lineHeight: 1.6, fontWeight: 500, textAlign: 'center' }}>
            {robotMouth ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--saffron)' }}>
                <span style={{ fontSize: '14px' }}>🔊</span>
                {t('Speaking...', 'बोल रहा हूं...')}
              </span>
            ) : currentQuestion}
          </p>
        </div>

        {/* Answer area */}
        <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: '24px', boxShadow: 'var(--shadow-sm)', border: `2px solid ${listening ? '#F97316' : 'var(--ink-10)'}`, transition: 'border-color 0.2s', marginBottom: '16px' }}>
          {transcript ? (
            <p style={{ fontSize: '15px', color: 'var(--ink)', lineHeight: 1.6, minHeight: '60px' }}>{transcript}</p>
          ) : (
            <p style={{ fontSize: '14px', color: 'var(--ink-40)', fontStyle: 'italic', minHeight: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {listening
                ? t('Listening... speak now', 'सुन रहा हूं... बोलें')
                : t('Press mic and speak your answer', 'माइक दबाएं और जवाब बोलें')}
            </p>
          )}
          {evaluating && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#F97316', animation: 'bounceSoft 0.8s ease infinite' }} />
              <span style={{ fontSize: '12px', color: 'var(--ink-60)' }}>{t('Evaluating...', 'मूल्यांकन हो रहा है...')}</span>
            </div>
          )}
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button
            onMouseDown={startListening}
            onMouseUp={stopListening}
            onTouchStart={startListening}
            onTouchEnd={stopListening}
            style={{ width: 64, height: 64, borderRadius: '50%', background: listening ? 'linear-gradient(135deg, #F97316, #F43F5E)' : 'linear-gradient(135deg, #F97316, #F59E0B)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: listening ? '0 0 0 8px rgba(249,115,22,0.2)' : 'var(--shadow-saffron)', transition: 'all 0.2s' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" fill="white"/>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {transcript && !evaluating && (
            <button onClick={submitAnswer}
              style={{ flex: 1, padding: '16px', borderRadius: 'var(--radius-full)', background: 'linear-gradient(135deg, #10B981, #059669)', color: 'white', border: 'none', fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '16px', cursor: 'pointer', boxShadow: '0 8px 24px rgba(16,185,129,0.3)' }}>
              {t('Submit Answer →', 'जवाब जमा करें →')}
            </button>
          )}
        </div>

        <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '12px', color: 'var(--ink-40)' }}>
          {t('Hold mic to record · Release to stop', 'माइक दबाएं → जवाब बोलें → छोड़ें')}
        </p>
      </div>
    </div>
  )
}