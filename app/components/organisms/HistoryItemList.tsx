import { HistoryItem } from "../../utils/history";
import { AudioPlayer } from "../molecules/AudioPlayer";

export const HistoryItemList = ({ items }: { items: HistoryItem[] }) => {
  return items.map((item) => {
    const isItemFromToday = (item: HistoryItem) => {
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
        className="grid grid-cols-2 p-2 border-b border-gray-400 gap-1 bg-white hover:bg-green-50 h-full"
      >
        <div className="flex flex-col">
          <span
            className={`${isItemFromToday(item) ? "font-bold" : ""} font-mono`}
          >
            {new Date(item.lastModified).toLocaleString("de-DE")}
          </span>
        </div>
        <div className="flex flex-col">
          {(item.direction === "INCOMING" ||
            item.direction === "MISSED_INCOMING") && (
            <span>
              {item.source}{" "}
              {item.sourceAlias ? "(" + item.sourceAlias + ")" : ""}
            </span>
          )}
          {item.direction === "OUTGOING" && (
            <span>
              {item.targetAlias} - {item.target}
            </span>
          )}
        </div>
        {item.type === "VOICEMAIL" && item.recordingUrl && (
          <AudioPlayer src={item.recordingUrl} />
        )}
      </div>
    );
  });
};
