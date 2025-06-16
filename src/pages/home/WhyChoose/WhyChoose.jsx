import wc1 from "../../../assets/home/whychoose1.png";
import wc2 from "../../../assets/home/whychoose2.png";
import wc3 from "../../../assets/home/whychoose3.png";
import wc4 from "../../../assets/home/whychoose4.png";
import useLandingPage from "../../../hook/useLandingPage";

const localImages = [wc1, wc2, wc3, wc4];

const WhyChoose = () => {
  const { landingData, loading } = useLandingPage();

  if (loading)
    return <div className="text-center text-gray-500">Loading...</div>;
  if (!landingData)
    return <div className="text-center text-gray-500">No data available</div>;

  const features = landingData?.features.cards || [];

  return (
    <div className="mt-12 md:mt-18 lg:mt-24">
      <h1 className="text-center text-[28px] md:text-[36px] lg:text-[70px] font-semibold leading-[67.2px] bg-gradient-to-r from-[#195234] to-[#37B874] bg-clip-text text-transparent mb-2 lg:mb-12 md:w-[450px] lg:w-[864px] mx-auto">
        {landingData?.features?.title || "Why Choose Us"} {/* fallback title */}
      </h1>

      <p className="text-center text-[16px] lg:text-xl font-normal leading-[24px] tracking-[-0.32px] text-[#676768] px-2 md:w-[480px] lg:w-[580px] mx-auto">
        {landingData?.features?.detail || "Our unique features to help you succeed."} {/* fallback detail */}
      </p>

      <div className="mx-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mt-20 p-2 md:p-2 lg:p-0">
          {features.length > 0
            ? features.map((feature, index) => (
                <div
                  key={index}
                  className="w-full sm:w-1/2 md:w-full bg-white rounded-xl shadow-md border border-[#37B874]"
                >
                  <div className="w-[65%] pt-6 ps-6">
                    <h2 className="text-xl font-bold text-[#212121] text-left">
                      {feature.title}
                    </h2>
                    <p className="text-[#676768] mt-2 text-left">
                      {feature.detail}
                    </p>
                  </div>
                  <div className="flex justify-end -mt-18 pe-4">
                    <img
                      src={localImages[index] || localImages[0]}
                      alt={feature.title}
                      className="mt-4 rounded-lg"
                    />
                  </div>
                </div>
              ))
            : // fallback if no API data, show local hardcoded
              localImages.map((img, i) => (
                <div
                  key={i}
                  className="w-full sm:w-1/2 md:w-full bg-white rounded-xl shadow-md border border-[#37B874]"
                >
                  <div className="w-[65%] pt-6 ps-6">
                    <h2 className="text-xl font-bold text-[#212121] text-left">
                      "Feature Title"
                    </h2>
                    <p className="text-[#676768] mt-2 text-left">
                      "Feature description..."
                    </p>
                  </div>
                  <div className="flex justify-end -mt-18 pe-4">
                    <img
                      src={img}
                      alt={`Feature ${i + 1}`}
                      className="mt-4 rounded-lg"
                    />
                  </div>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
};

export default WhyChoose;
