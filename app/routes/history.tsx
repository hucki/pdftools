import { fetchHistory, HistoryResult } from "../utils/history";
import HistoryList from "../components/organisms/History";
import { Link } from "../components/atoms/Link";
export type HistoryLoaderResult = {
  calls: HistoryResult[];
  voicemails: HistoryResult[];
};

export const loader = async (): Promise<HistoryLoaderResult> => {
  const calls: HistoryResult[] = [];
  const voicemails: HistoryResult[] = [];
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
  }
  return {
    calls,
    voicemails,
  };
};
export default function History() {
  return (
    <div>
      <Link to="/fax/composer/client">📠 zum Fax</Link>
      <div className="grid grid-cols-1 md:grid-cols-2">
        <HistoryList type="VOICEMAIL" />
        <HistoryList type="CALL" />
      </div>
    </div>
  );
}
