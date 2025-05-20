import React from "react";

const PlanTest = () => {
  const plans = [
    {
      name: "Premium",
      price: "$19.99",
      priceId: "price_1RQh51AeQO2CXKLXBTbmxa3M",
      features: [
        "10 Mock Interviews",
        "Unlimited Jobs Tracking",
        "Access to AI Feedback 10 Interview",
        "Personalized Feedback",
        "Generate Custom Mock Interview",
        "Progress Tracking",
        "Recommendation for Improvement",
      ],
    },
    {
      name: "Pay-Per",
      price: "$4.99",
      priceId: "price_1RQh5lAeQO2CXKLX0brJrWGJ",
      features: [
        "Single Job Tracking",
        "Access to AI Feedback",
        "Generate Custom Mock Interview",
        "Personalized Feedback",
        "Progress Tracking",
        "Recommendation for Improvement",
      ],
    },
  ];

  const handleSubscribe = async(priceId) => {
    try {
        const response = await fetch('http://localhost:3000/create-checkout-session',{
            method: 'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body:JSON.stringify({priceId})
        })
        const session = await response.json()
        window.location.href = session.url;
    } catch (error) {
        console.log(error)
    }
  }

  return (
    <div>
      <div>
        {plans.map((plan) => (
          <div
            key={plan.name}
            className="flex flex-col bg-white rounded-lg shadow-lg overflow-hidden"
          >
            <div className="px-6 py-8">
              <h3>{plan.name}</h3>
              <h2>
                {plan.price} <span>/month</span>
              </h2>
            </div>
            <div className="flex-grow px-8 pt-6 pb-6">
                <ul>
                    {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center">
                            <span>{feature}</span>
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                <button
                onClick={() => handleSubscribe(plan.priceId)} 
                className="btn btn-primary">
                    Subscribe Now
                </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlanTest;
