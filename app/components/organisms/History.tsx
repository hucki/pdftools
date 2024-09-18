import { useRouteLoaderData } from "@remix-run/react";
import { HistoryItem, HistoryItemType } from "../../utils/history";
import { HistoryItemList } from "./HistoryItemList";
import { HistoryLoaderResult } from "../../routes/history";

export default function HistoryList({ type }: { type: HistoryItemType }) {
  const loaderData = useRouteLoaderData<HistoryLoaderResult>("routes/history");
  const calls = loaderData?.calls
    ? (loaderData?.calls as unknown as HistoryItem[])
        .filter((item) => item.type === type)
        .sort(
          (a, b) =>
            new Date(b.lastModified).getTime() -
            new Date(a.lastModified).getTime()
        )
    : [];
  const voicemails = loaderData?.voicemails
    ? (loaderData?.voicemails as unknown as HistoryItem[])
        .filter((item) => item.type === type)
        .sort(
          (a, b) =>
            new Date(b.lastModified).getTime() -
            new Date(a.lastModified).getTime()
        )
    : [];

  const historyItems = type === "CALL" ? calls : voicemails;
  if (!historyItems?.length) {
    return <div>No history items found</div>;
  }
  const typeLabel =
    type === "CALL" ? "Anruf" : type === "VOICEMAIL" ? "VOICEMAIL" : "Fax";

  return (
    <div className="p-4 m-4 bg-slate-100 border border-dashed border-spacing-1 ">
      {type !== "VOICEMAIL" && (
        <>
          <h2 className="text-xl font-bold mt-4">❌ {typeLabel} verpasst</h2>
          <div className="flex flex-col text-xs">
            <HistoryItemList
              items={historyItems.filter(
                (item) => item.direction === "MISSED_INCOMING"
              )}
            />
          </div>
        </>
      )}
      <h2 className="text-xl font-bold mt-4">{typeLabel} Eingang</h2>
      <div className="flex flex-col text-xs">
        <HistoryItemList
          items={historyItems.filter((item) => item.direction === "INCOMING")}
        />
      </div>
      {type !== "VOICEMAIL" && (
        <>
          <h2 className="text-xl font-bold mt-4">{typeLabel} Ausgang</h2>
          <div className="flex flex-col text-xs">
            <HistoryItemList
              items={historyItems.filter(
                (item) => item.direction === "OUTGOING"
              )}
            />
          </div>
        </>
      )}
    </div>
  );
}
