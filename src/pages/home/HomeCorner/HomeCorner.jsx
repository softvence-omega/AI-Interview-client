import Buttons from "../../../reuseable/AllButtons";
import "./homeCorner.css";

const HomeCorner = () => {
  return (
    <div
      id="prepareJobBanner"
      className="max-w-7xl mx-auto text-center justify-items-center items-center mt-24 mb-12"
    >
      <div className="content-wrapper text-center flex flex-col items-center px-4">
        <h1 className="text-white w-[80%] md:w-[90%] lg:w-[50%] mx-auto"
        style={{
          background: "linear-gradient(90deg, #FFF   5.21%, #869AB7 100%)",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
        >
          It's time you get AI on your corner.
        </h1>
        <p className="w-[80%] md:w-[90%] lg:w-[35%] mx-auto text-[#F6F6F7] mt-4">
          Whether you're preparing for your first job or aiming for a new
          challenge, inprep.ai helps you prepare smarter with AI-driven
          insights.
        </p>
        <Buttons.LinkButton
          text="Start Free Trial"
          to="/"
          height="h-12"
          width="w-36"
          rounded="rounded-xl"
          className="mt-8"
        />
      </div>
    </div>
  );
};

export default HomeCorner;
