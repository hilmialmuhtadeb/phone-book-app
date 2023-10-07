import styled from '@emotion/styled'
import { QueryResult, gql, useQuery } from '@apollo/client'
import { Link } from 'react-router-dom'
import AppHeader from '../components/AppHeader'
import { Contact } from '../interface/Contact'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faSort, faEllipsisVertical } from '@fortawesome/free-solid-svg-icons'

const GET_CONTACT_LIST = gql`
  query GetContactList (
    $distinct_on: [contact_select_column!], 
    $limit: Int, 
    $offset: Int, 
    $order_by: [contact_order_by!], 
    $where: contact_bool_exp
  ) {
  contact(
      distinct_on: $distinct_on, 
      limit: $limit, 
      offset: $offset, 
      order_by: $order_by, 
      where: $where
  ){
    created_at
    first_name
    id
    last_name
    phones {
      number
    }
  }
  }
`

const CommonContainer = styled.div`
  position: relative;
`
const MenuContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: .4rem;
  padding: 1rem;
  margin-bottom: 1rem;
`
const MenuButton = styled.button`
  flex-basis: 2.4rem;
  width: 2.4rem;
  height: 2.4rem;
  font-size: 1.2rem;
  border: 1px solid #aaa;
  border-radius: 50%;
  background-color: #fff;
`
const SearchInput = styled.input`
  flex-grow: 1;
  padding: .5rem 1rem;
  border: 1px solid #aaa;
  border-radius: 20px;
  font-size: 1rem;
`
const ContactCard = styled.div`
  padding: 1rem;
  margin: .5rem;
  border-bottom: 1px solid #aaa;
`
const ContactCardBody = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`
const ContactName = styled.h3`
  margin-bottom: .5rem;
`
const ContactNumber = styled.p`
  margin-bottom: .5rem;
`
const PhoneBook = () => {
  const { loading, error, data } : QueryResult = useQuery(GET_CONTACT_LIST)

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error : {error.message}</p>
  
  return (
    <CommonContainer>
      <AppHeader />
      <MenuContainer>
        <Link to="/add-contact">
          <MenuButton>
            <FontAwesomeIcon icon={faPlus} />
          </MenuButton>
        </Link>
        <MenuButton>
          <FontAwesomeIcon icon={faSort} />
        </MenuButton>
        <SearchInput type="text" placeholder='Type contact name...' />
      </MenuContainer>
      
      {data.contact.map(({ id, first_name, last_name, phones }: Contact) => (
        <ContactCard key={id}>
          <ContactCardBody>
            <div>
              <ContactName>{first_name} {last_name}</ContactName>
              <ContactNumber>{phones[0].number}</ContactNumber>
            </div>
            <div>
              <FontAwesomeIcon icon={faEllipsisVertical} />
            </div>
          </ContactCardBody>
        </ContactCard>
      ))}
    </CommonContainer>
  )
}

export default PhoneBook