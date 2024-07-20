import { Outlet, useLoaderData } from "@remix-run/react";
import { Contact, fetchContacts } from "../utils/contacts";

export type LoaderResult = {
  status: string;
  contacts: Contact[];
};

export const loader = async (): Promise<LoaderResult> => {
  const { BASE_URL, TOKEN_ID, TOKEN, FAXLINE_ID } = process.env;
  let fetchError = false;
  const contacts: Contact[] = [];
  const envMissing = !BASE_URL || !TOKEN_ID || !TOKEN || !FAXLINE_ID;
  try {
    const contactsFetchResult = await fetchContacts();
    if (contactsFetchResult.items.length) {
      contacts.push(...contactsFetchResult.items);
    }
  } catch (error) {
    fetchError = true;
  }
  if (envMissing || fetchError) {
    return {
      status: "" + (envMissing && "ENV missing") + (fetchError && "fetchError"),
      contacts,
    };
  } else {
    return {
      status: "ok",
      contacts,
    };
  }
};

export default function Fax() {
  const { status } = useLoaderData<LoaderResult>();
  return (
    <div>
      <div
        className={`fax-status h-2 w-2 rounded-xl ${
          status === "ok" ? "bg-green-500" : "bg-red-500"
        } fixed`}
      />
      <Outlet />
    </div>
  );
}
