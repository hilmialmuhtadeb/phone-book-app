import styled from '@emotion/styled'

const PinkButton = styled.button`
  background-color: hotpink;
  color: black;
  padding: 8px;
  border-radius: 8px;
  font-weight: bold;
  font-size: 1.2rem;
  border: none;
  cursor: pointer;
  &:hover {
    background-color: deeppink;
  }
`

const CenteredContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
`

const PhoneBook = () => {
  return (
    <CenteredContainer>
      <p>This is the phonebook page </p>
      <PinkButton>Click Me!</PinkButton>
    </CenteredContainer>
  )
}

export default PhoneBook