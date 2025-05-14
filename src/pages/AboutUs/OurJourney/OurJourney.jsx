import ourJourney from "../../../assets/aboutusimage.png";
import mission from "../../../assets/mission.png";
import mission1 from "../../../assets/mission1.png";

const OurJourney = () => {
  return (
    <div className="max-w-7xl mx-auto pt-12 md:pt-20 lg:pt-24">
      <img src={ourJourney} alt="" className="w-full mx-auto mb-8" />

      <h1
        className="text-center text-[26px] md:text-[32px] lg:text-[40px] font-semibold leading-[67.2px] mb-4 mx-auto mt-20"
        style={{
          background: "linear-gradient(90deg, #195234 0.24%, #37B874 85.86%)",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Our Journey
      </h1>

      <p className="text-center text-[16px] font-normal leading-[24px] tracking-[-0.32px] text-[#676768] w-full px-4 md:px-4 lg:px-20 mx-auto">
        Our journey started with a simple idea: What if we could harness the
        power of AI to make interview preparation smarter, more efficient, and
        personalized? We brought together a passionate team of developers,
        designers, and career experts to build a platform that would not only
        simulate real-life interviews but also provide actionable insights and
        feedback, helping candidates identify areas of improvement in real-time.
        <br />
        <br />
        Through countless iterations and feedback from our growing user base, we
        fine-tuned our platform to ensure it delivers a truly personalized
        experience. The integration of advanced natural language processing
        (NLP) allowed us to develop an intelligent system that could understand
        both the content and context of interview answers, just like a real
        interviewer would. It was an exciting milestone that set the stage for
        the next phase of our development.
        <br />
        <br />
        Our journey isn't over—it's just the beginning. We’re committed to
        evolving our platform, constantly improving our technology, and helping
        thousands of job seekers achieve their dream roles. Whether you're
        preparing for your first interview or aiming to refine your skills,
        we're here to guide you every step of the way.
      </p>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 px-4 text-left">
        <div className="flex flex-col lg:block md:justify-center lg:justify-start items-start">
          <h1
            className="text-left text-[26px] md:text-[32px] lg:text-[40px] font-semibold leading-[67.2px] mb-4 mx-auto"
            style={{
              background:
                "linear-gradient(90deg, #195234 0.24%, #37B874 85.86%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Mission & Vision
          </h1>
          <p className="text-[#212121] text-[18px] font-medium mb-4">
            At inpre.ai, we embarked on a mission to revolutionize how
            individuals prepare for interviews. From the very beginning, we
            understood that traditional interview prep can be time-consuming,
            stressful, and often doesn't reflect the real-world challenges of
            today's fast-paced job market.
          </p>
          <p className="text-[#676768]">
            We focused on removing the guesswork from the preparation process.
            Instead of relying on generic advice, our AI adapts to each
            individual's strengths, weaknesses, and career goals. Whether you're
            a fresh graduate preparing for your first job interview or a
            seasoned professional brushing up on advanced techniques, inpre.ai
            ensures that every user receives a tailored experience that reflects
            their unique needs.
          </p>
        </div>
        <div className="lg:flex justify-items-center items-center text-center mx-auto">
          <img src={mission} alt="" />
          <img src={mission1} alt="" />
        </div>
      </div>
    </div>
  );
};

export default OurJourney;
