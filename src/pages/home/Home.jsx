import React from "react";
import Banner from "./Banner/Banner";
import LogoFrame from "./LogoFrame/LogoFrame";
import WhyChoose from "./WhyChoose/WhyChoose";
import PrepareAnyJob from "./PrepareAnyJob/PrepareAnyJob";
import JustFewStep from "./JustFewStep/JustFewStep";
import SuccessStories from "./SuccessStories/SuccessStories";
import HomeCorner from "./HomeCorner/HomeCorner";
import { LandingPageProvider } from "../../context/LandingPageContext";

const Home = () => {
  return (
    <div className="bg-[#F6F6F7] justify-center text-center max-w-full mx-auto pb-24">
      <Banner />
      <LogoFrame />
      <WhyChoose />
      <PrepareAnyJob />
      <JustFewStep />
      <SuccessStories />
      <div className="mx-4 md:mx-4 lg:mx-0 xl:mx-0">
        <HomeCorner />
      </div>
    </div>
  );
};

export default Home;
