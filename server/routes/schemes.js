import express from 'express'

const router = express.Router()

const schemes = [
  { id: 1, name: "PM Kaushal Vikas Yojana (PMKVY)", benefit: "Free skill training + ₹8,000 reward", category: ["all"], careers: ["engineering", "vocational", "IT", "healthcare"], income: 500000, link: "https://pmkvyofficial.org", state: "all", description: "Free short-term skill training programs with government certification and monetary reward upon completion.", deadline: "Ongoing", type: "Skill Training" },
  { id: 2, name: "National Scholarship Portal (NSP)", benefit: "₹10,000–₹50,000 per year", category: ["sc", "st", "obc", "minority", "ews"], careers: ["all"], income: 250000, link: "https://scholarships.gov.in", state: "all", description: "Central government scholarships for meritorious students from minority, SC, ST and OBC communities.", deadline: "October–November", type: "Scholarship" },
  { id: 3, name: "PM YASASVI Scheme", benefit: "₹75,000–₹1,25,000 per year", category: ["obc", "ews", "dnts"], careers: ["all"], income: 250000, link: "https://yet.nta.ac.in", state: "all", description: "Scholarship for OBC, EWS and DNT students studying in Classes 9–12 and above.", deadline: "August–September", type: "Scholarship" },
  { id: 4, name: "Vidyasaarathi Scholarship", benefit: "Up to ₹50,000", category: ["all"], careers: ["engineering", "medical", "business", "IT"], income: 600000, link: "https://www.vidyasaarathi.co.in", state: "all", description: "Industry-backed scholarship platform offering financial assistance for professional courses.", deadline: "Rolling", type: "Scholarship" },
  { id: 5, name: "Pragati Scholarship (AICTE) — Girls", benefit: "₹50,000 per year + ₹2,000 contingency", category: ["all"], careers: ["engineering", "IT", "pharmacy"], income: 800000, link: "https://www.aicte-india.org/bureaus/rid/pms", state: "all", description: "For girl students pursuing technical education in AICTE-approved institutions.", deadline: "November–December", type: "Scholarship" },
  { id: 6, name: "Saksham Scholarship (AICTE) — Differently Abled", benefit: "₹50,000 per year + ₹2,000 contingency", category: ["all"], careers: ["engineering", "IT"], income: 800000, link: "https://www.aicte-india.org/bureaus/rid/pms", state: "all", description: "For differently abled students pursuing technical degree/diploma.", deadline: "November–December", type: "Scholarship" },
  { id: 7, name: "Central Sector Scheme of Scholarships", benefit: "₹10,000–₹20,000 per year", category: ["all"], careers: ["all"], income: 450000, link: "https://scholarships.gov.in", state: "all", description: "For students who scored above 80th percentile in Class 12 board exams.", deadline: "October–November", type: "Scholarship" },
  { id: 8, name: "INSPIRE Scholarship (DST)", benefit: "₹80,000 per year", category: ["all"], careers: ["engineering", "medical", "science", "research"], income: 1000000, link: "https://online-inspire.gov.in", state: "all", description: "For students pursuing Basic and Natural Sciences at BSc/BS/Int. MSc/MS levels.", deadline: "September–October", type: "Scholarship" },
  { id: 9, name: "Begum Hazrat Mahal National Scholarship", benefit: "₹5,000–₹6,000 per year", category: ["minority"], careers: ["all"], income: 200000, link: "https://scholarships.gov.in", state: "all", description: "For meritorious girl students from minority communities studying in Classes 9–12.", deadline: "September–October", type: "Scholarship" },
  { id: 10, name: "Ishan Uday Scholarship (NE Region)", benefit: "₹5,400–₹7,800 per month", category: ["all"], careers: ["all"], income: 450000, link: "https://scholarships.gov.in", state: "northeast", description: "For students from North Eastern region pursuing general degree courses.", deadline: "October–November", type: "Scholarship" },
  { id: 11, name: "Vidyalakshmi Education Loan", benefit: "Loan up to ₹7.5 Lakh (no collateral)", category: ["all"], careers: ["all"], income: 1000000, link: "https://www.vidyalakshmi.co.in", state: "all", description: "Apply to multiple banks for education loans through single portal. Covers fees, hostel, books.", deadline: "Ongoing", type: "Education Loan" },
  { id: 12, name: "Dr. Ambedkar Post Matric Scholarship", benefit: "₹1,200–₹3,300 per month", category: ["obc", "ews"], careers: ["all"], income: 100000, link: "https://scholarships.gov.in", state: "all", description: "Post-matric scholarship for OBC and EWS students pursuing higher education.", deadline: "October–November", type: "Scholarship" },
  { id: 13, name: "UDAAN Scheme (CBSE — Girl Students)", benefit: "Free coaching for JEE/NEET", category: ["all"], careers: ["engineering", "medical"], income: 600000, link: "https://cbseacademic.nic.in/udaan.html", state: "all", description: "Free online/offline coaching for girl students preparing for JEE and other engineering entrances.", deadline: "October", type: "Coaching Support" },
  { id: 14, name: "Mukhyamantri Medhavi Vidyarthi Yojana (MP)", benefit: "Full tuition fee by state govt", category: ["all"], careers: ["engineering", "medical", "law", "management"], income: 600000, link: "https://scholarshipportal.mp.nic.in", state: "Madhya Pradesh", description: "For MP students scoring 70%+ in Class 12 (CBSE/ICSE) or 85%+ in MPBSE.", deadline: "July–August", type: "State Scholarship" },
]

// GET /api/schemes — get all or filtered
router.get('/', (req, res) => {
  const { category, income, career, state } = req.query

  let filtered = schemes.filter(s => {
    const catMatch = !category || s.category.includes('all') || s.category.includes(category.toLowerCase())
    const incomeMatch = !income || parseInt(income) <= s.income
    const careerMatch = !career || s.careers.includes('all') || s.careers.includes(career.toLowerCase())
    const stateMatch = !state || s.state === 'all' || s.state.toLowerCase() === state.toLowerCase()
    return catMatch && incomeMatch && careerMatch && stateMatch
  })

  res.json({ count: filtered.length, schemes: filtered })
})

// POST /api/schemes/match — match based on full profile
router.post('/match', (req, res) => {
  const { category, income, career, state } = req.body

  const matched = schemes.filter(s => {
    const catMatch = s.category.includes('all') || s.category.includes((category || 'general').toLowerCase())
    const incomeMatch = !income || parseInt(income) <= s.income
    const careerMatch = s.careers.includes('all') || s.careers.some(c => career?.toLowerCase().includes(c))
    return catMatch && incomeMatch && careerMatch
  })

  res.json({ count: matched.length, schemes: matched })
})

export default router
