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

  return (
    <div className="bg-white p-4 flex flex-col h-full overflow-hidden rounded-md shadow-md">
      <div className="h-1/2 overflow-hidden flex flex-col">
        <h2 className="text-xl font-bold">Fax Ausgang</h2>
        <div className="h-full overflow-y-auto text-xs shadow-inner bg-gray-50 rounded-md">
          <FaxHistoryItemList
            items={historyItems.filter((item) => item.direction === "OUTGOING")}
          />
        </div>
      </div>
      <div className="h-1/2 overflow-hidden flex flex-col">
        <h2 className="text-xl font-bold mt-4">Fax Eingang</h2>
        <div className="h-full overflow-y-auto text-xs shadow-inner bg-gray-50 rounded-md">
          <FaxHistoryItemList
            items={historyItems.filter((item) => item.direction === "INCOMING")}
          />
        </div>
      </div>
    </div>
  );
}
