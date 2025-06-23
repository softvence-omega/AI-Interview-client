import jf1 from "../../../assets/home/1.png";
import jf2 from "../../../assets/home/4.png";
import jf3 from "../../../assets/home/2.png";
import jf4 from "../../../assets/home/3.png";

const cardData = [
  {
    id: 1,
    step: "01",
    title: (
      <>
        Create Your <br />
        Profile
      </>
    ),
    image: jf1,
    description:
      "Tell us a bit about your experience and the job roles you're targeting. Our AI will tailor the mock interviews accordingly.",
  },
  {
    id: 2,
    step: "02",
    title: (
      <>
        Select Interview <br /> Type
      </>
    ),
    image: jf2,
    description:
      "Choose from technical, behavioral, or other interview types based on your preferences.",
  },
  {
    id: 3,
    step: "03",
    title: (
      <>
        Start Your Mock <br />
        Interview
      </>
    ),
    image: jf3,
    description:
      "Start the video interview and get instant feedback on your knowledge and body language.",
  },
  {
    id: 4,
    step: "04",
    title: (
      <>
        Track Your <br /> Progress
      </>
    ),
    image: jf4,
    description:
      "Review your performance and track improvement over time with insightful analytics.",
  },
];

const JustFewStep = () => {
  return (
    <div className="max-w-7xl mx-auto mt-24">
      <h1 className="text-center text-[32px] md:text-[32px] lg:text-[70px] font-semibold leading-[67.2px] bg-gradient-to-r from-[#195234] to-[#37B874] bg-clip-text text-transparent mb-12 md:w-[450px] lg:w-[864px] mx-auto">
        Start Preparing in Just a Few Steps
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-8 mt-16">
        {cardData.map((card) => (
          <div
            key={card.id}
            className="rounded-xl px-6 pt-6 pb-2 flex flex-col text-center"
          >
            <div className="bg-gradient-to-b from-[#F8F8F9] to-[#EBEDF0] rounded-[12px] w-full flex justify-center items-center mb-6">
              <img src={card.image} alt="" className="" />
            </div>
            <h2
              className="text-4xl font-bold mb-4"
              style={{
                background:
                  "linear-gradient(180deg, #1E6540 37.89%, #FFF 84.21%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {card.step}
            </h2>
            <h3 className="text-[#212121] text-[28px] font-semibold mb-4">
              {card.title}
            </h3>
            <p className="text-[#676768] text-sm tracking-wide w-[80%] md: lg:w-[55%] mx-auto">
              {card.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JustFewStep;
