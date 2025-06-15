import wc1 from "../../../assets/home/whychoose1.png";
import wc2 from "../../../assets/home/whychoose2.png";
import wc3 from "../../../assets/home/whychoose3.png";
import wc4 from "../../../assets/home/whychoose4.png";

const interviewData = [
  {
    title: "Personalized Mock Interviews",
    description:
      "Choose from a variety of job roles and interview types to practice exactly what you need.",
    image: wc1,
  },
  {
    title: "Real-Time AI Feedback",
    description:
      "Receive instant, actionable feedback on your answers, body language, and overall performance.",
    image: wc2,
  },
  {
    title: "Progress Tracking",
    description:
      "Visualize your growth with detailed performance metrics and track your improvement over time.",
    image: wc3,
  },
  {
    title: "System Design Interviews",
    description:
      "Get specific recommendations on how to enhance your answers, tone, and non-verbal communication.",
    image: wc4,
  },
];

const WhyChoose = () => {
  return (
    <div className="mt-12 md:mt-18 lg:mt-24">
      <h1 className="text-center text-[28px] md:text-[36px] lg:text-[70px] font-semibold leading-[67.2px] bg-gradient-to-r from-[#195234] to-[#37B874] bg-clip-text text-transparent mb-2 lg:mb-12 md:w-[450px] lg:w-[864px] mx-auto">
        Why Choose Inprep.ai
      </h1>

      <p className="text-center text-[16px] lg:text-xl font-normal leading-[24px] tracking-[-0.32px] text-[#676768] px-2 md:w-[480px] lg:w-[580px] mx-auto">
        Inprep.ai revolutionizes your interview preparation. With personalized
        learning paths, detailed feedback on speech clarity and body language,
        and comprehensive analytics, you can confidently tackle any interview.
      </p>

      <div className="mx-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mt-20 p-2 md:p-2 lg:p-0">
          {interviewData.map((item, index) => (
            <div
              key={index}
              className="w-full sm:w-1/2 md:w-full bg-white rounded-xl shadow-md border border-[#37B874]"
            >
              <div className="w-[65%] pt-6 ps-6">
                <h2 className="text-xl font-bold text-[#212121] text-left">
                  {item.title}
                </h2>
                <p className="text-[#676768] mt-2 text-left">
                  {item.description}
                </p>
              </div>
              <div className="flex justify-end -mt-18 pe-4">
                <img
                  src={item.image}
                  alt={item.title}
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
