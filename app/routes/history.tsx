import { fetchHistory, HistoryResult } from "../utils/history";
import HistoryList from "../components/organisms/History";
import { Navigation } from "../components/organisms/Navigation";
export type HistoryLoaderResult = {
  status: string;
  calls: HistoryResult[];
  voicemails: HistoryResult[];
};

export const loader = async (): Promise<HistoryLoaderResult> => {
  const { BASE_URL, TOKEN_ID, TOKEN, FAXLINE_ID } = process.env;
  let fetchError = false;
  const calls: HistoryResult[] = [];
  const voicemails: HistoryResult[] = [];
  const envMissing = !BASE_URL || !TOKEN_ID || !TOKEN || !FAXLINE_ID;
  try {
    const callsFetchResult = await fetchHistory({
      type: "CALL",
    });
    if (callsFetchResult?.data.items.length) {
      calls.push(...callsFetchResult.data.items);
    }
    const voicemailsFetchResult = await fetchHistory({
      type: "VOICEMAIL",
    });
    if (voicemailsFetchResult?.data.items.length) {
      voicemails.push(...voicemailsFetchResult.data.items);
    }
  } catch (error) {
    console.error(error);
    fetchError = true;
  }
  return {
    status: envMissing || fetchError ? "error" : "ok",
    calls,
    voicemails,
  };
};
export default function History() {
  return (
    <div className="flex h-full">
      <Navigation />
      <div className="bg-slate-100 h-full w-11/12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 h-full">
          <HistoryList type="VOICEMAIL" />
          <HistoryList type="CALL" />
        </div>
      </div>
    </div>
  );
}
