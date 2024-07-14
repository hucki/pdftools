import { Outlet, useLoaderData } from "@remix-run/react";

export type EnvStatus = "ok" | "ENV missing";
export const loader = async (): Promise<EnvStatus> => {
  const { BASE_URL, TOKEN_ID, TOKEN, FAXLINE_ID } = process.env;
  if (!BASE_URL || !TOKEN_ID || !TOKEN || !FAXLINE_ID) {
    return "ENV missing";
  } else {
    return "ok";
  }
};

export default function Fax() {
  const status = useLoaderData<EnvStatus>();
  return (
    <div>
      <div
        className={`h-2 w-2 rounded-xl ${
          status === "ok" ? "bg-green-500" : "bg-red-500"
        } absolute`}
      />
      <Outlet />
    </div>
  );
}
