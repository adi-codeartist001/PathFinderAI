import Groq from 'groq-sdk'
import dotenv from 'dotenv'
dotenv.config()

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export const askGroq = async (prompt, jsonMode = true) => {
  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    max_tokens: 1500,
    temperature: 0.7,
    messages: [{ role: 'user', content: prompt }],
    ...(jsonMode && { response_format: { type: 'json_object' } })
  })
  const text = response.choices[0].message.content
  return jsonMode ? JSON.parse(text) : text
}
