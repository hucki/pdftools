import {
  ArchiveBoxIcon,
  DocumentCheckIcon,
  StarIcon,
} from "@heroicons/react/16/solid";
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
        {item.note && (
          <span className="text-xs text-gray-500 ml-2">{item.note}</span>
        )}
        {item.type === "VOICEMAIL" && item.recordingUrl && (
          <AudioPlayer src={item.recordingUrl} />
        )}
        <div className="flex items-center">
          <DocumentCheckIcon
            title={item.read === true ? "Gelesen" : "Ungelesen"}
            aria-label={item.read === true ? "Gelesen" : "Ungelesen"}
            className={`h-5 w-5 ${
              item.read === true ? "text-green-600" : "text-gray-500"
            }`}
          />

          <ArchiveBoxIcon
            title={item.archived === true ? "Archiviert" : "Nicht archiviert"}
            aria-label={
              item.archived === true ? "Archiviert" : "Nicht archiviert"
            }
            className={`h-5 w-5 ${
              item.archived === true ? "text-amber-800" : "text-gray-500"
            }`}
          />
          <StarIcon
            title={item.starred === true ? "Favorit" : "Nicht Favorit"}
            aria-label={item.starred === true ? "Favorit" : "Nicht Favorit"}
            className={`h-5 w-5 ${
              item.starred === true ? "text-yellow-400" : "text-gray-500"
            }`}
          />
        </div>
      </div>
    );
  });
};
