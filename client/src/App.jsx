import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { UserProvider } from './context/UserContext'
import ProgressNav from './pages/ProgressNav'
import Landing from './pages/Landing'
import LanguageSelect from './pages/LanguageSelect'
import InterestQuiz from './pages/InterestQuiz'
import AcademicInput from './pages/AcademicInput'
import CareerResult from './pages/CareerResult'
import Roadmap from './pages/Roadmap'
import SkillGap from './pages/SkillGap'
import CollegeFinder from './pages/CollegeFinder'
import Interview from './pages/Interview'
import SchemeMatch from './pages/SchemeMatch'
import BudgetAdvice from './pages/BudgetAdvice'
import SuccessStoryFeed from './pages/SuccessStoryFeed'

export default function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <ProgressNav />
        <div className="page-enter">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/language" element={<LanguageSelect />} />
            <Route path="/quiz" element={<InterestQuiz />} />
            <Route path="/academic" element={<AcademicInput />} />
            <Route path="/result" element={<CareerResult />} />
            <Route path="/roadmap" element={<Roadmap />} />
            <Route path="/skillgap" element={<SkillGap />} />
            <Route path="/colleges" element={<CollegeFinder />} />
            <Route path="/schemes" element={<SchemeMatch />} />
            <Route path="/budget" element={<BudgetAdvice />} />
            <Route path="/interview" element={<Interview />} />
            <Route path="/stories" element={<SuccessStoryFeed />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </BrowserRouter>
    </UserProvider>
  )
}