import axios, { AxiosError } from "axios";

const { BASE_URL, TOKEN_ID, TOKEN } = process.env;

export type HistoryItemType = "CALL" | "VOICEMAIL" | "SMS" | "FAX";

export type HistoryItem = {
  id: string;
  source: string;
  target: string;
  sourceAlias: string;
  targetAlias: string;
  type: HistoryItemType;
  created: string;
  lastModified: string;
  direction: "INCOMING" | "OUTGOING" | "MISSED_INCOMING";
  incoming: boolean;
  status: string;
  connectionIds: string[];
  read: boolean;
  archived: boolean;
  note: string | null;
  endpoints: {
    type: string;
    endpoint: {
      extension: string;
      type: string;
    };
  }[];
  starred: boolean;
  labels: string[];
  faxStatusType?: string;
  documentUrl?: string;
  reportUrl?: string;
  previewUrl?: string;
  pageCount?: number;
  transcription?: string;
  recordingUrl?: string;
  duration?: number;
};

export type FaxHistoryItem = {
  id: string;
  source: string;
  target: string;
  sourceAlias: string;
  targetAlias: string;
  type: "FAX";
  created: string;
  lastModified: string;
  direction: "INCOMING" | "OUTGOING";
  incoming: boolean;
  status: string;
  connectionIds: string[];
  read: boolean;
  archived: boolean;
  note: string | null;
  endpoints: {
    type: string;
    endpoint: {
      extension: string;
      type: string;
    };
  }[];
  starred: boolean;
  labels: string[];
  faxStatusType: string;
  documentUrl: string;
  reportUrl: string;
  previewUrl: string;
  pageCount: number;
};

export type HistoryResult = {
  data: {
    items: HistoryItem[];
  };
};
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
