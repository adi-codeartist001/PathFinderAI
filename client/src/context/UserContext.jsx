import { createContext, useContext, useState } from 'react'

const UserContext = createContext(null)

export const UserProvider = ({ children }) => {
  const [language, setLanguage] = useState('en')
  const [quizAnswers, setQuizAnswers] = useState([])
  const [academicData, setAcademicData] = useState(null)
  const [careerResults, setCareerResults] = useState(null)
  const [selectedCareer, setSelectedCareer] = useState(null)
  const [roadmap, setRoadmap] = useState(null)
  const [skillGap, setSkillGap] = useState(null)
  const [userName, setUserName] = useState('')

  const t = (en, hi) => language === 'hi' ? hi : en

  return (
    <UserContext.Provider value={{
      language, setLanguage,
      quizAnswers, setQuizAnswers,
      academicData, setAcademicData,
      careerResults, setCareerResults,
      selectedCareer, setSelectedCareer,
      roadmap, setRoadmap,
      skillGap, setSkillGap,
      userName, setUserName,
      t
    }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext(UserContext)
