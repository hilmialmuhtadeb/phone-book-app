import { Routes, Route } from 'react-router-dom' 
import PhoneBook from './pages/PhoneBook'
import { Global, css } from '@emotion/react'
// import './index.css'
// import './App.css'

const AppRouter = () => {
  return (
    <>
      <Global
        styles={css`
          body {
            font-family: 'Roboto', sans-serif;
          }
        `}
      />
      <Routes>
        <Route path="/" element={<PhoneBook />} />
      </Routes>
    </>
  )
}

export default AppRouter