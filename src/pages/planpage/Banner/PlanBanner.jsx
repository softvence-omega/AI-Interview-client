import "./PlanBanner.css";
import bannerImage from "../../../assets/planPricing.png";

const PlanBanner = () => {
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
        Pricing Plans
      </h1>

      <p className="text-center text-[16px] font-normal leading-[24px] tracking-[-0.32px] text-[#676768] w-full px-2 md:w-[510px] lg:w-[520px] mx-auto">
      Whether you're just getting started or ready to go all-in with unlimited interviews, we have a plan that fits your needs. Choose the one that works best for you.
      </p>

      <div className="w-full overflow-hidden text-[#212121] flex justify-end items-center xl:-mt-24">
        <img src={bannerImage} alt="banner" className="z-10 object-contain" />
      </div>
    </div>
  );
};

export default PlanBanner;
