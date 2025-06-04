import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdEdit, MdDelete } from "react-icons/md";
import { FaCircleCheck } from "react-icons/fa6";
import stripe from "../../../assets/stripe.png";
import EditPlanModal from "./components/EditPlan";

const Subscription = () => {
  const [plans, setPlans] = useState([]);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const fetchPlans = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/plan/all-plans`
      );
      setPlans(response.data.data);
    } catch (error) {
      console.error("Failed to fetch plans:", error);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleEdit = (plan) => {
    setSelectedPlan(plan);
    setIsEditOpen(true);
  };

  const handleUpdate = () => {
    setIsEditOpen(false);
    fetchPlans(); // Refresh plan list after update
  };

  return (
    <div className="p-6">
      <h1 className="text-[#212121] text-[28px] font-semibold text-center">
        Subscription and Payment Settings
      </h1>
      <p className="text-[#3A4C67] text-[12px] mt-4">
        <span className="text-[#878788]">Settings</span> / Subscription and
        Payment Settings
      </p>

      <div className="flex justify-end items-center gap-4 mb-6 mt-6">
        <button className="bg-[#37B874] text-white text-sm px-4 py-2 rounded hover:bg-green-700">
          Add New Subscription Plan +
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan._id}
            className="rounded-lg p-6 hover:shadow-lg transition duration-300 flex flex-col justify-between card w-74 md:w-72 lg:w-80 lg:p-[12px] h-[670px] bg-white text-[#3A4C67] shadow-sm border-1 border-[#37B874] relative"
          >
            <div className="card-body text-start">
              <div>
                <h3 className="text-[24px] font-bold mb-2">{plan.name}</h3>
                <p className="text-[#676768] text-[16px]">{plan.description}</p>
                <h3 className="text-[16px] font-bold mt-6">
                  <span className="text-[#37B874] text-3xl">
                    ${plan.priceMonthly}
                  </span>
                  {plan.priceLabel}
                </h3>
              </div>
              <h3 className="text-[20px] font-bold mt-4 mb-2">
                What's included
              </h3>
              <ul className="flex flex-col gap-2 text-[16px] text-[#3A4C67] font-medium">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <FaCircleCheck className="text-[#37B874]" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 absolute bottom-4 right-6 left-6">
                <button
                  type="button"
                  onClick={() => handleEdit(plan)}
                  className="flex items-center justify-center font-semibold h-12 w-full text-white bg-[#3A4C67] rounded-[12px]"
                >
                  Edit Your Plan
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Payment Gateway Section */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Payment Gateway</h2>
        <div className="flex items-center gap-4 mb-4">
          <div className="flex justify-between items-center w-[30%] bg-white p-2 py-1 rounded">
            <img src={stripe} alt="Stripe" className="w-20 h-10" />
            <button className="text-red-500 hover:text-red-600 cursor-pointer">
              <MdDelete className="w-6 h-5" />
            </button>
          </div>
        </div>
        <button className="bg-[#37B874] text-white px-4 py-2 rounded-lg hover:bg-green-700">
          Add +
        </button>
      </div>

      {selectedPlan && (
        <EditPlanModal
          isOpen={isEditOpen}
          onRequestClose={() => setIsEditOpen(false)}
          plan={selectedPlan}
          onUpdated={handleUpdate}
        />
      )}
    </div>
  );
};

export default Subscription;
