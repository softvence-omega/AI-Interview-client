import Buttons from "../../../reuseable/AllButtons";
import "./banner.css";
import bannerImage from "../../../assets/home-banner.png";
import softwareDeveloperCard from "../../../assets/softwaredeveloper.png";
import dataScience from "../../../assets/datascience.png";
import { FaArrowRight } from "react-icons/fa6";



const Banner = () => {
  return (
    <div id="banner" className="text-black text-center pt-24">
      <h1 className="text-center text-[70px] font-semibold leading-[67.2px] bg-gradient-to-r from-[#195234] to-[#37B874] bg-clip-text text-transparent mb-12 w-[864px] mx-auto">
        Master Your Interviews with AI-Driven Preparation
      </h1>

      <p className="text-center text-[16px] font-normal leading-[24px] tracking-[-0.32px] text-[#676768] w-[480px] mx-auto">
        Did you know that 80% of video interviews are screened by AI? With{" "}
        Inprep.ai, you can harness the power of AI to prepare for your{" "}
        interview. Join us now and get interview-ready with Inprep.ai!
      </p>

      <div className="flex justify-center items-center mt-8">
        <Buttons.LinkButton
          text="Get Started"
          to="/"
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
          className="relative z-10 mt-[40px] mx-auto object-contain
               w-[300px] h-[300px]
               sm:w-[400px] sm:h-[400px]
               md:w-[500px] md:h-[500px]
               lg:w-[600px] lg:h-[550px]
               xl:w-[666.822px] xl:h-[611px]"
        />

        {/* Floating Card - Left (Data Science) */}
        <div
          className="bg-white p-2 absolute rounded-xl shadow-2xl z-0
               top-[85%] left-[5%]
               sm:top-[80%] sm:left-[10%]
               md:top-[75%] md:left-[12%]
               lg:top-[50%] lg:left-[23%]"
        >
          <div className="flex flex-row text-left gap-2">
            <img
              src={dataScience}
              alt="Software Developer Interview"
              className="w-18 h-18"
            />
            <div>
              <p className="text-[10px] sm:text-[12px] md:text-[14px] lg:text-[16px]">
                Software Developer <br /> Interview
              </p>
              <p className="text-[#AFAFAF]">11 Positions</p>
            </div>
            <div className="flex items-center justify-center ml-auto">
            <FaArrowRight className="bg-[#37B874] text-white rounded-full w-8 h-8 p-2"/>
            </div>
          </div>
        </div>

        {/* Floating Card - Right (Software Developer) */}
        <div
          className="bg-white p-2 rounded-xl shadow-2xl absolute z-20
               top-[10%] right-[5%]
               sm:top-[12%] sm:right-[10%]
               md:top-[15%] md:right-[12%]
               lg:top-[20%] lg:right-[23%]"
        >
          <div className="flex flex-row text-left gap-2">
            <img
              src={softwareDeveloperCard}
              alt="Software Developer Interview"
              className="w-18 h-18"
            />
            <div>
              <p className="text-[10px] sm:text-[12px] md:text-[14px] lg:text-[16px]">
                Software Developer <br /> Interview
              </p>
              <p className="text-[#AFAFAF]">11 Positions</p>
            </div>
            <div className="flex items-center justify-center ml-auto">
            <FaArrowRight className="bg-[#37B874] text-white rounded-full w-8 h-8 p-2"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
