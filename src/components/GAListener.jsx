import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import ReactGA from "react-ga4";

const GAListener = () => {
  const location = useLocation();

  useEffect(() => {
    ReactGA.initialize(import.meta.env.VITE_MEASUREMENT_ID);
  }, []); // initialize only once

  useEffect(() => {
    ReactGA.send({
      hitType: "pageview",
      page: location.pathname + location.search,
    });
  }, [location]); // send pageview on each route change

  return null;
};

export default GAListener;
