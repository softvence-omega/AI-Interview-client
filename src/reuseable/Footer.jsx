import React from "react";
import footerLogo from "../assets/footer-logo.png";
import Buttons from "./AllButtons";

const Footer = () => {
  return (
    <div className="max-w-full mx-auto">
      <footer className="footer md:justify-items-center lg:justify-items-center sm:footer-horizontal bg-[rgb(24,32,43)] text-base-content p-10">
        <aside>
          <img src={footerLogo} alt="" />
          <p className="text-[#FFFFFF] leading-[150%] font-normal text-[14px] mt-2">
          AI-powered interview preparation platform. <br /> Practice with real-time simulations, test your skills, and <br /> develop your skills and build confidence <br /> through live video interviews.
          </p>
          <div className="flex gap-2 justify-items-center mt-8">
            <input
              type="text"
              placeholder="Enter your email"
              className="input input-bordered rounded-xl bg-white text-[#666666] w-full"
            />
            <Buttons.SubmitButton
              text="Subscribe"
              height="h-[40px]"
              width="w-[65%]"
              rounded="rounded-[12px]"
            />
          </div>
        </aside>
        <nav>
          <h6 className="text-[16px] text-[#37B874] font-medium leading-[130%] mb-5">
            Quick Links
          </h6>
          <a href="/" className="link link-hover text-[#E0E0E1] text-[14px] font-medium leading-[130%]">Home</a>
          <a href="/features" className="link link-hover text-[#E0E0E1] text-[14px] font-medium leading-[130%]">Features</a>
          <a href="pricing" className="link link-hover text-[#E0E0E1] text-[14px] font-medium leading-[130%]">Pricing</a>
          {/* <a href="About-Us" className="link link-hover text-[#E0E0E1] text-[14px] font-medium leading-[130%]">About Us</a> */}
          <a href="/features#feature" className="link link-hover text-[#E0E0E1] text-[14px] font-medium leading-[130%]">Blog</a>
          <a href="Contact-Us" className="link link-hover text-[#E0E0E1] text-[14px] font-medium leading-[130%]">Contact Us</a>
        </nav>
        <nav>
          <h6 className="text-[16px] text-[#37B874] font-medium leading-[130%] mb-5">
            Legal & Support
          </h6>
          <a href="/privacy-policy" className="link link-hover text-[#E0E0E1] text-[14px] font-medium leading-[130%]">Privacy Policy</a>
          <a href="/terms-and-conditions" className="link link-hover text-[#E0E0E1] text-[14px] font-medium leading-[130%]">Terms of Service</a>
          <a href="/Contact-Us" className="link link-hover text-[#E0E0E1] text-[14px] font-medium leading-[130%]">Help Center</a>
        </nav>
        <nav>
          <h6 className="text-[16px] text-[#37B874] font-medium leading-[130%] mb-5">
            Contact Info
          </h6>
          <a className="link link-hover text-[#E0E0E1] text-[14px] font-medium leading-[130%]">Phone: +123 456 7890</a>
          <a className="link link-hover text-[#E0E0E1] text-[14px] font-medium leading-[130%]">Email: info@inprepai.com</a>
          <a className="link link-hover text-[#E0E0E1] text-[14px] font-medium leading-[130%]">Address: 123 Main Street, <br/>Your City, Your Country</a>
        </nav>
      </footer>
    </div>
  );
};

export default Footer;
