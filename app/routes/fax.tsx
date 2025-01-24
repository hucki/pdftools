import { Outlet } from "@remix-run/react";
import { Contact, fetchContacts } from "../utils/contacts";
import { FaxHistoryResult, fetchHistory } from "../utils/history";
import { fetchCallerid, fetchTagline } from "../utils/faxlines";
import { Navigation } from "../components/organisms/Navigation";

export type LoaderResult = {
  status: string;
  contacts: Contact[];
  faxHistory: FaxHistoryResult[];
  callerid?: string;
  tagline?: string;
};

export const loader = async (): Promise<LoaderResult> => {
  const { BASE_URL, TOKEN_ID, TOKEN, FAXLINE_ID } = process.env;
  let fetchError = false;
  const contacts: Contact[] = [];
  const faxHistory: FaxHistoryResult[] = [];
  let callerid: string | undefined = undefined;
  let tagline: string | undefined = undefined;
  const envMissing = !BASE_URL || !TOKEN_ID || !TOKEN || !FAXLINE_ID;
  try {
    const taglineFetchResult = await fetchTagline();
    if (taglineFetchResult) {
      tagline = taglineFetchResult.data;
    }
    const calleridFetchResult = await fetchCallerid();
    if (calleridFetchResult) {
      callerid = calleridFetchResult.data.value;
    }
    const contactsFetchResult = await fetchContacts();
    if (contactsFetchResult.items.length) {
      contacts.push(...contactsFetchResult.items);
    }
    const historyFetchResult = await fetchHistory({
      type: "FAX",
    });
    if (historyFetchResult?.data.items.length) {
      faxHistory.push(...historyFetchResult.data.items);
    }
  } catch (error) {
    fetchError = true;
  }
  if (envMissing || fetchError) {
    return {
      status: "" + (envMissing && "ENV missing") + (fetchError && "fetchError"),
      contacts,
      faxHistory: [],
      callerid,
      tagline,
    };
  } else {
    return {
      status: "ok",
      contacts,
      faxHistory,
      callerid,
      tagline,
    };
  }
};

export default function Fax() {
  return (
    <div className="flex h-full">
      <Navigation />
      <div className="bg-slate-100 h-full w-11/12">
        <Outlet />
      </div>
    </div>
  );
}
