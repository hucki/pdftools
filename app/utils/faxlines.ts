import axios, { AxiosError } from "axios";

const { BASE_URL, TOKEN_ID, TOKEN, USER_ID, FAXLINE_ID } = process.env;

type FaxlineItem = {
  id: string;
  alias: string;
  tagline: string;
  canSend: boolean;
  canReceive: boolean;
};
export type FaxLinesResult = {
  data: {
    items: FaxlineItem[];
  };
};

export const fetchTagline = async () => {
  try {
    const taglineResponse = await axios(`/${USER_ID}/faxlines/`, {
      baseURL: BASE_URL,
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      auth: {
        username: TOKEN_ID || "",
        password: TOKEN || "",
      },
    });
    const tagline = taglineResponse.data.items.filter(
      (faxline: FaxlineItem) => faxline.id === FAXLINE_ID
    )[0].tagline;

    return {
      data: tagline,
    };
  } catch (error) {
    console.error("Error:", (error as AxiosError).message);
    return null;
  }
};

export const fetchCallerid = async () => {
  try {
    const calleridResponse = await axios(
      `/${USER_ID}/faxlines/${FAXLINE_ID}/callerid`,
      {
        baseURL: BASE_URL,
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        auth: {
          username: TOKEN_ID || "",
          password: TOKEN || "",
        },
      }
    );
    return {
      data: calleridResponse.data,
    };
  } catch (error) {
    console.error("Error:", (error as AxiosError).message);
    return null;
  }
};
