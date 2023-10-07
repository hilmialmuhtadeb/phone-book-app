import AppHeader from "../components/AppHeader"
import { Contact } from "../interface/Contact"

interface ContactDetailProps {
  contact: Contact
}

const ContactDetail = ({ contact }: ContactDetailProps) => {
  const { first_name, last_name, phones } = contact
  const mainPhone = phones[0].number
  
  return (
    <>
      <AppHeader />
      <div>
        <h1>{ first_name } { last_name }</h1>
        <p>{ mainPhone }</p>
      </div>
    </>
  )
}

export default ContactDetail