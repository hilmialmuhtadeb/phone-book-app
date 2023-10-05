import { Routes, Route } from 'react-router-dom' 
import { Global, css } from '@emotion/react'
import PhoneBook from './pages/PhoneBook'
import GraphTest from './pages/GraphTest'

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
        <Route path="/graph" element={<GraphTest />} />
      </Routes>
    </>
  )
}

export default AppRouter