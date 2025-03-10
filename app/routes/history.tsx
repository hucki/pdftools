import { getHistoryLoader } from "../utils/history";
import { Navigation } from "../components/organisms/Navigation";
import { useLoaderData } from "@remix-run/react";
import { HistoryView } from "../components/organisms/HistoryView";

export const loader = getHistoryLoader({ archived: false });

export default function History() {
  const { callsIncoming, callsMissed, callsOutgoing, voicemails } =
    useLoaderData<typeof loader>();
  return (
    <div className="flex md:h-full">
      <Navigation width="w-2/12 md:w-1/12" />
      <div className="bg-slate-100 h-full w-10/12 md:w-11/12">
        <HistoryView
          callsIncoming={callsIncoming}
          callsMissed={callsMissed}
          callsOutgoing={callsOutgoing}
          voicemails={voicemails}
          isArchive={false}
        />
      </div>
    </div>
  );
}
