import express from 'express'
import { askGroq } from '../utils/groq.js'
import { collegePrompt } from '../prompts/index.js'

const router = express.Router()

// POST /api/colleges/recommend — AI suggests colleges based on student profile
router.post('/recommend', async (req, res) => {
  try {
    const { career, stream, marks, city, income, category } = req.body

    if (!career || !marks) {
      return res.status(400).json({ error: 'career and marks are required' })
    }

    const prompt = collegePrompt({ career, stream, marks, city, income, category })
    const data = await askGroq(prompt)
    res.json(data)

  } catch (err) {
    console.error('College recommend error:', err.message)
    // Fallback if Groq fails
    res.json({
      colleges: [
        { name: "GLA University", city: "Mathura", state: "Uttar Pradesh", type: "Private", fees: 80000, courses: ["B.Tech", "BBA", "B.Sc"], rating: 4.2, naac: "A", placement: "70%", whyMatch: "Strong placement record for tech careers with affordable fees.", entranceExam: "Direct Admission / JEE", website: "https://www.gla.ac.in" },
        { name: "HBTU Kanpur", city: "Kanpur", state: "Uttar Pradesh", type: "Government", fees: 35000, courses: ["B.Tech", "M.Tech"], rating: 4.3, naac: "A", placement: "75%", whyMatch: "Government college with excellent tech faculty and low fees.", entranceExam: "JEE Main", website: "https://hbtu.ac.in" },
        { name: "Dr. B.R. Ambedkar University", city: "Agra", state: "Uttar Pradesh", type: "Government", fees: 12000, courses: ["BA", "B.Sc", "B.Com"], rating: 3.9, naac: "A", placement: "50%", whyMatch: "Highly affordable government university near your city.", entranceExam: "CUET", website: "https://www.dbrau.ac.in" },
        { name: "University of Lucknow", city: "Lucknow", state: "Uttar Pradesh", type: "Government", fees: 10000, courses: ["BA", "B.Sc", "LLB", "MBA"], rating: 4.0, naac: "A", placement: "55%", whyMatch: "One of the most reputed government universities in UP.", entranceExam: "CUET", website: "https://www.lkouniv.ac.in" },
        { name: "Manipal University Jaipur", city: "Jaipur", state: "Rajasthan", type: "Private", fees: 120000, courses: ["B.Tech", "BBA", "B.Design"], rating: 4.2, naac: "A+", placement: "72%", whyMatch: "Top private university with strong industry connections.", entranceExam: "MU-OET / JEE", website: "https://jaipur.manipal.edu" },
        { name: "BHU Varanasi", city: "Varanasi", state: "Uttar Pradesh", type: "Central University", fees: 15000, courses: ["BA", "B.Sc", "B.Tech", "MBBS"], rating: 4.5, naac: "A++", placement: "70%", whyMatch: "Prestigious central university with world-class faculty.", entranceExam: "CUET / JEE", website: "https://www.bhu.ac.in" }
      ]
    })
  }
})

// GET /api/colleges/list — static list for browsing
router.get('/list', (req, res) => {
  const { city, maxFees, type } = req.query
  res.json({
    message: "Use POST /api/colleges/recommend with student profile for AI suggestions",
    tip: "Pass career, stream, marks, city, income, category in the request body"
  })
})

export default router
