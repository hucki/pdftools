import { useRouteLoaderData } from "@remix-run/react";
import { LoaderResult } from "../../routes/fax";
import { FaxHistoryItem } from "../../utils/history";
import { FaxHistoryItemList } from "./FaxHistoryItemList";

export default function FaxHistory() {
  const loaderData = useRouteLoaderData<LoaderResult>("routes/fax");
  const historyItems = loaderData?.faxHistory
    ? (loaderData?.faxHistory as unknown as FaxHistoryItem[])
    : [];
  if (!historyItems?.length) {
    return <div>No history items found</div>;
  }
  console.log({ historyItems });

  return (
    <div className="p-4 m-4 bg-slate-100 border border-dashed border-spacing-1 ">
      <h2 className="text-xl font-bold">Fax Ausgang</h2>
      <div className="flex flex-col text-xs">
        <FaxHistoryItemList
          items={historyItems.filter((item) => item.direction === "OUTGOING")}
        />
      </div>
      <h2 className="text-xl font-bold mt-4">Fax Eingang</h2>
      <div className="flex flex-col text-xs">
        <FaxHistoryItemList
          items={historyItems.filter((item) => item.direction === "INCOMING")}
        />
      </div>
    </div>
  );
}
