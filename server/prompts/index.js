export const careerPrompt = ({ interests, stream, marks, city, income, category, language }) => `
You are an expert Indian career counsellor specializing in guiding students from Tier-2 and Tier-3 cities.

Student Profile:
- Interests/Domains: ${interests?.join(', ') || 'general'}
- Academic Stream: ${stream || 'Not specified'}
- Marks: ${marks}%
- City: ${city}
- Annual Family Income: ₹${income}
- Category: ${category}
- Language: ${language === 'hi' ? 'Hindi' : 'English'}

Based on this profile, suggest exactly 3 career paths.
For each career return:
1. career - career name
2. match - match percentage 0-100
3. salary - Indian salary range (e.g. "₹4–12 LPA")
4. demand - "High", "Medium", or "Low"
5. reason - one sentence why it suits this student specifically
6. icon - one relevant emoji
7. color - hex color (pick from: #0EA5E9, #10B981, #F59E0B, #8B5CF6, #F97316, #EC4899)
8. bg - light hex bg (pick from: #F0F9FF, #ECFDF5, #FFFBEB, #F5F3FF, #FFF7ED, #FFF0F3)

Sort by match percentage descending.
Return ONLY valid JSON:
{"careers": [{"career": "...", "match": 92, "salary": "₹4–12 LPA", "demand": "High", "reason": "...", "icon": "💻", "color": "#0EA5E9", "bg": "#F0F9FF"}]}
`

export const roadmapPrompt = ({ career, stream, marks, language }) => `
You are an expert Indian career counsellor.
Create a detailed 12-month roadmap for a student who wants to become a ${career}.
Student stream: ${stream || 'General'}, Marks: ${marks || 70}%

Divide into 3 phases:
1. "0–3 months" - Foundation
2. "3–6 months" - Core Skills
3. "6–12 months" - Job Ready

For each phase provide:
- month: duration string
- title: phase name
- color: one of #F97316, #0EA5E9, #10B981
- items: array of 4 specific actionable tasks
- resources: array of 3 free resources with "(Free)" label

Return ONLY valid JSON:
{"roadmap": {"career": "...", "phases": [{"month": "0–3 months", "title": "Foundation", "color": "#F97316", "items": [...], "resources": [...]}]}}
`

export const skillGapPrompt = ({ career, stream, marks }) => `
You are an expert Indian career counsellor.
Analyze skill gaps for a student targeting ${career}.
Student: ${stream || 'General'} stream, ${marks || 70}% marks.

List 6-8 key skills. For each:
- name: skill name
- current: estimated current level 0-100
- required: required level 0-100
- color: hex color (vary: #F97316, #0EA5E9, #10B981, #F59E0B, #8B5CF6, #EC4899, #14B8A6)
- priority: "High" or "Medium"

Return ONLY valid JSON:
{"career": "${career}", "skills": [{"name": "...", "current": 25, "required": 80, "color": "#F97316", "priority": "High"}]}
`

export const interviewEvalPrompt = ({ question, answer, career }) => `
You are evaluating a mock interview answer for a ${career} position.
Question: "${question}"
Answer: "${answer}"

Score out of 100 based on relevance, clarity, depth, confidence.
Return ONLY valid JSON:
{"score": 72, "feedback": "One-line constructive feedback here."}
`

export const budgetAdvicePrompt = ({ career, income, city }) => `
You are an expert Indian career counsellor for Tier-2/3 city students.
Target Career: ${career}, Family Income: Rs.${income}/year, City: ${city}

Provide:
- totalCost: estimated total cost string
- timeline: time to first job
- freeOptions: array of 3 free learning paths
- paidOptions: array of 2 affordable options under Rs.50000
- loanOptions: array of 2 relevant govt loans/scholarships
- tip: one practical money-saving tip

Return ONLY valid JSON:
{"totalCost": "...", "timeline": "...", "freeOptions": [...], "paidOptions": [...], "loanOptions": [...], "tip": "..."}
`

export const collegePrompt = ({ career, stream, marks, city, income, category }) => `
You are an expert Indian education counsellor with deep knowledge of colleges across India.

Student Profile:
- Target Career: ${career}
- Stream: ${stream || 'General'}
- Marks: ${marks}%
- City: ${city}
- Annual Family Income: Rs.${income}
- Category: ${category || 'general'}

Suggest exactly 6 colleges that are REALISTIC and ATTAINABLE for this student.
Mix government and private. Include at least 2 government colleges.
Consider marks eligibility, income for fees, and proximity to their city.

For each college:
1. name - full college name
2. city - city
3. state - state
4. type - "Government" or "Private" or "Deemed" or "Government-IIT" or "Government-NIT" or "Central University"
5. fees - annual fees as number in rupees (e.g. 45000)
6. courses - array of 3 relevant courses
7. rating - realistic rating out of 5
8. naac - NAAC grade string
9. placement - placement percentage string (e.g. "65%")
10. whyMatch - one sentence why this suits this specific student
11. entranceExam - entrance exam needed (e.g. "JEE Main", "CUET", "Direct Admission")
12. website - official website URL

Sort by best match first.
Return ONLY valid JSON:
{"colleges": [{"name": "...", "city": "...", "state": "...", "type": "Government", "fees": 15000, "courses": ["B.Tech"], "rating": 4.1, "naac": "A", "placement": "65%", "whyMatch": "...", "entranceExam": "JEE Main", "website": "https://..."}]}
`
