import { useContext } from "react";
import { LandingPageContext } from "../context/LandingPageContext";

const useLandingPage = () => {
  return useContext(LandingPageContext);
};

export default useLandingPage;
