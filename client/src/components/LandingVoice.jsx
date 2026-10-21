/**
 * LandingVoice — Auto-plays a bilingual voice narration of the landing page
 * using the Web Speech API (SpeechSynthesis). Zero dependencies.
 */

import { useEffect, useRef, useState, useCallback } from 'react'
import { useUser } from '../context/UserContext'

// ── Script in both languages ──────────────────────────────────
const NARRATION = {
  hi: [
    "पाथफाइन्डर में आपका स्वागत है — यह आपका निःशुल्क कृत्रिम बुद्धिमत्ता आधारित करियर मार्गदर्शक है, जो विशेष रूप से दूसरे और तीसरे श्रेणी के शहरों के विद्यार्थियों के लिए बनाया गया है।",
    "यदि आप यह नहीं जानते कि कौन सा करियर चुनें — तो चिंता करने की आवश्यकता नहीं है। पाथफाइन्डर आपसे आपकी रुचियों के बारे में केवल दस सरल प्रश्न पूछेगा, और फिर कृत्रिम बुद्धिमत्ता की सहायता से आपके लिए सबसे उपयुक्त करियर सुझाएगा।",
    "आपको चरण-दर-चरण मार्गदर्शन प्राप्त होगा, आपके अंकों और बजट के अनुसार महाविद्यालयों की जानकारी मिलेगी, तथा वे सरकारी योजनाएँ भी बताए जाएँगी जिनके लिए आप पात्र हैं।",
    "पाथफाइन्डर हिंदी और अंग्रेज़ी दोनों भाषाओं में कार्य करता है — यह पूरी तरह निःशुल्क है, और किसी प्रकार के पंजीकरण की आवश्यकता नहीं है। आरंभ करने के लिए 'शुरू करें' पर क्लिक करें।"
  ],
  en: [
    "Welcome to PathFinder — your free AI career counsellor, built especially for students in tier-2 and tier-3 cities of India.",
    "Not sure what career to choose? We understand. PathFinder will ask you just ten simple questions about your interests, and use artificial intelligence to suggest the top career paths that match you.",
    "You will also get a step-by-step roadmap, a list of nearby colleges that fit your marks and budget, and government scholarships you are eligible for.",
    "PathFinder works in Hindi and English — completely free, no sign-up needed. Tap Get Started to begin your journey.",
  ],
}

export default function LandingVoice() {
  const { language } = useUser()
  const [muted, setMuted] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [started, setStarted] = useState(false)
  const [currentLang, setCurrentLang] = useState('hi') // ✅ Hindi first
  const [pulse, setPulse] = useState(false)

  const cancelRef = useRef(false)
  const hasPlayedRef = useRef(false)

  const speakSequence = useCallback((sentences, langCode, onDone) => {
    if (!('speechSynthesis' in window)) { onDone && onDone(); return }

    let i = 0
    const speakNext = () => {
      if (cancelRef.current || i >= sentences.length) { onDone && onDone(); return }

      const utt = new SpeechSynthesisUtterance(sentences[i])
      utt.lang = langCode
      utt.rate = langCode === 'hi-IN' ? 0.85 : 0.92
      utt.pitch = 1.05
      utt.volume = 1

      const voices = window.speechSynthesis.getVoices()
      const match = voices.find(v => v.lang.startsWith(langCode.split('-')[0]))
      if (match) utt.voice = match

      utt.onstart = () => { setPlaying(true); setPulse(true) }
      utt.onend = () => { setPulse(false); i++; setTimeout(speakNext, 300) }
      utt.onerror = () => { i++; speakNext() }

      window.speechSynthesis.speak(utt)
    }

    speakNext()
  }, [])

  // ✅ UPDATED: Hindi first, then English
  const playNarration = useCallback(() => {
    if (!('speechSynthesis' in window) || hasPlayedRef.current) return

    hasPlayedRef.current = true
    cancelRef.current = false
    setStarted(true)

    setCurrentLang('hi')
    speakSequence(NARRATION.hi, 'hi-IN', () => {
      if (cancelRef.current) return

      setCurrentLang('en')
      speakSequence(NARRATION.en, 'en-IN', () => {
        setPlaying(false)
        setCurrentLang('hi')
      })
    })
  }, [speakSequence])

  useEffect(() => {
    const timer = setTimeout(() => {
      if ('speechSynthesis' in window) {
        const tryPlay = () => playNarration()

        if (window.speechSynthesis.getVoices().length > 0) {
          tryPlay()
        } else {
          window.speechSynthesis.onvoiceschanged = tryPlay
        }
      }
    }, 1500)

    return () => clearTimeout(timer)
  }, [playNarration])

  useEffect(() => {
    return () => {
      cancelRef.current = true
      if ('speechSynthesis' in window) window.speechSynthesis.cancel()
    }
  }, [])

  const toggleMute = () => {
    if (!muted) {
      cancelRef.current = true
      window.speechSynthesis.cancel()
      setPlaying(false)
      setPulse(false)
      setMuted(true)
    } else {
      hasPlayedRef.current = false
      setMuted(false)
      setTimeout(() => playNarration(), 100)
    }
  }

  const langLabel = currentLang === 'hi' ? 'हिंदी' : 'English'

  return (
    <>
      <div style={{
        position: 'fixed',
        bottom: '28px',
        right: '28px',
        zIndex: 200,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '8px',
      }}>

        {playing && !muted && (
          <div style={{
            padding: '7px 14px',
            background: 'rgba(28,25,23,0.85)',
            borderRadius: '20px',
          }}>
            <span style={{ color: 'white', fontSize: 12 }}>
              {langLabel} narration
            </span>
          </div>
        )}

        <button
          onClick={toggleMute}
          style={{
            width: 52,
            height: 52,
            borderRadius: '50%',
            background: muted ? 'gray' : '#F97316',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          🔊
        </button>
      </div>
    </>
  )
}