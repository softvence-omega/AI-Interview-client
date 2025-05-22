import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { throttle } from "lodash";
import Buttons from "./AllButtons";
import img1 from "../assets/logos/inprep.png";
import Container from "../container/container";
import { TiThMenu } from "react-icons/ti";

const Navbar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [scrolled, setScrolled] = useState(false);

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
    { name: "About US", to: "/About-US" },
    { name: "Contact Us", to: "/Contact-Us" },
  ];

  let authButtonText = "Log In";
  let authButtonTo = "/login";

  if (currentPath === "/login") {
    authButtonText = "Sign Up";
    authButtonTo = "/signup";
  } else if (currentPath === "/signup") {
    authButtonText = "Log In";
    authButtonTo = "/login";
  }

  return (
    <div className="fixed top-0 left-0 w-full z-[1000]">
      <Container>
        <div
          className={`max-w-screen mx-auto backdrop-blur-md bg-black/10 lg:px-12 md:px-12 px-6 py-3 flex items-center justify-between ${
            scrolled ? "bg-nav-color shadow-md transition-all duration-150" : "bg-transparent"
          }`}
        >
          {/* Left: Logo & Mobile Menu */}
          <div className="navbar-start">
            <div className="dropdown">
              <div tabIndex={0} role="button" className="text-[#37B874] border-none lg:hidden rounded-xl">
                <TiThMenu className="h-8 w-8 mx-2" />
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
            <Link to="/">
              <img src={img1} alt="logo" className="h-[40px] w-[118px]" />
            </Link>
          </div>

          {/* Middle: Desktop Menu */}
          <div className="navbar-center hidden lg:flex">
            <ul className="menu menu-horizontal gap-4 px-1">
              {middleMenuOptions.map((item, index) => (
                <li key={index}>
                  <Buttons.NormalLinkButton text={item.name} to={item.to} />
                </li>
              ))}
            </ul>
          </div>

          {/* Right: Auth Button */}
          <div className="navbar-end">
            <Buttons.LinkButton
              text={authButtonText}
              to={authButtonTo}
              height="h-[44px]"
              width="w-[94px]"
            />
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Navbar;