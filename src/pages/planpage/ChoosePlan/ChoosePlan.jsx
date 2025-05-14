import { FaCircleCheck } from "react-icons/fa6";
import Buttons from "../../../reuseable/AllButtons";

const ChoosePlan = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-0 md:px-0 py-4">
      <h1
        className="text-center text-[28px] md:text-[36px] lg:text-[60px] font-semibold leading-[67.2px] mb-12 mx-auto mt-16"
        style={{
          background: "linear-gradient(90deg, #195234   0.24%, #37B874 85.86%)",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Choose Your Plan
      </h1>

      {/* Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-items-center items-center mx-auto mb-12">
        <div className="card w-84 md:w-84 lg:w-96 lg:p-[32px] h-[640px] bg-white text-[#3A4C67] shadow-sm border-1 border-[#37B874] relative mb-8 lg:mb-0 md:mb-0">
          <div className="card-body text-start">
            <div className="text-start">
              <h3 className="text-[24px] font-bold mb-2">Free Plan</h3>
              <p className="text-[#676768] text-[16px] pe-2">
                Track and prepare your job search using our free version. It's
                always free, no credit card needed.
              </p>

              <h3 className="text-[16px] font-bold mb-2 mt-6">
                <span className="text-[#37B874] text-3xl">$00</span>/monthly
              </h3>
            </div>
            <h3 className="text-[20px] font-bold mb-2 mt-1">What's included</h3>
            <ul className="flex flex-col gap-2 text-[16px] text-[#3A4C67] font-medium">
              <li className="flex justify-items-center items-center gap-2">
                <FaCircleCheck className="text-[#37B874] bg-[#FFF] rounded-full w-4 h-4 border-none" />

                <span>1 Free Mock Interview</span>
              </li>
              <li className="flex justify-items-center items-center gap-2">
                <FaCircleCheck className="text-[#37B874] bg-[#FFF] rounded-full w-4 h-4 border-none" />

                <span>Track up to 10 Jobs per month</span>
              </li>
              <li className="flex justify-items-center items-center gap-2">
                <FaCircleCheck className="text-[#37B874] bg-[#FFF] rounded-full w-4 h-4 border-none" />

                <span>Personalized Feedback</span>
              </li>
              <li className="flex justify-items-center items-center gap-2">
                <FaCircleCheck className="text-[#37B874] bg-[#FFF] rounded-full w-4 h-4 border-none" />

                <span>Access to AI Feedback 1 Interview</span>
              </li>
              <li className="flex justify-items-center items-center gap-2">
                <FaCircleCheck className="text-[#37B874] bg-[#FFF] rounded-full w-4 h-4 border-none" />

                <span>Progress Tracking</span>
              </li>
              <li className="flex justify-items-center items-center gap-2">
                <FaCircleCheck className="text-[#37B874] bg-[#FFF] rounded-full w-4 h-4 border-none" />

                <span>Recommendation for Improvement</span>
              </li>
            </ul>
            <div className="mt-6 absolute bottom-4 right-6 left-6">
              {/* <button className="btn btn-success btn-block">Get Started</button> */}
              <Buttons.LinkButton
                text="Get Started"
                to="/login"
                height="h-12"
                width="w-full"
                rounded="rounded-xl"
                textSize="text-[16px]"
              />
            </div>
          </div>
        </div>
        <div className="card w-84 md:w-84 lg:w-96 lg:p-[32px] h-[640px] bg-white text-[#3A4C67] shadow-sm border-1 border-[#37B874] relative mb-8 lg:mb-0 md:mb-0">
          <div className="card-body text-start">
            <div className="text-start">
              <h3 className="text-[24px] font-bold mb-2">Premium Plan</h3>
              <p className="text-[#676768] text-[16px] pe-2">
              Get full access to Inprep.ai App and web version. Track and prepare for any job using the AI by your side. 
              </p>

              <h3 className="text-[16px] font-bold mb-2 mt-6">
                <span className="text-[#37B874] text-3xl">$19.99</span>/monthly
              </h3>
            </div>
            <h3 className="text-[20px] font-bold mb-2 mt-1">What's included</h3>
            <ul className="flex flex-col gap-2 text-[16px] text-[#3A4C67] font-medium">
              <li className="flex justify-items-center items-center gap-2">
                <FaCircleCheck className="text-[#37B874] bg-[#FFF] rounded-full w-4 h-4 border-none" />

                <span>10 Mock Interviews</span>
              </li>
              <li className="flex justify-items-center items-center gap-2">
                <FaCircleCheck className="text-[#37B874] bg-[#FFF] rounded-full w-4 h-4 border-none" />

                <span>Unlimited Jobs Tracking</span>
              </li>
              <li className="flex justify-items-center items-center gap-2">
                <FaCircleCheck className="text-[#37B874] bg-[#FFF] rounded-full w-4 h-4 border-none" />

                <span>Personalized Feedback</span>
              </li>
              <li className="flex justify-items-center items-center gap-2">
                <FaCircleCheck className="text-[#37B874] bg-[#FFF] rounded-full w-4 h-4 border-none" />

                <span>Access to AI Feedback 10 Interview</span>
              </li>
              <li className="flex justify-items-center items-center gap-2">
                <FaCircleCheck className="text-[#37B874] bg-[#FFF] rounded-full w-4 h-4 border-none" />

                <span>Progress Tracking</span>
              </li>
              <li className="flex justify-items-center items-center gap-2">
                <FaCircleCheck className="text-[#37B874] bg-[#FFF] rounded-full w-4 h-4 border-none" />

                <span>Recommendation for Improvement</span>
              </li>
            </ul>
            <div className="mt-6 absolute bottom-4 right-6 left-6">
              {/* <button className="btn btn-success btn-block">Get Started</button> */}
              <Buttons.LinkButton
                text="Get Started"
                to="/login"
                height="h-12"
                width="w-full"
                rounded="rounded-xl"
                textSize="text-[16px]"
              />
            </div>
          </div>
        </div>
        <div className="card w-84 md:w-84 lg:w-96 lg:p-[32px] h-[640px] bg-white text-[#3A4C67] shadow-sm border-1 border-[#37B874] relative mb-8 lg:mb-0 md:mb-0 md:mt-8 lg:mt-0 mt-0">
          <div className="card-body text-start">
            <div className="text-start">
              <h3 className="text-[24px] font-bold mb-2">Pay-Per-Interview</h3>
              <p className="text-[#676768] text-[16px] pe-2">
              Ran out of interview slots? No need to worry, buy interview when you need it.
              </p>

              <h3 className="text-[16px] font-bold mb-2 mt-6">
                <span className="text-[#37B874] text-3xl">$4.99</span>/Per Interview
              </h3>
            </div>
            <h3 className="text-[20px] font-bold mb-2 mt-1">What's included</h3>
            <ul className="flex flex-col gap-2 text-[16px] text-[#3A4C67] font-medium">
              <li className="flex justify-items-center items-center gap-2">
                <FaCircleCheck className="text-[#37B874] bg-[#FFF] rounded-full w-4 h-4 border-none" />

                <span>Unlimited Jobs Tracking</span>
              </li>
              <li className="flex justify-items-center items-center gap-2">
                <FaCircleCheck className="text-[#37B874] bg-[#FFF] rounded-full w-4 h-4 border-none" />

                <span>Personalized Feedback</span>
              </li>
              <li className="flex justify-items-center items-center gap-2">
                <FaCircleCheck className="text-[#37B874] bg-[#FFF] rounded-full w-4 h-4 border-none" />

                <span>Access to AI Feedback</span>
              </li>
              <li className="flex justify-items-center items-center gap-2">
                <FaCircleCheck className="text-[#37B874] bg-[#FFF] rounded-full w-4 h-4 border-none" />

                <span>Progress Tracking</span>
              </li>
              <li className="flex justify-items-center items-center gap-2">
                <FaCircleCheck className="text-[#37B874] bg-[#FFF] rounded-full w-4 h-4 border-none" />

                <span>Recommendation for Improvement</span>
              </li>
            </ul>
            <div className="mt-6 absolute bottom-4 right-6 left-6">
              {/* <button className="btn btn-success btn-block">Get Started</button> */}
              <Buttons.LinkButton
                text="Get Started"
                to="/login"
                height="h-12"
                width="w-full"
                rounded="rounded-xl"
                textSize="text-[16px]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChoosePlan;
