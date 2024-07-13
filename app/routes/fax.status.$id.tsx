import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import axios, { AxiosError } from "axios";

/**
 * TODO: activate status page
 * example fax status id 5017206872 for testing
 */

const { BASE_URL, TOKEN_ID, TOKEN } = process.env;

const fetchFaxStatus = async (sessionId: string) => {
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

export const loader = async ({ params }: LoaderFunctionArgs) => {
  if (!params.id) {
    return "Fax ID not provided";
    // return new Response("Fax ID not found", {
    //   status: 404,
    // });
  }
  const faxStatus = await fetchFaxStatus(params.id);
  if (!faxStatus) {
    return "Fax status not found";
    // return new Response("Fax status not found", {
    //   status: 404,
    // });
  } else {
    console.log({ faxStatus });
    return json(faxStatus);
    return new Response("Yeah", {
      status: 200,
    });
  }
};

const FaxStatusId = () => {
  const faxStatusType = useLoaderData<string>();
  return <div>{JSON.stringify(faxStatusType)}</div>;
};

export default FaxStatusId;
