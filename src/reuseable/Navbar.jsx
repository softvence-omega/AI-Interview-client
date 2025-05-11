import React from "react";
import { Link, useLocation } from "react-router-dom";
import Buttons from "./AllButtons";
import img1 from "../assets/logos/inprep.png";
import Container from "../container/container";

const Navbar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

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
    <Container>
      <div className="navbar bg-transparent">
        {/* Left: Logo & Mobile Menu */}
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] w-52 rounded-box bg-base-100 p-2 shadow"
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
        <div className="navbar-end ">
          <Buttons.LinkButton
            text={authButtonText}
            to={authButtonTo}
            height="h-[44px] "
            width="w-[94px]"
          />
        </div>
      </div>
    </Container>
  );
};

export default Navbar;
