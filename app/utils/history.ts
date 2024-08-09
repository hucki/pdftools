import axios, { AxiosError } from "axios";

const { BASE_URL, TOKEN_ID, TOKEN } = process.env;

const exampleFaxHistoryItem = {
  id: "5017301277",
  source: "+49234567890",
  target: "+49234567890",
  sourceAlias: "",
  targetAlias: "",
  type: "FAX",
  created: "2024-07-31T05:34:09Z",
  lastModified: "2024-07-31T05:34:10Z",
  direction: "OUTGOING",
  incoming: false,
  status: "PICKUP",
  connectionIds: ["xx"],
  read: false,
  archived: false,
  note: "",
  endpoints: [
    {
      type: "ROUTED",
      endpoint: {
        extension: "xx",
        type: "FAX",
      },
    },
  ],
  starred: false,
  labels: [],
  faxStatusType: "FAILED",
  documentUrl: "#",
  reportUrl: "#",
  previewUrl: "#",
  pageCount: 3,
};

export type FaxHistoryItem = typeof exampleFaxHistoryItem;
export type FaxHistoryResult = {
  data: {
    items: FaxHistoryItem[];
  };
};

type FetchHistoryProps = {
  type: "CALL" | "VOICEMAIL" | "SMS" | "FAX";
  baseURL?: string;
  token?: string;
  tokenId?: string;
};

export const fetchHistory = async ({ type }: FetchHistoryProps) => {
  try {
    const historyResponse = await axios(
      `/history?types=${type}&offset=0&limit=20&archived=false`,
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
      data: historyResponse.data,
    };
  } catch (error) {
    console.error("Error:", (error as AxiosError).message);
    return null;
  }
};
