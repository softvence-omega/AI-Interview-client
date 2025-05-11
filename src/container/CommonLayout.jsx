import React from 'react'
import Navbar from '../reuseable/Navbar'
import { Outlet } from 'react-router-dom'

const CommonLayout = () => {
  return (
    <div className='flex justify-center'>
      <div className='absolute top-0 w-full'>
      <Navbar/>
      </div>
      <div>
        <Outlet/>
      </div>
    </div>
  )
}

export default CommonLayout
