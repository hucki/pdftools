import {
  DocumentCheckIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/16/solid";
import { FaxHistoryItem } from "../../utils/history";

type FaxStatusType = "FAILED" | "SENT" | "SENDING" | "PENDING";
type FaxStatusItem = {
  text: string;
  color: string;
  icon: JSX.Element;
};
type FaxStatus = {
  [key in FaxStatusType]: FaxStatusItem;
};
const faxStatus: FaxStatus = {
  FAILED: {
    text: " fehlgeschlagen",
    color: "text-red-500",
    icon: (
      <ExclamationTriangleIcon
        className="h-4 w-4 text-red-500"
        aria-hidden="true"
      />
    ),
  },
  SENT: {
    text: " gesendet",
    color: "text-green-500",
    icon: (
      <DocumentCheckIcon
        className="h-4 w-4 text-green-500"
        aria-hidden="true"
      />
    ),
  },
  SENDING: {
    text: " wird gesendet",
    color: "text-orange-500",
    icon: (
      <PaperAirplaneIcon
        className="h-4 w-4 text-orange-500"
        aria-hidden="true"
      />
    ),
  },
  PENDING: {
    text: " wartet",
    color: "text-blue-500",
    icon: (
      <ExclamationCircleIcon
        className="h-4 w-4 text-blue-500"
        aria-hidden="true"
      />
    ),
  },
};

export const FaxHistoryItemList = ({ items }: { items: FaxHistoryItem[] }) => {
  return items.map((item) => {
    const faxStatusType = item.faxStatusType as FaxStatusType | undefined;
    const faxStatusText = faxStatusType ? faxStatus[faxStatusType].text : "";
    const faxStatusColor = faxStatusType ? faxStatus[faxStatusType].color : "";
    const faxStatusIcon = faxStatusType ? faxStatus[faxStatusType].icon : null;
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
        className="grid grid-cols-3 p-2 border-b border-gray-200 gap-2 hover:bg-green-50"
      >
        <div className="flex flex-col">
          <span
            className={`${isItemFromToday(item) ? "font-bold" : ""} font-mono`}
          >
            {new Date(item.lastModified).toLocaleString("de-DE")}
          </span>
          <span
            className={`font-bold grid grid-cols-[1fr_3fr] items-center ${faxStatusColor}`}
          >
            {faxStatusIcon}
            {faxStatusText}
          </span>
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
