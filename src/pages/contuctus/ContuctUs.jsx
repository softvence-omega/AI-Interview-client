import React from 'react'
import ContactUsBanner from './Banner/ContactUsBanner'
import ContactForm from './ContactForm/ContactForm'

const ContuctUs = () => {
  return (
    <div className="bg-[#F6F6F7] justify-center text-center max-w-full mx-auto pb-24">
      <ContactUsBanner/>
      <ContactForm/>
    </div>
  )
}

export default ContuctUs
