import { FaxHistoryItem } from "../../utils/history";

export const FaxHistoryItemList = ({ items }: { items: FaxHistoryItem[] }) => {
  return items.map((item) => {
    const faxStatus =
      item.faxStatusType === "FAILED"
        ? "❌ fehlgeschlagen"
        : item.faxStatusType === "SENT"
        ? "🟩 gesendet"
        : item.faxStatusType;
    const faxStatusColor =
      item.faxStatusType === "FAILED"
        ? "text-red-500"
        : item.faxStatusType === "SENT"
        ? "text-green-500"
        : "text-gray-500";
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
          <span className={`font-bold ${faxStatusColor}`}>{faxStatus}</span>
        </div>
        <div className="flex flex-col">
          <span>{item.sourceAlias}</span>
          <span>
            {item.targetAlias} - {item.target}
          </span>
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
