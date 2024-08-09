import { FaxHistoryItem } from "../../utils/history";

type FaxStatusType = "FAILED" | "SENT" | "SENDING" | "PENDING";
type FaxStatusItem = {
  text: string;
  color: string;
};
type FaxStatus = {
  [key in FaxStatusType]: FaxStatusItem;
};
const faxStatus: FaxStatus = {
  FAILED: {
    text: "❌ fehlgeschlagen",
    color: "text-red-500",
  },
  SENT: {
    text: "🟩 gesendet",
    color: "text-green-500",
  },
  SENDING: {
    text: "🟧 wird gesendet",
    color: "text-orange-500",
  },
  PENDING: {
    text: "🟦 wartet",
    color: "text-blue-500",
  },
};

export const FaxHistoryItemList = ({ items }: { items: FaxHistoryItem[] }) => {
  return items.map((item) => {
    const faxStatusType = item.faxStatusType as FaxStatusType | undefined;
    const faxStatusText = faxStatusType ? faxStatus[faxStatusType].text : "";
    const faxStatusColor = faxStatusType ? faxStatus[faxStatusType].color : "";
    const isItemFromToday = (item: FaxHistoryItem) => {
      const today = new Date();
      const itemDate = new Date(item.lastModified);
      return (
        today.getDate() === itemDate.getDate() &&
        today.getMonth() === itemDate.getMonth() &&
        today.getFullYear() === itemDate.getFullYear()
      );
    };
    return (
      <div
        key={item.id}
        className="grid grid-cols-3 p-2 border-b border-gray-400 gap-2"
      >
        <div className="flex flex-col">
          <span
            className={`${isItemFromToday(item) ? "font-bold" : ""} font-mono`}
          >
            {new Date(item.lastModified).toLocaleString("de-DE")}
          </span>
          <span className={`font-bold ${faxStatusColor}`}>{faxStatusText}</span>
        </div>
        <div className="flex flex-col">
          {item.direction === "INCOMING" && (
            <span>
              {item.sourceAlias} - {item.source}
            </span>
          )}
          {item.direction === "OUTGOING" && (
            <span>
              {item.targetAlias} - {item.target}
            </span>
          )}
        </div>

        {item.direction === "INCOMING" && (
          <a
            href={item.documentUrl}
            target="_blank"
            rel="noreferrer"
            className="text-blue-500"
          >
            Fax
          </a>
        )}
        {item.direction === "OUTGOING" && (
          <a
            href={item.reportUrl}
            target="_blank"
            rel="noreferrer"
            className="text-blue-500"
          >
            Sendebericht
          </a>
        )}
      </div>
    );
  });
};
