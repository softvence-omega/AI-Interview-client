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
    <div className="pt-14 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center">
        <h1 className="text-center text-[28px] md:text-[36px] lg:text-[64px] font-semibold leading-tight bg-gradient-to-r from-[#195234] to-[#37B874] bg-clip-text text-transparent max-w-[864px]">
          As Seen In
        </h1>
        <div className="flex flex-wrap justify-center gap-4 lg:gap-8">
          {companyLogos.map((logoUrl, index) => (
            <img
              key={index}
              src={logoUrl}
              alt={`Company logo ${index + 1}`}
              className="w-[150px] sm:w-[180px] lg:w-[200px] h-auto object-contain"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LogoFrame;
