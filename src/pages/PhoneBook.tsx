import styled from '@emotion/styled'
import { QueryResult, gql, useQuery } from '@apollo/client'
import { Link } from 'react-router-dom'
import AppHeader from '../components/AppHeader'
import { Contact } from '../interface/Contact'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faSort, faEllipsisVertical } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useState } from 'react'

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
const SectionTitle = styled.h1`
  padding: 1rem;
  margin-bottom: .5rem;
  font-size: 1.2rem;
  font-weight: 700;
  text-align: center;
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
  position: relative;
`
const ContactOptionButton = styled.button`
  padding: .5rem 1rem;
  border: none;
  border-radius: 5px;
  background-color: transparent;
  &:hover {
    box-shadow: 0 0 5px #aaa;
  }
`
const ContactOption = styled.div`
  position: absolute;
  display: block;
  top: 2.4rem;
  right: 0;
  width: 10rem;
  padding: .5rem 0;
  border: 1px solid #aaa;
  border-radius: 5px;
  background-color: #fff;
  z-index: 99;
  &.hide {
    display: none;
  }
`
const OptionItem = styled.p`
  padding: .5rem 1rem;
  &:hover {
    background-color: #aaa;
  }
`
const ContactName = styled.h3`
  margin-bottom: .5rem;
`
const ContactNumber = styled.p`
  margin-bottom: .5rem;
`
const PhoneBook = () => {
  const [idFavoriteContact, setIdFavoriteContact] = useState<string[]>([])
  const [favoriteContact, setFavoriteContact] = useState<Contact[]>([])
  const [regularContact, setRegularContact] = useState<Contact[]>([])
  const { loading, error, data } : QueryResult = useQuery(GET_CONTACT_LIST)

  const handleToggleContactOption = (id: string) => () => {
    const contactOption = document.querySelector(`#contact-${id}`)
    contactOption?.classList.toggle('hide')
  }

  useEffect(() => {
    const idFavoriteContact = localStorage.getItem('favoriteContact')?.split(',') || []
    setIdFavoriteContact(idFavoriteContact)
    const favoriteContact = data?.contact.filter((contact: Contact) => idFavoriteContact.includes(contact.id.toString()))
    setFavoriteContact(favoriteContact)
    // console.log('fav: ', favoriteContact);
  }, [data?.contact])

  useEffect(() => {
    if (!data) return
    const regularContact = data.contact.filter((contact: Contact) => !idFavoriteContact.includes(contact.id.toString()))
    setRegularContact(regularContact)
    // console.log('reg: ', regularContact);
  }, [data, idFavoriteContact])

  const addItemToFavoriteContact = (contact: Contact) => () => {
    setIdFavoriteContact([...idFavoriteContact, contact.id.toString()])
    setFavoriteContact([...favoriteContact, contact])
    setRegularContact(regularContact.filter((item: Contact) => item.id !== contact.id))
    localStorage.setItem('favoriteContact', [...idFavoriteContact, contact.id.toString()].toString())
    const contactOption = document.querySelector(`#contact-${contact.id}`)
    contactOption?.classList.toggle('hide')
  }

  const removeItemFromFavoriteContact = (contact: Contact) => () => {
    setIdFavoriteContact(idFavoriteContact.filter((item: string) => item !== contact.id.toString()))
    setFavoriteContact(favoriteContact.filter((item: Contact) => item.id !== contact.id))
    setRegularContact([...regularContact, contact])
    localStorage.setItem('favoriteContact', idFavoriteContact.filter((item: string) => item !== contact.id.toString()).toString())
    const contactOption = document.querySelector(`#contact-${contact.id}`)
    contactOption?.classList.toggle('hide')
  }

  const renderFavoriteContact = () => {
    if (!favoriteContact) return <p>Loading...</p>
    if (!favoriteContact.length) return <p>No favorite contact</p>
    return favoriteContact.map((contact: Contact) => (
      <ContactCard key={contact.id}>
        <ContactCardBody>
          <div>
            <ContactName>{contact.first_name} {contact.last_name}</ContactName>
            <ContactNumber>{contact.phones[0].number}</ContactNumber>
          </div>
          <ContactOptionButton onClick={handleToggleContactOption(contact.id)}>
            <FontAwesomeIcon icon={faEllipsisVertical} />
          </ContactOptionButton>
          <ContactOption className='contact-option hide' id={`contact-${contact.id}`}>
            <OptionItem onClick={removeItemFromFavoriteContact(contact)}>Remove From Favorite</OptionItem>
            <OptionItem>Edit</OptionItem>
            <OptionItem>Delete</OptionItem>
          </ContactOption>
        </ContactCardBody>
      </ContactCard>
    ))
  }

  const renderRegularContact = () => {
    if (!regularContact) return <p>Loading...</p>
    return regularContact.map((contact: Contact) => (
      <ContactCard key={contact.id}>
        <ContactCardBody>
          <div>
            <ContactName>{contact.first_name} {contact.last_name}</ContactName>
            <ContactNumber>{contact.phones[0].number}</ContactNumber>
          </div>
          <ContactOptionButton onClick={handleToggleContactOption(contact.id)}>
            <FontAwesomeIcon icon={faEllipsisVertical} />
          </ContactOptionButton>
          <ContactOption className='contact-option hide' id={`contact-${contact.id}`}>
            <OptionItem onClick={addItemToFavoriteContact(contact)}>Add To Favorite</OptionItem>
            <OptionItem>Edit</OptionItem>
            <OptionItem>Delete</OptionItem>
          </ContactOption>
        </ContactCardBody>
      </ContactCard>
    ))
  }

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

      <SectionTitle>Favorite Contact</SectionTitle>
      { renderFavoriteContact() }
      
      <SectionTitle>Regular Contact</SectionTitle>
      { renderRegularContact() }
    </CommonContainer>
  )
}

export default PhoneBook