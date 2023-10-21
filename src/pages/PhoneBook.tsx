import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { QueryResult, gql, useQuery } from '@apollo/client'
import styled from '@emotion/styled'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faSort } from '@fortawesome/free-solid-svg-icons'
import AppHeader from '../components/AppHeader'
import { Contact } from '../interface/Contact'
import ContactCard from '../components/ContactCard'

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
  padding: 1rem .5rem;
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
const Section = styled.section`
  margin: 1rem 0 2rem;
`
const SectionTitle = styled.h1`
  padding: 0 1rem;
  margin-bottom: .5rem;
  font-size: 1.2rem;
  font-weight: 700;
`
const WarningMessage = styled.p`
  padding: 0 1rem;
  font-size: 1.2rem;
  font-weight: 500;
  color: #aaa;
`
const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: .5rem;
  padding: 1rem 0;
`
const PaginationButton = styled.button`
  padding: .5rem 1rem;
  border: 1px solid #aaa;
  border-radius: 5px;
  background-color: transparent;
  font-size: 1rem;
  &:hover {
    box-shadow: 0 0 5px #aaa;
  }
`
const PhoneBook = () => {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [idFavoriteContact, setIdFavoriteContact] = useState<string[]>([])
  const [favoriteContact, setFavoriteContact] = useState<Contact[]>([])
  const [regularContact, setRegularContact] = useState<Contact[]>([])
  const [offset, setOffset] = useState<number>(0)
  const [isEndOfContact, setIsEndOfContact] = useState<boolean>(false)
  const { loading, error, data } : QueryResult = useQuery(GET_CONTACT_LIST, {
    variables: {
      limit: 10,
      order_by: {
        first_name: 'asc'
      },
      offset: offset,
      where: {
        first_name: {
          _ilike: '%'
        }
      }
    }
  })

  const handleToggleContactOption = (id: string) => () => {
    const contactOption = document.querySelector(`#contact-${id}`)
    contactOption?.classList.toggle('hidden')
  }

  const handleNextPageButton = () => () => {
    setOffset(offset + 10)
  }

  // in first page render, check if there is favorite contact in local storage
  useEffect(() => {
    const idFavoriteContact = localStorage.getItem('favoriteContact')?.split(',') || []
    setIdFavoriteContact(idFavoriteContact)
    const favoriteContact = contacts.filter((contact: Contact) => idFavoriteContact.includes(contact.id.toString()))
    setFavoriteContact(favoriteContact)
  }, [contacts])

  // in first page render, if there is favorite contact in local storage, filter it from regular contact
  useEffect(() => {
    if (!contacts) return
    const regularContact = contacts.filter((contact: Contact) => !idFavoriteContact.includes(contact.id.toString()))
    setRegularContact(regularContact)
  }, [idFavoriteContact, contacts])

  useEffect(() => {
    if (!data?.contact) return
    if (data.contact.length == 0) setIsEndOfContact(true) 
    setContacts(contacts.concat(data?.contact))
  }, [data?.contact])

  const addItemToFavoriteContact = (contact: Contact) => () => {
    setIdFavoriteContact([...idFavoriteContact, contact.id.toString()])
    setFavoriteContact([...favoriteContact, contact])
    setRegularContact(regularContact.filter((item: Contact) => item.id !== contact.id))
    localStorage.setItem('favoriteContact', [...idFavoriteContact, contact.id.toString()].toString())
    const contactOption = document.querySelector(`#contact-${contact.id}`)
    contactOption?.classList.toggle('hidden')
  }

  const removeItemFromFavoriteContact = (contact: Contact) => () => {
    setIdFavoriteContact(idFavoriteContact.filter((item: string) => item !== contact.id.toString()))
    setFavoriteContact(favoriteContact.filter((item: Contact) => item.id !== contact.id))
    setRegularContact([...regularContact, contact])
    localStorage.setItem('favoriteContact', idFavoriteContact.filter((item: string) => item !== contact.id.toString()).toString())
    const contactOption = document.querySelector(`#contact-${contact.id}`)
    contactOption?.classList.toggle('hidden')
  }

  const renderFavoriteContact = () => {
    if (!favoriteContact) return <p>Loading...</p>
    if (!favoriteContact.length) return <WarningMessage>No favorite contact</WarningMessage>
    return favoriteContact.map((contact: Contact) => (
      <ContactCard
        key={contact.id}
        contact={contact}
        handleToggleContactOption={handleToggleContactOption}
        removeItemFromFavoriteContact={removeItemFromFavoriteContact}
        isRegularContact={false}
      />
    ))
  }

  const renderRegularContact = () => {
    if (!regularContact) return <p>Loading...</p>
    if (!regularContact.length) return <WarningMessage>There is no contact</WarningMessage>
    return regularContact.map((contact: Contact) => (
      <ContactCard
        key={contact.id}
        contact={contact}
        handleToggleContactOption={handleToggleContactOption}
        addItemToFavoriteContact={addItemToFavoriteContact}
        isRegularContact={true}
      />
    ))
  }

  if (contacts.length === 0) {
    if (loading) return <p>Loading...</p>
    if (error) return <p>Error : {error.message}</p>
  }
  
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

      <Section>
        <SectionTitle>Favorite Contact</SectionTitle>
        { renderFavoriteContact() }
      </Section>
      <Section>
        <SectionTitle>Regular Contact</SectionTitle>
        { renderRegularContact() }
      </Section>
      <Section>
        { isEndOfContact ? <WarningMessage>All contacts are displayed.</WarningMessage> : (
          <Pagination>
            <PaginationButton onClick={ handleNextPageButton() }>Next</PaginationButton>
          </Pagination>
        )}
      </Section>
    </CommonContainer>
  )
}

export default PhoneBook