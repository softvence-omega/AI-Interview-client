import "./Accordian.css";

const Accordian = () => {
  const questions = [
    {
      title: "What is Inprep.ai?",
      content:
        "Lorem ipsum dolor sit amet consectetur. Ipsum facilisi orci amet id dignissim. A quis turpis fringilla libero maecenas elementum morbi. Orci tristique venenatis penatibus vitae blandit aliquam.",
    },
    {
      title: "How can I upgrade my subscription?",
      content: "You can upgrade your subscription in the account settings.",
    },
    {
      title: "How much does Inprep.ai cost?",
      content: "Inprep.ai offers both free and premium plans.",
    },
    {
      title: "How many mock interviews can I take?",
      content: "It depends on your current plan. Free users get one.",
    },
    {
      title: "How does job tracking work?",
      content: "Job tracking allows you to monitor your applications.",
    },
    {
      title: "What should I do if I can't access my account?",
      content: "Use the password reset or contact support.",
    },
  ];

  return (
    <div className="mx-4">
      <div className="max-w-xl md:max-w-3xl lg:max-w-5xl mx-auto bg-white mt-24 py-8 rounded-xl shadow-lg">
        <div className="max-w-4xl mx-auto p-8">
          {questions.map((q, idx) => (
            <div
              key={idx}
              className="collapse collapse-plus bg-white text-[#212121] rounded-box mb-2 text-left"
            >
              <input
                type="checkbox"
                className="peer"
                defaultChecked={idx === 0}
              />
              <h4 className="collapse-title text-md font-semibold transition-colors peer-checked:text-[#3A4C67] peer-checked:[&::after]:text-[#37B874] text-[18px]">
                {q.title}
              </h4>
              <div className="collapse-content">
                <p className="text-normal text-[#878788] peer-checked:text-[#878788] text-[15px]">
                  {q.content}
                </p>
              </div>
              <hr className="text-[#D9DBE9] w-[95%] mx-auto" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Accordian;
