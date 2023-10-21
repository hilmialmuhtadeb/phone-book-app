import styled from '@emotion/styled'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons'
import { Contact } from '../interface/Contact'

interface ContactCardProps {
  contact: Contact
  handleToggleContactOption: (id: string) => () => void
  removeItemFromFavoriteContact?: (contact: Contact) => () => void
  addItemToFavoriteContact?: (contact: Contact) => () => void,
  isRegularContact?: boolean
}

const ContactCard = (props: ContactCardProps) => {
  const {
    contact,
    isRegularContact,
    handleToggleContactOption,
    removeItemFromFavoriteContact,
    addItemToFavoriteContact
  } = props
  
  const CardWrapper = styled.div`
    padding: 1rem;
    margin: 0 .5rem;
    border-bottom: 1px solid #aaa;
  `
  const ContactCardBody = styled.div`
    display: flex;
    justify-content: space-between;
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
    &.hidden {
      display: none;
    }
  `
  const OptionItem = styled.p`
    padding: .5rem 1rem;
    &:hover {
      background-color: #aaa;
    }
  `
  const ContactInformation = styled.div`
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    width: 100%;
    overflow: hidden;
  `
  const ContactName = styled.h3`
    margin-bottom: .5rem;
    font-weight: 500;
    line-clamp: 1;
    -webkit-line-clamp: 1;
  `
  const ContactNumber = styled.p`
    margin-bottom: .5rem;
  `
  
  return (
    <CardWrapper>
      <ContactCardBody>
        <ContactInformation>
          <ContactName>{contact.first_name} {contact.last_name}</ContactName>
          <ContactNumber>{contact.phones[0]?.number}</ContactNumber>
        </ContactInformation>
        <ContactOptionButton onClick={handleToggleContactOption(contact.id)}>
          <FontAwesomeIcon icon={faEllipsisVertical} />
        </ContactOptionButton>
        <ContactOption className='contact-option hidden' id={`contact-${contact.id}`}>
          { isRegularContact ? 
            (<OptionItem onClick={addItemToFavoriteContact?.(contact)}>Add To Favorite</OptionItem>) : 
            (<OptionItem onClick={removeItemFromFavoriteContact?.(contact)}>Remove From Favorite</OptionItem>)
          }
          <OptionItem>Edit</OptionItem>
          <OptionItem>Delete</OptionItem>
        </ContactOption>
      </ContactCardBody>
    </CardWrapper>
  )
}

export default ContactCard