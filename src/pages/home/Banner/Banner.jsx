import Buttons from "../../../reuseable/AllButtons";
import "./banner.css";
import bannerImage from "../../../assets/home-banner.png";
import softwareDeveloperCard from "../../../assets/softwaredeveloper.png";
import dataScience from "../../../assets/datascience.png";
import { FaArrowRight } from "react-icons/fa6";
import { Link } from "react-router-dom";
import useLandingPage from "../../../hook/useLandingPage";

const Banner = () => {
  const { landingData, loading } = useLandingPage();

  if (loading)
    return <div className="text-center text-gray-500">Loading...</div>;
  if (!landingData)
    return <div className="text-center text-gray-500">No data available</div>;

  return (
    <div id="banner" className="text-black text-center pt-24">
      <h1 className="text-center text-[28px] md:text-[36px] lg:text-[60px] font-semibold leading-[67.2px] bg-gradient-to-r from-[#195234] to-[#37B874] bg-clip-text text-transparent mb-12 md:w-[450px] lg:w-[820px] mx-auto px-2 md:px-0 lg:px-0">
        {landingData.banner.title}
      </h1>

      <p className="text-center text-[16px] font-normal leading-[24px] tracking-[-0.32px] text-[#676768] w-full px-2 md:w-[410px] lg:w-[480px] mx-auto">
        {landingData.banner.detail}
      </p>

      <div className="flex justify-center items-center mt-8">
        <Buttons.LinkButton
          text="Get Started"
          to="/userDashboard/mockInterview"
          height="h-12"
          width="w-32"
          rounded="rounded-xl"
        />
      </div>

      <div className="relative w-full overflow-hidden text-[#212121]">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 z-0 bg-[url('/grid-pattern.svg')] bg-cover bg-center" />

        {/* Banner Image (floating phones) */}
        <img
          src={bannerImage}
          alt="banner"
          className="relative z-10 mt-[50px] mx-auto object-contain
               w-[300px] h-[300px]
               sm:w-[400px] sm:h-[400px]
               md:w-[500px] md:h-[500px]
               lg:w-[600px] lg:h-[550px]
               xl:w-[666.822px] xl:h-[611px]"
        />

        {/* Floating Card - Left (Data Science) */}
        <div
          className="bg-white p-2 absolute rounded-xl cursor-pointer shadow-2xl z-0
               top-[85%] left-[5%]
               sm:top-[80%] sm:left-[10%]
               md:top-[75%] md:left-[12%]
               lg:top-[49%] lg:left-[22%]"
        >
          <div className="flex flex-row text-left gap-2 cursor-pointer">
            <img
              src={dataScience}
              alt="Software Developer Interview"
              className="w-8 md:w-14 lg:w-18 h-8 md:h-14 lg:h-18"
            />
            <div>
              <p className="text-[8px] sm:text-[12px] md:text-[14px] lg:text-[16px]">
                AI Developer <br /> Interview
              </p>
              <p className="text-[#AFAFAF] text-xs md:text-md lg:text-md">
                Machine Learning Engineer
              </p>
            </div>
            <div className="flex items-center justify-center ml-auto">
              <Link
                to="/userDashboard/mockInterview"
                className="cursor-pointer"
              >
                <FaArrowRight className="bg-[#37B874] text-white rounded-full w-8 h-8 p-2" />
              </Link>
            </div>
          </div>
        </div>

        {/* Floating Card - Right (Software Developer) */}
        <div
          className="bg-white p-2 rounded-xl shadow-2xl absolute z-20
               top-[10%] right-[5%]
               sm:top-[12%] sm:right-[10%]
               md:top-[15%] md:right-[12%]
               lg:top-[22%] lg:right-[23%]"
        >
          <div className="flex flex-row text-left gap-2">
            <img
              src={softwareDeveloperCard}
              alt="Software Developer Interview"
              className="w-8 md:w-14 lg:w-18 h-8 md:h-14 lg:h-18"
            />
            <div>
              <p className="text-[8px] sm:text-[12px] md:text-[14px] lg:text-[16px]">
                Software Developer <br /> Interview
              </p>
              <p className="text-[#AFAFAF] text-xs md:text-md lg:text-md">
              MERN Stack Developer
              </p>
            </div>
            <div className="flex items-center justify-center ml-auto">
              <Link
                to="/userDashboard/mockInterview"
                className="cursor-pointer"
              >
                <FaArrowRight className="bg-[#37B874] text-white rounded-full w-8 h-8 p-2" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
