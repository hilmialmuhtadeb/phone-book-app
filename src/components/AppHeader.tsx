import styled from '@emotion/styled'
import { Link } from 'react-router-dom'

const StickyHeader = styled.h1`
  position: sticky;
  top: 0;
  padding: 1rem;
  border-bottom: 1px solid #ccc;
  font-size: 1.8rem;
  font-weight: 700;
  text-align: center;
  color: black;
  background-color: #eaeaea;
  z-index: 1;
`
const NavLink = styled(Link)`
  text-decoration: none;
`

const AppHeader = () => {
  return (
    <NavLink to="/">
      <StickyHeader>Phone Book App</StickyHeader>
    </NavLink>
  )
}

export default AppHeader