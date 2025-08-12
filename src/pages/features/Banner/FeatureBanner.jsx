import "./FeatureBanner.css";
import bannerImage from "../../../assets/features/featurebanner.png";

const FeaturesBanner = () => {
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
        Features
      </h1>

      <p className="text-center text-[16px] lg:text-xl font-normal leading-[24px] tracking-[-0.32px] text-[#676768] w-full px-2 md:w-[510px] lg:w-[520px] mx-auto">
        Explore the powerful tools and features that make inprep.ai the most
        effective way to prepare for interviews, track job applications, and
        improve your chances of success.
      </p>

      <div className="w-full overflow-hidden text-[#212121] flex justify-end items-center xl:-mt-24">
        <img src={bannerImage} alt="banner" className="z-10 object-contain" />
      </div>
    </div>
  );
};

export default FeaturesBanner;
