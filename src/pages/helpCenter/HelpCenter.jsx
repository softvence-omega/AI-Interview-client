import Accordian from "./Accordian/Accordian";
import HelpCenterBanner from "./Banner/HelpCenterBanner";
import Faq from "./Faq/Faq";
import JobCard from "./JobCard/JobCard";

const HelpCenter = () => {
    return (
        <div className="bg-[#F6F6F7] justify-center text-center max-w-full mx-auto pb-24">
            {/* <HelpCenterBanner/>
            <JobCard/>
            <Accordian/> */}
            <Faq/>
        </div>
    );
};

export default HelpCenter;