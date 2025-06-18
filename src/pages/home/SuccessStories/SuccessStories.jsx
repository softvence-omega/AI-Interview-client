import { useEffect, useState } from "react";
import Marquee from "react-fast-marquee";

const reviews = [
  {
    name: "Maren Schleifer",
    text: "This platform has transformed the way I prepare for interviews. The AI simulations are realistic and helped me improve my responses significantly.",
    image: "https://i.pravatar.cc/40?img=1",
    rating: 5,
  },
  {
    name: "Aspen Curtis",
    text: "The live video interview feature boosted my confidence and made me feel prepared for real job interviews. Highly recommend for anyone looking to sharpen their skills.",
    image: "https://i.pravatar.cc/40?img=2",
    rating: 4,
  },
  {
    name: "Corey White",
    text: "An excellent tool for practicing interview scenarios. The feedback helped me identify areas of improvement and enhanced my overall communication.",
    image: "https://i.pravatar.cc/40?img=3",
    rating: 4,
  },
  {
    name: "Maren Torff",
    text: "The AI interview platform is user-friendly and effective. It simulates real interview conditions, making my preparation much more productive.",
    image: "https://i.pravatar.cc/40?img=4",
    rating: 5,
  },
  {
    name: "Craig Vetrows",
    text: "Thanks to this platform, I was able to refine my answers and gain confidence before my actual interviews. The camera-enabled sessions are particularly helpful.",
    image: "https://i.pravatar.cc/40?img=5",
    rating: 5,
  },
  {
    name: "Allison Calzoni",
    text: "I appreciate how this platform offers a realistic and engaging interview experience. It helped me manage my nerves and improve my delivery.",
    image: "https://i.pravatar.cc/40?img=6",
    rating: 4,
  },
  {
    name: "David Harper",
    text: "This AI tool made interview preparation easy and efficient. The instant feedback was invaluable.",
    image: "https://i.pravatar.cc/40?img=7",
    rating: 5,
  },
  {
    name: "Lena Brooks",
    text: "I improved my communication skills dramatically thanks to this platform’s realistic simulations.",
    image: "https://i.pravatar.cc/40?img=8",
    rating: 5,
  },
  {
    name: "Samuel Reed",
    text: "A great way to prepare for interviews with live video practice. I feel ready for any interview now!",
    image: "https://i.pravatar.cc/40?img=9",
    rating: 4,
  },
  {
    name: "Clara Benson",
    text: "The interface is intuitive and the AI questions are very relevant to real job interviews.",
    image: "https://i.pravatar.cc/40?img=10",
    rating: 5,
  },
  {
    name: "Oliver Grant",
    text: "I highly recommend this platform for anyone wanting to practice interviews with real-time feedback.",
    image: "https://i.pravatar.cc/40?img=11",
    rating: 5,
  },
  {
    name: "Emily Scott",
    text: "The camera-enabled sessions helped me get comfortable speaking on video. It’s an amazing resource!",
    image: "https://i.pravatar.cc/40?img=12",
    rating: 5,
  },
  {
    name: "Mason King",
    text: "Practicing with AI has made a huge difference in my interview confidence and answer quality.",
    image: "https://i.pravatar.cc/40?img=13",
    rating: 4,
  },
  {
    name: "Sophia Diaz",
    text: "The detailed feedback after each interview helped me focus on my weaknesses and improve.",
    image: "https://i.pravatar.cc/40?img=14",
    rating: 5,
  },
  {
    name: "Liam Turner",
    text: "This platform is a game-changer for job seekers. The realistic AI interviews prepared me well.",
    image: "https://i.pravatar.cc/40?img=15",
    rating: 5,
  },
  {
    name: "Ava Morris",
    text: "Thanks to the video interview practice, I no longer feel nervous during real interviews.",
    image: "https://i.pravatar.cc/40?img=16",
    rating: 4,
  },
  {
    name: "Noah Mitchell",
    text: "The AI feedback helped me craft better answers and improved my overall interview skills.",
    image: "https://i.pravatar.cc/40?img=17",
    rating: 5,
  },
  {
    name: "Isabella Cox",
    text: "A very user-friendly platform that mimics real interview scenarios perfectly.",
    image: "https://i.pravatar.cc/40?img=18",
    rating: 5,
  },
  {
    name: "Ethan Rogers",
    text: "Practicing here was one of the best decisions I made. It helped me land my dream job!",
    image: "https://i.pravatar.cc/40?img=19",
    rating: 5,
  },
  {
    name: "Mia Coleman",
    text: "The AI-driven interviews provide excellent practice and boost confidence before the real thing.",
    image: "https://i.pravatar.cc/40?img=20",
    rating: 5,
  },
];

const StarRating = ({ rating }) => {
  const totalStars = 5;
  return (
    <div className="flex space-x-1 text-yellow-400 text-sm">
      {Array.from({ length: totalStars }).map((_, i) => (
        <span key={i}>
          {i < rating ? "★" : "☆"}
        </span>
      ))}
    </div>
  );
};

