import React from "react";
import AboutUsBanner from "./AboutUsBanner/AboutUsBanner";
import OurJourney from "./OurJourney/OurJourney";
import OurTeam from "./OurTeam/OurTeam";

const AboutUs = () => {
  return (
    <div className="bg-[#F6F6F7] justify-center text-center max-w-full mx-auto pb-24">
      <AboutUsBanner />
      <div className="px-2 mx-auto">
        <OurJourney />
        <OurTeam />
      </div>
    </div>
  );
};

export default AboutUs;
