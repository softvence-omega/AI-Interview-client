import useLandingPage from "../../../hook/useLandingPage";
import Buttons from "../../../reuseable/AllButtons";
import "./homeCorner.css";

const HomeCorner = () => {
  const { landingData, loading } = useLandingPage();

  if (loading)
    return <div className="text-center text-gray-500">Loading...</div>;
  if (!landingData)
    return <div className="text-center text-gray-500">No data available</div>;

  const corner = landingData?.aiCorner || [];

  return (
    <div
      id="prepareJobBanner"
      className="max-w-7xl mx-auto text-center justify-items-center items-center mt-24 mb-12"
    >
      <div className="content-wrapper text-center flex flex-col items-center px-4">
        <h1
          className="text-white w-[80%] md:w-[90%] lg:w-[50%] mx-auto"
          style={{
            background: "linear-gradient(90deg, #FFF   5.21%, #869AB7 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {corner.title}
        </h1>
        <p className="w-[80%] md:w-[90%] lg:w-[35%] mx-auto text-[#F6F6F7] mt-4">
          {corner.detail}
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
