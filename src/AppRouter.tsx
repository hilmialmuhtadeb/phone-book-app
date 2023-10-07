import { Routes, Route } from 'react-router-dom' 
import { Global, css } from '@emotion/react'
import PhoneBook from './pages/PhoneBook'
import AddContact from './pages/AddContact'

const AppRouter = () => {
  return (
    <>
      <Global
        styles={css`
          * {
            font-family: 'Roboto', sans-serif;
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          button {
            cursor: pointer;
          }
        `}
      />
      <Routes>
        <Route path="/" element={<PhoneBook />} />
        <Route path="/add-contact" element={<AddContact />} />
      </Routes>
    </>
  )
}

export default AppRouter