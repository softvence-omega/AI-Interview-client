import axios from "axios";

const useApi = () => {
  const baseUrl = import.meta.env.VITE_BASE_URL;

  const request = async ({ endpoint, method = "GET", body = null, headers = {} }) => {
    const url = `${baseUrl}${endpoint}`;
    console.log("🔗 API URL:", url);

    try {
      const isFormData = body instanceof FormData;

      const config = {
        url,
        method,
        headers: {
          ...headers,
        },
        data: body,
      };

      // ❗️Only add Content-Type if NOT FormData
      if (body && !isFormData) {
        config.headers["Content-Type"] = "application/json";
        config.data = JSON.stringify(body);
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
      const errorData = error.response?.data;

      return {
        status,
        ok: false,
        data: errorData,
        message,
      };
    }
  };

  return { request };
};

export default useApi;
