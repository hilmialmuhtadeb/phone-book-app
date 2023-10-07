import { useState } from 'react'
import { gql, useMutation } from '@apollo/client'
import styled from "@emotion/styled"
import { toast } from 'react-hot-toast'
import AppHeader from "../components/AppHeader"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'

const ADD_CONTACT_WITH_PHONES = gql`
  mutation AddContactWithPhones(
    $first_name: String!, 
    $last_name: String!, 
    $phones: [phone_insert_input!]!
    ) {
    insert_contact(
        objects: {
            first_name: $first_name, 
            last_name: $last_name,
            phones: { 
                data: $phones
            }
        }
    ) {
    returning {
      first_name
      last_name
      id
      phones {
        number
      }
    }
  }
  }
`

const FormWrapper = styled.div`
  margin: 2rem 0;
  padding: 0 1rem;
  `
const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: .5rem;
  margin-bottom: 1rem;
`
const FormInput = styled.input`
  display: block;
  padding: .5rem 1rem;
  border-radius: 5px;
  border: 1px solid black;
  font-size: 1rem;
  width: 100%;
  flex-grow: 1;
`
const AddOtherNumber = styled.button`
  display: block;
  padding: .5rem 0;
  font-size: 1rem;
  width: 100%;
  background-color: transparent;
  border: none;
  text-align: left;
  text-decoration: underline;
`
const RemoveNumberFieldButton = styled.button`
  display: block;
  margin: 0;
  padding: .5rem;
  font-size: 1rem;
  background-color: red;
  border: 1px solid #8B0000;
  border-radius: 5px;
  text-align: left;
  text-decoration: underline;
  &:hover {
    background-color: #8B0000;
  }
`
const CustomFontAwesomeIcon = styled(FontAwesomeIcon)`
  font-size: 1.2rem;
  color: white;
`
const SaveButton = styled.button`
  display: block;
  padding: .5rem 1rem;
  margin: 1rem 0;
  border-radius: 1rem;
  background-color: #000;
  color: #fff;
  font-weight: bold;
  font-size: 1rem;
  width: 100%;
`
const ErrorMessage = styled.p`
  color: red;
`

const AddContact = () => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phoneNumbers, setPhoneNumbers] = useState([''])

  const [insert_contact, {error}] = useMutation(ADD_CONTACT_WITH_PHONES)

  const handleAddPhoneNumberField = () => {
    setPhoneNumbers([...phoneNumbers, ''])
  }

  const handleRemovePhoneNumberField = (index: number) => {
    return () => {
      const updatedPhoneNumbers = [...phoneNumbers]
      updatedPhoneNumbers.splice(index, 1)
      setPhoneNumbers(updatedPhoneNumbers)
    }
  }

  const handleSaveContact = async () => {
    try {
      await insert_contact({
        variables: {
          first_name: firstName,
          last_name: lastName,
          phones: phoneNumbers.map(phoneNumber => ({
            number: phoneNumber
          }))
        }
      })

      toast.success('Contact saved successfully')
    } catch (err) {
      toast.error('Failed saving contact')
      console.log('Error: ', error?.message)
    }
  }
  
  return (
    <>
      <AppHeader />
      <FormWrapper>
        <InputWrapper>
          <FormInput type="text" placeholder="First Name" onChange={e => setFirstName(e.target.value)} />
        </InputWrapper>
        <InputWrapper>
          <FormInput type="text" placeholder="Last Name" onChange={e => setLastName(e.target.value)} />
        </InputWrapper>
        {
          phoneNumbers.map((phoneNumber, index) => (
            <InputWrapper key={index}>
              <FormInput
                type="text"
                inputMode="numeric"
                placeholder="Phone Number"
                value={phoneNumber}
                onChange={(e) => {
                  const updatedPhoneNumbers = [...phoneNumbers];
                  updatedPhoneNumbers[index] = e.target.value;
                  setPhoneNumbers(updatedPhoneNumbers);
                }}
              />
              { index > 0 && (
              <RemoveNumberFieldButton onClick={handleRemovePhoneNumberField(index)}>
                <CustomFontAwesomeIcon icon={faTrash} />
              </RemoveNumberFieldButton>)
              }
            </InputWrapper>
          ))
        }
        <AddOtherNumber onClick={handleAddPhoneNumberField}>Add Other Number</AddOtherNumber>
        <SaveButton onClick={handleSaveContact}>Save</SaveButton>
        { error && <ErrorMessage>{error.message}</ErrorMessage> }
      </FormWrapper>
    </> 
  )
}

export default AddContact