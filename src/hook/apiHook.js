import axios from "axios";

const useApi = () => {
  const baseUrl = import.meta.env.VITE_BASE_URL;

  const request = async ({ endpoint, method = "GET", body = null, headers = {} }) => {
    const url = `${baseUrl}${endpoint}`;
    console.log("bamboo url", endpoint);

    try {
      const config = {
        url,
        method,
        headers: {
          ...headers,
        },
      };

      // Only add Content-Type if there's a body
      if (body) {
        config.data = body;
        config.headers["Content-Type"] = "application/json";
      }

      const response = await axios(config);

      return {
        status: response.status,
        ok: true,
        data: response.data,
      };
    } catch (error) {
      const status = error.response?.status || 500;
      const message = error.response?.data?.message || error.message;

      return {
        status,
        ok: false,
        data: null,
        message,
      };
    }
  };

  return { request };
};

export default useApi;