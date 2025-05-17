import HelpCenterBanner from "./Banner/HelpCenterBanner";
import JobCard from "./JobCard/JobCard";

const HelpCenter = () => {
    return (
        <div className="bg-[#F6F6F7] justify-center text-center max-w-full mx-auto pb-24">
            <HelpCenterBanner/>
            <JobCard/>
        </div>
    );
};

export default HelpCenter;