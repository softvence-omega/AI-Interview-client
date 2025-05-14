import React from "react";
import AboutUsBanner from "./Banner/AboutUSBanner";
import OurJourney from "./OurJourney/OurJourney";

const AboutUs = () => {
  return (
    <div className="bg-[#F6F6F7] justify-center text-center max-w-full mx-auto pb-24">
      <AboutUsBanner />
      <div className="px-2 mx-auto">
        <OurJourney />
      </div>
    </div>
  );
};

export default AboutUs;
