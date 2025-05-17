import team1 from '../../../assets/team/1.png'
import team2 from '../../../assets/team/2.png'
import team3 from '../../../assets/team/3.png'
import team4 from '../../../assets/team/4.png'
import team5 from '../../../assets/team/5.png'
import team6 from '../../../assets/team/6.png'
import team7 from '../../../assets/team/7.png'
import team8 from '../../../assets/team/8.png'
import lin from '../../../assets/team/in.svg'
import x from '../../../assets/team/x.svg'
import ins from '../../../assets/team/ins.svg'

const teamMembers = [
    {
      name: "Darlene Robertson",
      position: "Front Desk Manager",
      image: team1,
      social_links: {
        linkedin: "linkedin_url_1",
        twitter: "twitter_url_1",
        facebook: "facebook_url_1"
      }
    },
    {
      name: "Darlene Robertson",
      position: "Front Desk Manager",
      image: team2,
      social_links: {
        linkedin: "https://www.linkedin.com/",
        twitter: "https://www.x.com/",
        facebook: "https://www.instagram.com/"
      }
    },
    {
      name: "Darlene Robertson",
      position: "Front Desk Manager",
      image: team3,
      social_links: {
        linkedin: "https://www.linkedin.com/",
        twitter: "https://www.x.com/",
        facebook: "https://www.instagram.com/"
      }
    },
    {
      name: "Darlene Robertson",
      position: "Front Desk Manager",
      image: team4,
      social_links: {
        linkedin: "https://www.linkedin.com/",
        twitter: "https://www.x.com/",
        facebook: "https://www.instagram.com/"
      }
    },
    {
      name: "Darlene Robertson",
      position: "Front Desk Manager",
      image: team5,
      social_links: {
        linkedin: "https://www.linkedin.com/",
        twitter: "https://www.x.com/",
        facebook: "https://www.instagram.com/"
      }
    },
    {
      name: "Darlene Robertson",
      position: "Front Desk Manager",
      image: team6,
      social_links: {
        linkedin: "https://www.linkedin.com/",
        twitter: "https://www.x.com/",
        facebook: "https://www.instagram.com/"
      }
    },
    {
      name: "Darlene Robertson",
      position: "Front Desk Manager",
      image: team7,
      social_links: {
        linkedin: "https://www.linkedin.com/",
        twitter: "https://www.x.com/",
        facebook: "https://www.instagram.com/"
      }
    },
    {
      name: "Darlene Robertson",
      position: "Front Desk Manager",
      image: team8,
      social_links: {
        linkedin: "https://www.linkedin.com/",
        twitter: "https://www.x.com/",
        facebook: "https://www.instagram.com/"
      }
    }
  ];

const OurTeam = () => {
  return (
    <div className="max-w-7xl mx-auto pt-12 md:pt-20 lg:pt-24">
      <h1
        className="text-center text-[26px] md:text-[32px] lg:text-[40px] font-semibold leading-[67.2px] mb-4 mx-auto mt-20"
        style={{
          background: "linear-gradient(90deg, #195234 0.24%, #37B874 85.86%)",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Our Team
      </h1>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 p-2 text-center justify-items-center items-center">
      {teamMembers.map((member, index) => (
        <div key={index} className="p-2 text-center">
          <img
            src={member.image}
            alt={member.name}
            className="w-full h-56 object-cover rounded-md"
          />
          <h2 className="mt-4 text-xl font-semibold text-[#212121]">{member.name}</h2>
          <h3 className="text-[#676768]">{member.position}</h3>
          <div className="flex space-x-4 mt-4 justify-center items-center text-center mx-auto">
            <a href={member.social_links.linkedin} target="_blank" rel="noopener noreferrer">
              <img src={lin} alt="LinkedIn" className="w-6 h-6" />
            </a>
            <a href={member.social_links.twitter} target="_blank" rel="noopener noreferrer">
              <img src={ins} alt="Twitter" className="w-7 h-7" />
            </a>
            <a href={member.social_links.facebook} target="_blank" rel="noopener noreferrer">
              <img src={x} alt="Facebook" className="w-6 h-6" />
            </a>
          </div>
        </div>
      ))}
    </div>

      <div>
        <div>
            <img src="" alt="" />
            <h2></h2>
            <h3></h3>
            <div>
                <img src="" alt="" />
                <img src="" alt="" />
                <img src="" alt="" />
            </div>
        </div>
      </div>
    </div>
  );
};

export default OurTeam;
