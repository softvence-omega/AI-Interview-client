import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const LandingPageContext = createContext();

export const LandingPageProvider = ({ children }) => {
  const [landingData, setLandingData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLandingData = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/landingPage/landingpagedata`);
        setLandingData(res.data.data[0]);
      } catch (err) {
        console.error("Landing data fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLandingData();
  }, []);

  return (
    <LandingPageContext.Provider value={{ landingData, loading }}>
      {children}
    </LandingPageContext.Provider>
  );
};
