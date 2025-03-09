import { useRouteLoaderData } from "@remix-run/react";
import { HistoryItem, HistoryItemType } from "../../utils/history";
import { HistoryItemList } from "./HistoryItemList";
import { HistoryLoaderResult } from "../../routes/history";
import { Container } from "../atoms/Container";
import { ToggleButton } from "../atoms/Button";
import { useState } from "react";

export default function HistoryList({ type }: { type: HistoryItemType }) {
  const [isArchive, setIsArchive] = useState(false);
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
  const filteredHistoryItems = {
    incoming: historyItems.filter(
      (item) =>
        item.archived !== true &&
        (item.direction === "INCOMING" || item.direction === "MISSED_INCOMING")
    ),
    archived: historyItems.filter((item) => item.archived === true),
  };
  if (!historyItems?.length) {
    return <div>No history items found</div>;
  }
  const typeLabel =
    type === "CALL" ? "Anruf" : type === "VOICEMAIL" ? "VOICEMAIL" : "Fax";

  return (
    <div className="grid gap-2 p-2 h-full overflow-y-auto">
      {type !== "VOICEMAIL" && (
        <Container
          className="max-h-full overflow-y-auto"
          bg={isArchive ? "bg-yellow-100" : undefined}
        >
          <h2 className="text-xl font-bold">❌ {typeLabel} verpasst</h2>
          <div className="flex flex-col text-xs">
            <HistoryItemList
              items={historyItems.filter(
                (item) => item.direction === "MISSED_INCOMING"
              )}
            />
          </div>
        </Container>
      )}
      <Container
        className="max-h-full overflow-y-auto"
        bg={isArchive ? "bg-yellow-100" : undefined}
      >
        <h2 className="text-xl font-bold mt-4">
          {typeLabel} {isArchive ? "Archiv" : "Eingang"}
        </h2>
        <ToggleButton
          label={isArchive ? "Eingang ansehen" : "Archiv ansehen"}
          value={isArchive}
          onChange={() => setIsArchive(!isArchive)}
        />
        <div className="flex flex-col text-xs">
          <HistoryItemList
            items={filteredHistoryItems[
              isArchive ? "archived" : "incoming"
            ].filter((item) => item.direction === "INCOMING")}
          />
        </div>
      </Container>
      {type !== "VOICEMAIL" && (
        <Container bg={isArchive ? "bg-yellow-100" : undefined}>
          <h2 className="text-xl font-bold mt-4">{typeLabel} Ausgang</h2>
          <div className="flex flex-col text-xs">
            <HistoryItemList
              items={historyItems.filter(
                (item) => item.direction === "OUTGOING"
              )}
            />
          </div>
        </Container>
      )}
    </div>
  );
}
