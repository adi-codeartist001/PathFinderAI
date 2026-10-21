import { useState } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const ENDPOINT_MAP = {
  'career-suggest': '/api/career/suggest',
  'roadmap': '/api/career/roadmap',
  'skillgap': '/api/career/skillgap',
  'budget': '/api/career/budget',
  'interview-questions': '/api/interview/questions',
  'interview-eval': '/api/interview/evaluate',
  'interview-report': '/api/interview/final-report',
  'schemes': '/api/schemes/match',
  'colleges': '/api/colleges/recommend',
}

export const useGroq = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const call = async (key, payload) => {
    setLoading(true)
    setError(null)
    const endpoint = ENDPOINT_MAP[key] || `/api/${key}`
    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      return await res.json()
    } catch (err) {
      setError(err.message)
      console.error(`API call failed [${key}]:`, err.message)
      return null
    } finally {
      setLoading(false)
    }
  }

  const get = async (path) => {
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}${path}`)
      return await res.json()
    } catch (err) {
      setError(err.message)
      return null
    } finally {
      setLoading(false)
    }
  }

  return { call, get, loading, error }
}
