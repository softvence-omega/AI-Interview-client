import React from 'react';

const faqs = [
  {
    question: 'What is InPrep.ai?',
    answer:
      'InPrep.ai is an AI-powered interview preparation platform that simulates real interview scenarios and provides personalized feedback to help job seekers improve their performance. It supports behavioral, technical, and industry-specific interview formats.',
  },
  {
    question: 'How does InPrep.ai work?',
    answer:
      'InPrep uses advanced AI to simulate mock interviews tailored to your goals and background. After each session, it delivers instant, detailed feedback on your answers, communication, body language (if video is enabled), and overall performance to help you improve over time.',
  },
  {
    question: 'Who is InPrep.ai for?',
    answer:
      'InPrep is ideal for students, recent graduates, job switchers, professionals aiming for promotions, and anyone preparing for interviews. It’s also used by universities, bootcamps, and career development programs.',
  },
  {
    question: 'What types of interviews can I practice with InPrep.ai?',
    answer:
    (
        <>
          <p className="text-base text-gray-700">
            You can practice a wide range of interviews, including:
          </p>
          <ul className="list-disc pl-14 mt-2 text-base text-gray-700 py-2">
            <li>Behavioral interviews (e.g., STAR format)</li>
            <li>Technical interviews (coding, engineering, data science, etc.)</li>
            <li>Case interviews</li>
            <li>Industry-specific and role-based interviews (e.g., finance, marketing, consulting)</li>
          </ul>
        </>
      ),
  },
  {
    question: 'Is the feedback really personalized?',
    answer:
      'Yes. InPrep’s AI analyzes your responses in real time and provides targeted feedback on your clarity, structure, confidence, tone, and relevance. It highlights areas for improvement and offers suggestions tailored to your answers.',
  },
  {
    question: 'Do I need to schedule interviews or wait for a coach?',
    answer:
      'No. InPrep.ai is available 24/7, on demand. You can practice anytime, anywhere—no scheduling or waiting is required.',
  },
  {
    question: 'Can I use InPrep without any prior interview experience?',
    answer:
      'Absolutely! InPrep is designed to help users at all experience levels. It’s especially helpful for first-time job seekers or career changers who want to gain confidence and develop structured answers.',
  },
  {
    question: 'Is there a free trial available?',
    answer:
      'Yes, InPrep offers a limited access plan so you can explore its features before committing to a subscription.',
  },
  {
    question: 'Is my data private and secure?',
    answer:
      'Yes. InPrep.ai takes user privacy seriously. Your responses, video data (if used), and progress are stored securely and are never shared without your consent. Please refer to the Privacy Policy for full details.',
  },
  {
    question: 'Can InPrep help with specific companies or roles (like Google, Amazon, etc.)?',
    answer:
      'Yes. You can tailor your mock interview sessions based on the company or role you\'re targeting. InPrep’s question bank includes scenarios aligned with top companies and industries.',
  },
  {
    question: 'Can institutions or career coaches use InPrep.ai?',
    answer:
      'Yes. InPrep offers solutions for universities, bootcamps, and organizations. These include bulk licensing, custom dashboards, progress tracking, and branded experiences.',
  },
];

const Faq = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 text-gray-800 pt-24">
      <h1 className="text-4xl font-bold mb-12 mt-4 text-center">
        Frequently Asked Questions (FAQs)
      </h1>
      <div className="space-y-4 text-left">
        {faqs.map((faq, index) => (
          <div key={index}>
            <h2 className="text-lg font-bold">
              {index + 1}. {faq.question}
            </h2>
            <p className="mt-2 text-base leading-relaxed text-gray-700">
              {faq.answer}
            </p>
            <hr className='mt-8'/>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Faq;
