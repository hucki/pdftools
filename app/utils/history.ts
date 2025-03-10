import axios, { AxiosError } from "axios";

const { BASE_URL, HISTORY_TOKEN_ID, HISTORY_TOKEN } = process.env;

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
  direction?: "INCOMING" | "OUTGOING" | "MISSED_INCOMING";
  archived?: boolean;
  baseURL?: string;
  token?: string;
  tokenId?: string;
};

export type HistoryLoaderResult = {
  callsIncoming: { items: HistoryItem[] };
  callsMissed: { items: HistoryItem[] };
  callsOutgoing: { items: HistoryItem[] };
  voicemails: { items: HistoryItem[] };
};

export type HistoryLoaderProps = {
  archived: boolean;
};

export const getHistoryLoader = ({ archived = false }: HistoryLoaderProps) => {
  return async (): Promise<HistoryLoaderResult> => {
    const [callsIncoming, callsMissed, callsOutgoing, voicemails] =
      await Promise.all([
        fetchHistoryWrapper({
          type: "CALL",
          direction: "INCOMING",
          archived: archived,
        }),
        fetchHistoryWrapper({
          type: "CALL",
          direction: "MISSED_INCOMING",
          archived: archived,
        }),
        fetchHistoryWrapper({
          type: "CALL",
          direction: "OUTGOING",
          archived: archived,
        }),
        fetchHistoryWrapper({
          type: "VOICEMAIL",
          direction: "INCOMING",
          archived: archived,
        }),
      ]);

    return {
      callsIncoming,
      callsOutgoing,
      callsMissed,
      voicemails,
    };
  };
};

export const fetchHistory = async ({
  type,
  direction = "INCOMING",
  archived = false,
}: FetchHistoryProps) => {
  try {
    const historyResponse = await axios(
      `/history?types=${type}&offset=0&limit=20&archived=${archived}&directions=${direction}`,
      {
        baseURL: BASE_URL,
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        auth: {
          username: HISTORY_TOKEN_ID || "",
          password: HISTORY_TOKEN || "",
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

export const fetchHistoryWrapper = async ({
  type = "CALL",
  direction = "INCOMING",
  archived = false,
}) => {
  const fetchHeaders = new Headers();
  fetchHeaders.append("Accept", "application/json");
  fetchHeaders.append("Content-Type", "application/json");
  fetchHeaders.append(
    "Authorization",
    `Basic ${btoa(`${HISTORY_TOKEN_ID}:${HISTORY_TOKEN}`)}`
  );

  return fetch(
    `${BASE_URL}/history?types=${type}&offset=0&limit=20&archived=${archived}&directions=${direction}`,
    {
      method: "GET",
      headers: fetchHeaders,
    }
  ).then((res) => res.json());
};
