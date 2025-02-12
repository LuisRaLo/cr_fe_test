import axios from "axios";

// Helper para hacer la petición HTTP
export const postRequest = async (url: string, data: object, jwt?: string) => {
  try {
    const headers: { "Content-Type": string; Authorization?: string } = {
      "Content-Type": "application/json",
    };

    if (jwt) {
      headers.Authorization = `Bearer ${jwt}`;
    }

    const response = await axios.post(url, data, {
      headers,
      validateStatus: (status: number) => status >= 200 && status < 500,
    });
    return response;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new Error(error.response?.data?.resultado || "An error occurred");
  }
};

export const getRequest = async (url: string, jwt: string) => {
  try {
    const headers: { "Content-Type": string; Authorization?: string } = {
      "Content-Type": "application/json",
    };
    if (jwt) {
      headers.Authorization = `Bearer ${jwt}`;
    }

    const response = await axios.get(url, {
      headers,
      validateStatus: (status: number) => status >= 200 && status < 500,
    });
    return response;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new Error(error.response?.data?.resultado || "An error occurred");
  }
};
