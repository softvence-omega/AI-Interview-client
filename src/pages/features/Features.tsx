import React from "react";
import FeaturesBanner from "./Banner/FeatureBanner";
import InterviewFeatures from "./InterviewFeatures/InterviewFeatures";
import HomeCorner from "../home/HomeCorner/HomeCorner";

const Features = () => {
  return (
    <div className="bg-[#F6F6F7] justify-center text-center max-w-full mx-auto pb-24">
      <FeaturesBanner />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <InterviewFeatures />
      </div>
      <div className="mx-4 md:mx-4 lg:mx-0 xl:mx-0">
        <HomeCorner />
      </div>
    </div>
  );
};

export default Features;
