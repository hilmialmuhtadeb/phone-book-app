import { Routes, Route } from 'react-router-dom' 
import PhoneBook from './pages/PhoneBook'
// import './index.css'
// import './App.css'

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<PhoneBook />} />
    </Routes>
  )
}

export default AppRouter