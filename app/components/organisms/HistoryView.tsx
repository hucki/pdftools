import { HistoryItem } from "../../utils/history";
import HistoryItemListContainer from "./HistoryItemListContainer";

interface HistoryViewProps {
  callsIncoming: { items: HistoryItem[] };
  callsMissed: { items: HistoryItem[] };
  callsOutgoing: { items: HistoryItem[] };
  voicemails: { items: HistoryItem[] };
  isArchive?: boolean;
}
export const HistoryView = ({
  callsIncoming,
  callsMissed,
  callsOutgoing,
  voicemails,
  isArchive = false,
}: HistoryViewProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 h-full p-2 overflow-y-auto">
      <HistoryItemListContainer
        items={voicemails.items}
        isArchive={isArchive}
        type="VOICEMAIL"
        direction="INCOMING"
        className="md:row-span-2"
      />
      <HistoryItemListContainer
        items={callsMissed.items}
        isArchive={isArchive}
        type="CALL"
        direction="MISSED_INCOMING"
        className="md:row-span-2"
      />
      <HistoryItemListContainer
        items={callsIncoming.items}
        isArchive={isArchive}
        type="CALL"
        direction="INCOMING"
      />
      <HistoryItemListContainer
        items={callsOutgoing.items}
        isArchive={isArchive}
        type="CALL"
        direction="OUTGOING"
      />
    </div>
  );
};
