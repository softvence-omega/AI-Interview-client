import React from 'react'
import Banner from './Banner/Banner'
import LogoFrame from './LogoFrame/LogoFrame'
import WhyChoose from './WhyChoose/WhyChoose'
import PrepareAnyJob from './PrepareAnyJob/PrepareAnyJob'
import JustFewStep from './JustFewStep/JustFewStep'
import SuccessStories from './SuccessStories/SuccessStories'
import HomeCorner from './HomeCorner/HomeCorner'

const Home = () => {
  return (
    <div className='bg-[#F6F6F7] justify-center text-center max-w-full mx-auto pb-24'>
       <Banner/>
       <LogoFrame/>
       <WhyChoose/>
       <PrepareAnyJob/>
       <JustFewStep/>
       <SuccessStories/>
       <HomeCorner/>
    </div>
  )
}

export default Home;
