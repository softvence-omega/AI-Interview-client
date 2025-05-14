import React from "react";
import PlanBanner from "./Banner/PlanBanner";
import ChoosePlan from "./ChoosePlan/ChoosePlan";
import HomeCorner from "../home/HomeCorner/HomeCorner";

const Planpage = () => {
  return (
    <div className="bg-[#F6F6F7] justify-center text-center max-w-full mx-auto pb-24">
      <PlanBanner />
      <ChoosePlan />
      <div className="mx-4 md:mx-4 lg:mx-0 xl:mx-0">
        <HomeCorner />
      </div>
    </div>
  );
};

export default Planpage;
