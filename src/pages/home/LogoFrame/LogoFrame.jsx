import "./LogoFrame.css";
import useLandingPage from "../../../hook/useLandingPage";

const LogoFrame = () => {
  const { landingData, loading } = useLandingPage();

  if (loading)
    return <div className="text-center text-gray-500">Loading...</div>;
  if (!landingData)
    return <div className="text-center text-gray-500">No data available</div>;

  const companyLogos = landingData?.banner?.companyList || [];

  return (
    <div className="flex flex-wrap gap-4 justify-center items-center div-with-white-shadow mt-4 mb-12">
      {companyLogos.map((logoUrl, index) => (
        <img
          key={index}
          src={logoUrl}
          alt={`Company logo ${index + 1}`}
          className="w-[200px] h-auto object-contain"
        />
      ))}
    </div>
  );
};

export default LogoFrame;
