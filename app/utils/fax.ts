import axios, { AxiosError } from "axios";

const { BASE_URL, TOKEN_ID, TOKEN, FAXLINE_ID } = process.env;

/**
 *
 * @param {string} recipient
 * @param {string} filePath
 */
export const sendFax = async (
  recipient: string,
  base64Content: string,
  fileName: string
) => {
  const data = {
    faxlineId: FAXLINE_ID,
    recipient,
    filename: fileName,
    base64Content,
  };

  const requestOptions = {
    baseURL: BASE_URL,
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    auth: {
      username: TOKEN_ID || "",
      password: TOKEN || "",
    },
    data,
  };

  try {
    // const sendFaxResponse = await axios(`/sessions/fax`, requestOptions);
    console.log({ r: requestOptions.baseURL });
    return { data: { sessionId: "123456" } }; //sendFaxResponse;
  } catch (error) {
    console.error("Error:", (error as AxiosError).message);
    return null;
  }
};

export const fetchFaxStatus = async (sessionId: string) => {
  try {
    const historyResponse = await axios(`/history/${sessionId}`, {
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
    return {
      faxStatusType: historyResponse.data.faxStatusType,
    };
  } catch (error) {
    console.error("Error:", (error as AxiosError).message);
    return null;
  }
};