const TestimonialCard = ({ review }) => (
  <div className="bg-white shadow-md rounded-xl p-4 w-92 h-62 mx-2 flex-shrink-0 text-left">
    <div className="flex gap-4 items-center">
      <StarRating rating={review.rating} />
      <div className="flex items-center gap-2 text-sm mt-1">
        <span className="text-[#3A4C67]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
          >
            <path
              d="M13.93 5.78035C13.8765 5.72834 13.8339 5.66618 13.8047 5.59749C13.7755 5.5288 13.7603 5.45498 13.76 5.38035V3.80035C13.7595 3.38677 13.595 2.99027 13.3026 2.69782C13.0101 2.40537 12.6136 2.24085 12.2 2.24035H10.62C10.5454 2.24003 10.4716 2.22483 10.4029 2.19564C10.3342 2.16645 10.2721 2.12386 10.22 2.07035L9.11003 0.960351C8.8149 0.667355 8.4159 0.50293 8.00003 0.50293C7.58416 0.50293 7.18515 0.667355 6.89003 0.960351L5.78003 2.07035C5.728 2.12386 5.66583 2.16645 5.59715 2.19564C5.52847 2.22483 5.45465 2.24003 5.38003 2.24035H3.80003C3.38644 2.24085 2.98994 2.40537 2.69749 2.69782C2.40505 2.99027 2.24053 3.38677 2.24003 3.80035V5.38035C2.23973 5.45498 2.22454 5.5288 2.19535 5.59749C2.16616 5.66618 2.12355 5.72834 2.07003 5.78035L0.960026 6.89035C0.666933 7.18543 0.502441 7.58445 0.502441 8.00035C0.502441 8.41625 0.666933 8.81527 0.960026 9.11035L2.07003 10.2204C2.12355 10.2724 2.16616 10.3345 2.19535 10.4032C2.22454 10.4719 2.23973 10.5457 2.24003 10.6204V12.2004C2.24053 12.6139 2.40505 13.0104 2.69749 13.3029C2.98994 13.5953 3.38644 13.7598 3.80003 13.7604H5.38003C5.45465 13.7607 5.52847 13.7759 5.59715 13.8051C5.66583 13.8343 5.728 13.8768 5.78003 13.9304L6.89003 15.0404C7.03575 15.1862 7.20879 15.3019 7.39925 15.3808C7.58971 15.4597 7.79386 15.5004 8.00003 15.5004C8.20619 15.5004 8.41034 15.4597 8.6008 15.3808C8.79126 15.3019 8.9643 15.1862 9.11003 15.0404L10.22 13.9304C10.2721 13.8768 10.3342 13.8343 10.4029 13.8051C10.4716 13.7759 10.5454 13.7607 10.62 13.7604H12.2C12.6136 13.7598 13.0101 13.5953 13.3026 13.3029C13.595 13.0104 13.7595 12.6139 13.76 12.2004V10.6204C13.7603 10.5457 13.7755 10.4719 13.8047 10.4032C13.8339 10.3345 13.8765 10.2724 13.93 10.2204L15.04 9.11035C15.3331 8.81527 15.4976 8.41625 15.4976 8.00035C15.4976 7.58445 15.3331 7.18543 15.04 6.89035L13.93 5.78035ZM10.35 7.02035L7.69003 9.69035C7.59377 9.78044 7.46687 9.83057 7.33503 9.83057C7.20319 9.83057 7.07628 9.78044 6.98003 9.69035L5.65003 8.35035C5.55874 8.25721 5.50791 8.1318 5.50857 8.00139C5.50923 7.87097 5.56133 7.74609 5.65354 7.65387C5.74576 7.56165 5.87065 7.50955 6.00106 7.50889C6.13148 7.50823 6.25688 7.55907 6.35003 7.65035L7.33003 8.63035L9.65003 6.31035C9.74363 6.219 9.86924 6.16786 10 6.16786C10.1308 6.16786 10.2564 6.219 10.35 6.31035C10.3975 6.35648 10.4353 6.41166 10.461 6.47264C10.4868 6.53362 10.5001 6.59915 10.5001 6.66535C10.5001 6.73155 10.4868 6.79708 10.461 6.85806C10.4353 6.91904 10.3975 6.97423 10.35 7.02035Z"
              fill="#00A9E0"
            />
          </svg>
        </span>
        <span className="text-gray-500">Verified Reviewer</span>
      </div>
    </div>
    <p className="text-sm text-gray-700 mt-4">{review.text}</p>
    <div className="flex items-center mt-6">
      <img
        src={review.image}
        alt={review.name}
        className="w-8 h-8 rounded-full mr-2"
      />
      <p className="text-sm font-semibold text-black">{review.name}</p>
    </div>
  </div>
);

const SuccessStories = () => {
  const [secondSpeed, setSecondSpeed] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSecondSpeed(50); // Start scrolling after 3s
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="mt-24">
      <h1 className="text-center text-[28px] md:text-[36px] lg:text-[70px] font-semibold leading-[67.2px] bg-gradient-to-r from-[#195234] to-[#37B874] bg-clip-text text-transparent mb-12 w-[300px] md:w-[450px] lg:w-[864px] mx-auto">
        Success Stories from Our Users
      </h1>
      {/* First slider shows reviews 0-9 */}
      <div className="bg-gray-100 py-10">
        <Marquee gradient={false} speed={50}>
          {reviews.slice(0, 10).map((review, index) => (
            <TestimonialCard key={index} review={review} />
          ))}
        </Marquee>
      </div>

      {/* Second slider shows reviews 10-19 */}
      <div className="bg-gray-100 pb-10">
        <Marquee gradient={false} speed={secondSpeed}>
          {reviews.slice(8, 20).map((review, index) => (
            <TestimonialCard key={index + 10} review={review} />
          ))}
        </Marquee>
      </div>
    </div>
  );
};

export default SuccessStories;
