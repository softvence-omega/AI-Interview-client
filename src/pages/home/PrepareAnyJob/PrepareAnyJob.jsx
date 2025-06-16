import "./prepareAnyJob.css";
import prepareAnyJobImage from "../../../assets/home/prepare.png";
import useLandingPage from "../../../hook/useLandingPage";

// const cardData = [
//   {
//     id: 1,
//     step: "01",
//     title: (
//       <>
//         Install the Chrome <br />
//         Extension
//       </>
//     ),
//     description:
//       "Add the inprep.ai Chrome Extension to your browser to instantly transform job postings into personalized interview prep.",
//   },
//   {
//     id: 2,
//     step: "02",
//     title: (
//       <>
//         Find a Job <br /> Posting
//       </>
//     ),
//     description:
//       "Browse job listings on platforms like LinkedIn, Indeed, or Glassdoor. Click the extension icon when you find a relevant posting.",
//   },
//   {
//     id: 3,
//     step: "03",
//     title: (
//       <>
//         Generate the QR <br />
//         Code
//       </>
//     ),
//     description:
//       "The extension generates a QR code based on the job description, containing personalized mock interview questions and key focus areas.",
//   },
//   {
//     id: 4,
//     step: "04",
//     title: (
//       <>
//         Scan with the Mobile <br /> App & Practice
//       </>
//     ),
//     description:
//       "Open the inprep.ai app, scan the QR code, and start practicing with tailored interview sessions. Receive feedback and track your progress.",
//   },
// ];

const PrepareAnyJob = () => {
  const { landingData, loading } = useLandingPage();

  if (loading)
    return <div className="text-center text-gray-500">Loading...</div>;
  if (!landingData)
    return <div className="text-center text-gray-500">No data available</div>;

  const prepareAnyJob = landingData?.guide || [];

  console.log(prepareAnyJob)
  return (
    <div className="mx-0 lg:mx-0">
      <div
        id="prepareJobBanner"
        className="text-center justify-items-center items-center mt-24 bannerBG"
      >
        <div className="content-wrapper">
          <img
            src={prepareAnyJobImage}
            className="mx-auto"
            alt="Prepare for any job"
          />
          <h1 className="text-white md:w-[70%] lg:w-[70%] mx-auto">
            {prepareAnyJob.title}
          </h1>
          <p className="w-[80%] mx-auto text-[#676768] mt-4">
            {prepareAnyJob.detail}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
            {prepareAnyJob?.guideCards?.map((card, index) => (
              <div
                key={card.id}
                className="bg-white rounded-xl shadow-lg px-6 pt-6 pb-2 flex flex-col items-start text-start"
              >
                <div
                  className="text-4xl font-bold mb-4"
                  style={{
                    background:
                      "linear-gradient(180deg, #1E6540 7.89%, #FFF 84.21%)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {(index + 1).toString().padStart(2, "0")}
                </div>
                <h3 className="text-[#212121] text-[28px] font-semibold mb-4">
                  {card.title}
                </h3>
                <p className="text-[#676768] text-sm tracking-wide">
                  {card.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrepareAnyJob;
