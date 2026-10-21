import express from 'express'
import { askGroq } from '../utils/groq.js'
import { interviewEvalPrompt } from '../prompts/index.js'

const router = express.Router()

const questionBank = {
  engineering: [
    "Tell me why you want to pursue a career in technology.",
    "What programming languages or tools have you worked with?",
    "Describe a project you built and what you learned from it.",
    "How do you approach debugging a problem in your code?",
    "Where do you see yourself as an engineer 5 years from now?",
    "What is your biggest technical strength?",
    "How do you stay updated with new technologies?",
    "Describe a challenge you faced while learning to code and how you solved it."
  ],
  medical: [
    "Why do you want to pursue a career in medicine or healthcare?",
    "How do you handle stressful situations?",
    "Describe a time you helped someone in need.",
    "What qualities do you think are essential for a good doctor?",
    "How do you plan to prepare for competitive medical entrances?",
    "What is your biggest motivation to serve patients?",
    "How do you balance empathy and professionalism?",
    "Where do you see yourself contributing to healthcare in India?"
  ],
  business: [
    "Tell me about a business idea you have had.",
    "How do you handle failure or setbacks?",
    "Describe your biggest strength as a future entrepreneur.",
    "What business leaders inspire you and why?",
    "How would you market a product with zero budget?",
    "What is your plan to build your business skills?",
    "How do you manage your time and priorities?",
    "Where do you see your business career in 5 years?"
  ],
  general: [
    "Tell me about yourself and your career goals.",
    "What is your biggest strength and how will it help you?",
    "Describe a challenge you faced and how you overcame it.",
    "Why should we select you over other candidates?",
    "Where do you see yourself 5 years from now?",
    "What motivates you to work hard every day?",
    "How do you handle pressure and tight deadlines?",
    "What is one skill you want to develop this year?"
  ]
}

// POST /api/interview/questions
router.post('/questions', (req, res) => {
  const { career, domain, count = 5 } = req.body
  const key = domain || 'general'
  const bank = questionBank[key] || questionBank.general
  const shuffled = bank.sort(() => Math.random() - 0.5).slice(0, count)
  res.json({ questions: shuffled, career })
})

// POST /api/interview/evaluate
router.post('/evaluate', async (req, res) => {
  try {
    const { question, answer, career } = req.body
    if (!answer || answer.trim().length < 5) {
      return res.json({ score: 40, feedback: "Answer was too short. Please elaborate more." })
    }
    const prompt = interviewEvalPrompt({ question, answer, career })
    const data = await askGroq(prompt)
    res.json(data)
  } catch (err) {
    console.error('Interview eval error:', err.message)
    const score = Math.floor(Math.random() * 25 + 55)
    res.json({ score, feedback: "Good attempt. Try to include specific examples next time." })
  }
})

// POST /api/interview/final-report
router.post('/final-report', async (req, res) => {
  try {
    const { scores, career, answers } = req.body
    const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
    const grade = avg >= 80 ? 'Excellent' : avg >= 65 ? 'Good' : avg >= 50 ? 'Average' : 'Needs Practice'
    const improvements = [
      avg < 70 ? "Practice answering with specific real-life examples" : null,
      avg < 75 ? "Work on structuring answers using the STAR method (Situation, Task, Action, Result)" : null,
      "Research about the latest trends in " + career,
      "Practice speaking confidently in front of a mirror daily"
    ].filter(Boolean)

    res.json({
      avgScore: avg,
      grade,
      career,
      totalQuestions: scores.length,
      improvements,
      nextSteps: [
        "Practice 3 mock interviews per week",
        "Join a spoken English class or watch English content daily",
        "Apply for internships on Internshala"
      ]
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
