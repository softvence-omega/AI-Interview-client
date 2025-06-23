import React, { useEffect, useState } from "react";
import { Link, useNavigate} from "react-router-dom";
import { throttle } from "lodash";
import Buttons from "./AllButtons";
// import img1 from "../assets/logos/inprep.png";
import { TiThMenu } from "react-icons/ti";
import { useAuth } from "../context/AuthProvider";
import axios from "axios";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  // const location = useLocation();
  // const currentPath = location.pathname;
  const [scrolled, setScrolled] = useState(false);
  const [websiteData, setWebsiteData] = useState(null);

  useEffect(() => {
    const handleScroll = throttle(() => {
      setScrolled(window.scrollY > 50);
    }, 100);

    // Check initial scroll position
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const middleMenuOptions = [
    { name: "Home", to: "/" },
    { name: "Features", to: "/features" },
    { name: "Pricing", to: "/pricing" },
    // { name: "About US", to: "/About-US" },
    { name: "Contact Us", to: "/Contact-Us" },


    ...(user?.userData?.role === 'user'
      ? [{ name: "Dashboard", to: "/userDashboard/mockInterview" }]
      : user?.userData?.role === 'admin'
      ? [{ name: "Dashboard", to: "/userDashboard/dashboard" }]
      : []),
  ];

  // let authButtonText = "Log In";
  // let authButtonTo = "/login";

  // if (currentPath === "/login") {
  //   authButtonText = "Sign Up";
  //   authButtonTo = "/signup";
  // } else if (currentPath === "/signup") {
  //   authButtonText = "Log In";
  //   authButtonTo = "/login";
  // }

  // Logout handler
  const handleLogout = () => {
    logout();
    navigate("/login");
    window.location.href = "/login"
  }

  useEffect(() => {
    const handleScroll = throttle(() => {
      setScrolled(window.scrollY > 50);
    }, 100);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  useEffect(() => {
    const fetchWebsiteData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/website/get-website`);
        setWebsiteData(response.data?.data); // adjust based on actual response shape
      } catch (error) {
        console.error("Error fetching website data:", error);
      }
    };
  
    fetchWebsiteData();
  }, []);
  

  return (
    <div className="fixed top-0 left-0 w-full z-[1000]">
      <div
        className={`max-w-screen mx-auto backdrop-blur-md bg-black/10  ${
          scrolled
            ? "bg-emerald-500 shadow-md transition-all duration-150"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-[1440px] mx-auto lg:px-12 md:px-12 px-6 py-3 flex items-center justify-between">
          {/* Left: Logo & Mobile Menu */}
          <div className="navbar-start">
            <div className="dropdown">
              <div
                tabIndex={0}
                role="button"
                className="text-[#37B874] border-none lg:hidden rounded-xl"
              >
                <TiThMenu className={`h-8 w-8 mx-2 ${scrolled ? "text-white" : "text-none"}`} />
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content mt-3 z-[1001] w-52 rounded-box bg-white p-2 shadow"
              >
                {middleMenuOptions.map((item, index) => (
                  <li key={index}>
                    <Buttons.NormalLinkButton text={item.name} to={item.to} />
                  </li>
                ))}
              </ul>
            </div>
            {/* <Link to="/">
              <img src={img1} alt="logo" className="h-[40px] w-[118px]" />
            </Link> */}
            <Link to="/">
              <img src={websiteData?.logoUrl} alt="logo" className="h-[40px] w-[118px]" />
            </Link>
          </div>

          {/* Middle: Desktop Menu */}
          <div className="navbar-center hidden lg:flex">
            <ul className="menu menu-horizontal gap-4 px-1">
              {middleMenuOptions.map((item, index) => (
                <li key={index}>
                  <Buttons.NormalLinkButton
                    text={item.name}
                    to={item.to}
                    textColor={
                      scrolled
                        ? "text-white text-[#676768]"
                        : "text-[#676768]"
                    }
                  />
                </li>
              ))}
            </ul>
          </div>

          {/* Right: Auth Button */}
          <div className="navbar-end">
            {
              user ? <Buttons.OnClickButton
              text="Log Out"
              onClick={handleLogout}
              height="h-[44px]"
              width="w-[94px]"
              textColor={
                scrolled
                  ? "text-[#37B874] bg-white"
                  : "text-[#FFF]"
              }
            /> : <div className="flex justify-items-center items-center gap-4">
              <Buttons.LinkButton
            text="Log In"
            to="/login"
            height="h-[44px]"
            width="w-[94px]"
            textColor={
              scrolled
                ? "text-[#37B874] bg-white"
                : "text-[#FFF]"
            }
          />
          <Buttons.LinkButton
            text="Sign Up"
            to="/signup"
            height="h-[44px]"
            width="w-[94px]"
            textColor={
              scrolled
                ? "text-[#37B874] bg-white"
                : "text-[#FFF]"
            }
          />
            </div>
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
