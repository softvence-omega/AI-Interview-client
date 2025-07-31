import "./AboutUsBanner.css";
import bannerImage from "../../../assets/greeting.png";

const AboutUsBanner = () => {
  return (
    <div id="feature-banner" className="text-black text-center pt-24">
      <h1
        className="text-center text-[28px] md:text-[36px] lg:text-[60px] font-semibold leading-[67.2px] mb-12 mx-auto"
        style={{
          background: "linear-gradient(90deg, #195234   0.24%, #37B874 85.86%)",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        About Us
      </h1>

      <p className="text-center text-[16px] font-normal leading-[24px] tracking-[-0.32px] text-[#676768] w-full px-2 md:w-[510px] lg:w-[520px] mx-auto">
      We are a team dedicated to revolutionizing interview preparation with AI-driven insights. At inprep.ai, we empower job seekers to master their interviews through personalized mock interviews, real-time feedback, and actionable insights.
      </p>

      <div className="w-full overflow-hidden text-[#212121] flex justify-end items-center xl:-mt-24">
        <img src={bannerImage} alt="banner" className="z-10 object-contain" />
      </div>
    </div>
  );
};

export default AboutUsBanner;
