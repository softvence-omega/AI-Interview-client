import { useEffect, useState } from "react";
import { FaCircleCheck } from "react-icons/fa6";
import { Link } from "react-router-dom";

const ChoosePlan = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPlans = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/plan/all-plans`
      );
      const json = await res.json();
      setPlans(json?.data || []);
    } catch (error) {
      console.error("Error fetching plans:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (priceId) => {
    try {
      const userData = JSON.parse(localStorage.getItem("userData"));
      const token = userData?.approvalToken;

      console.log("fgvvbcbcbvcbvbvv", token);

      if (!token) {
        alert("You must be logged in to subscribe");
        return;
      }
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/payment/create-checkout-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
          body: JSON.stringify({ priceId }),
        }
      );
      const session = await response.json();
      if (session?.url) {
        window.location.href = session.url;
      } else {
        console.error("Stripe session URL not returned.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // const handleFreeSignup = async () => {
  //   // You could navigate or hit an endpoint to activate free access
  //   // For example, call your backend to activate free plan:
  //   try {
  //     const res = await fetch(
  //       "${import.meta.env.VITE_BASE_URL}/plan/activate-free",
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({}),
  //       }
  //     );
  //     const json = await res.json();
  //     if (json?.success) {
  //       // Redirect or show a message
  //       window.location.href = "/"; // Or wherever you want
  //     }
  //   } catch (error) {
  //     console.error("Error activating free plan:", error);
  //   }
  // };

  useEffect(() => {
    fetchPlans();
  }, []);

  if (loading) {
    return (
      <div className="text-center text-xl font-semibold mt-12">
        Loading plans...
      </div>
    );
  }

  const freePlan = plans.find((plan) => plan.priceMonthly === 0);
  const paidPlans = plans.filter((plan) => plan.priceMonthly > 0);

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-0 md:px-0 py-4">
      <h1
        className="text-center text-[28px] md:text-[36px] lg:text-[60px] font-semibold leading-[67.2px] mb-12 mx-auto mt-16"
        style={{
          background: "linear-gradient(90deg, #195234 0.24%, #37B874 85.86%)",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Choose Your Plan
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-items-center items-center mx-auto mb-12 gap-8">
        {/* Render Free Plan */}
        {freePlan && (
          <div className="card w-84 md:w-84 lg:w-96 lg:p-[32px] h-[640px] bg-white text-[#3A4C67] border-1 border-[#37B874] relative">
            <div className="card-body text-start">
              <div className="text-start">
                <h3 className="text-[24px] font-bold mb-2">{freePlan.name}</h3>
                <p className="text-[#676768] text-[16px] pe-2">
                  {freePlan.description}
                </p>
                <h3 className="text-[16px] font-bold mb-2 mt-6">
                  <span className="text-[#37B874] text-3xl">
                    ${freePlan.priceMonthly}
                  </span>
                  {freePlan.priceLabel}
                </h3>
              </div>
              <h3 className="text-[20px] font-bold mb-2 mt-1">
                What's included
              </h3>
              <ul className="flex flex-col gap-2 text-[16px] text-[#3A4C67] font-medium">
                {freePlan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <FaCircleCheck className="text-[#37B874] bg-[#FFF] rounded-full w-4 h-4 border-none" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 absolute bottom-4 right-6 left-6">
                <Link to="/">
                  <button
                    type="button"
                    className="flex items-center justify-center font-semibold transition duration-200 cursor-pointer h-12 w-full text-white bg-[#37B874] rounded-[12px]"
                  >
                    Get Started
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Render Paid Plans */}
        {paidPlans.map((plan, index) => (
          <div
            key={index}
            className="card w-84 md:w-84 lg:w-96 lg:p-[32px] h-[640px] bg-white text-[#3A4C67] shadow-sm border-1 border-[#37B874] relative"
          >
            <div className="card-body text-start">
              <div className="text-start">
                <h3 className="text-[24px] font-bold mb-2">{plan.name}</h3>
                <p className="text-[#676768] text-[16px] pe-2">
                  {plan.description}
                </p>
                <h3 className="text-[16px] font-bold mb-2 mt-6">
                  <span className="text-[#37B874] text-3xl">
                    ${plan.priceMonthly}
                  </span>
                  {plan.priceLabel}
                </h3>
              </div>
              <h3 className="text-[20px] font-bold mb-2 mt-1">
                What's included
              </h3>
              <ul className="flex flex-col gap-2 text-[16px] text-[#3A4C67] font-medium">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <FaCircleCheck className="text-[#37B874] bg-[#FFF] rounded-full w-4 h-4 border-none" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 absolute bottom-4 right-6 left-6">
                <button
                  onClick={() => handleSubscribe(plan.priceId)}
                  type="button"
                  className="flex items-center justify-center font-semibold transition duration-200 cursor-pointer h-12 w-full text-white bg-[#37B874] rounded-[12px]"
                >
                  Get Started
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChoosePlan;
