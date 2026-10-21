import express from 'express'
import { askGroq } from '../utils/groq.js'
import { careerPrompt, roadmapPrompt, skillGapPrompt, budgetAdvicePrompt } from '../prompts/index.js'

const router = express.Router()

// POST /api/career/suggest
router.post('/suggest', async (req, res) => {
  try {
    const { interests, stream, marks, city, income, category, language } = req.body
    const prompt = careerPrompt({ interests, stream, marks, city, income, category, language })
    const data = await askGroq(prompt)
    res.json(data)
  } catch (err) {
    console.error('Career suggest error:', err.message)
    res.status(500).json({
      error: 'AI unavailable',
      careers: [
        { career: "Software Engineer", match: 88, salary: "₹4–18 LPA", demand: "High", reason: "Strong analytical skills match perfectly.", icon: "💻", color: "#0EA5E9", bg: "#F0F9FF" },
        { career: "Data Analyst", match: 76, salary: "₹4–12 LPA", demand: "High", reason: "Numbers and patterns come naturally to you.", icon: "📊", color: "#10B981", bg: "#ECFDF5" },
        { career: "Digital Marketer", match: 68, salary: "₹3–8 LPA", demand: "High", reason: "Creative thinking and communication are your strengths.", icon: "📱", color: "#F59E0B", bg: "#FFFBEB" }
      ]
    })
  }
})

// POST /api/career/roadmap
router.post('/roadmap', async (req, res) => {
  try {
    const { career, stream, marks, language } = req.body
    const prompt = roadmapPrompt({ career, stream, marks, language })
    const data = await askGroq(prompt)
    res.json(data)
  } catch (err) {
    console.error('Roadmap error:', err.message)
    res.status(500).json({
      roadmap: {
        career: req.body.career || 'Software Engineer',
        phases: [
          { month: "0–3 months", title: "Foundation", color: "#F97316", items: ["Learn HTML, CSS, JavaScript basics", "Complete freeCodeCamp Web Design", "Build 2 static websites", "Open GitHub and push daily"], resources: ["freeCodeCamp.org (Free)", "The Odin Project (Free)", "YouTube: Traversy Media (Free)"] },
          { month: "3–6 months", title: "Core Skills", color: "#0EA5E9", items: ["Learn React.js fundamentals", "Understand REST APIs", "Build 3 full-stack projects", "Start LeetCode Easy problems"], resources: ["React Docs (Free)", "MongoDB University (Free)", "CS50 by Harvard (Free)"] },
          { month: "6–12 months", title: "Job Ready", color: "#10B981", items: ["Build portfolio with 5 projects", "Contribute to open source", "Apply to 10 companies weekly", "Prepare for DSA interviews"], resources: ["Naukri.com (Free)", "GeeksForGeeks (Free)", "Internshala (Free)"] }
        ]
      }
    })
  }
})

// POST /api/career/skillgap
router.post('/skillgap', async (req, res) => {
  try {
    const { career, stream, marks } = req.body
    const prompt = skillGapPrompt({ career, stream, marks })
    const data = await askGroq(prompt)
    res.json(data)
  } catch (err) {
    console.error('Skillgap error:', err.message)
    res.status(500).json({
      career: req.body.career || 'Software Engineer',
      skills: [
        { name: "HTML & CSS", current: 40, required: 80, color: "#F97316", priority: "High" },
        { name: "JavaScript", current: 25, required: 90, color: "#0EA5E9", priority: "High" },
        { name: "React.js", current: 10, required: 75, color: "#10B981", priority: "High" },
        { name: "Node.js", current: 5, required: 60, color: "#F59E0B", priority: "Medium" },
        { name: "Databases", current: 15, required: 65, color: "#8B5CF6", priority: "Medium" },
        { name: "Git & GitHub", current: 20, required: 70, color: "#EC4899", priority: "Medium" },
        { name: "Problem Solving", current: 30, required: 80, color: "#14B8A6", priority: "High" }
      ]
    })
  }
})

// POST /api/career/budget
router.post('/budget', async (req, res) => {
  try {
    const { career, income, city } = req.body
    const prompt = budgetAdvicePrompt({ career, income, city })
    const data = await askGroq(prompt)
    res.json(data)
  } catch (err) {
    console.error('Budget error:', err.message)
    res.status(500).json({
      totalCost: "₹0–₹30,000",
      timeline: "6–12 months",
      freeOptions: ["freeCodeCamp (100% free)", "NPTEL courses (Free + certificate)", "YouTube tutorials (Free)"],
      paidOptions: ["Coursera with financial aid (₹0–₹5,000)", "Udemy courses on sale (₹400–₹800)"],
      loanOptions: ["Vidyalakshmi Portal education loan", "PM Vidya Lakshmi Scheme"],
      tip: "Start with 100% free resources for the first 6 months. Only invest money after you land your first internship."
    })
  }
})

export default router
