import Buttons from "../../../reuseable/AllButtons";
import "./banner.css";
import bannerImage from "../../../assets/home-banner.png";

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

      <div className="">
        <img
          src={bannerImage}
          alt="banner"
          className="w-[666.822px] h-[611px] object-cover shrink-0 mx-auto bottom-0 left-0 right-0 mt-[64px]"
        />
      </div>
    </div>
  );
};

export default Banner;
