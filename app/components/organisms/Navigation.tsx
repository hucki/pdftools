import { useLoaderData } from "@remix-run/react";
import { Link } from "../atoms/Link";
import { LoaderResult } from "../../routes/fax";
import {
  ArchiveBoxIcon,
  DocumentIcon,
  PhoneIcon,
} from "@heroicons/react/16/solid";
import { Logo } from "../atoms/Logo";

interface NavigationProps {
  width?: string;
}
export const Navigation = ({ width = "w-1/12" }: NavigationProps) => {
  const status = useLoaderData<LoaderResult>()?.status;
  return (
    <aside className={`flex flex-col h-full ${width} bg-slate-300`}>
      <div className="flex flex-col p-2">
        <div className="flex flex-col mt-4">
          <div className="flex flex-col items-center mb-2">
            <Logo size={42} />
          </div>
          <span className="text-slate-900 text-sm font-bold font-mono text-center text-nowrap justify-center">
            Menu
          </span>
          {status ? (
            <div
              className={`fax-status px-4 py-2 m-1 rounded text-center font-mono text-xs fixed bottom-1 ${
                status === "ok"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {status === "ok" ? "online" : "Offline"}
            </div>
          ) : null}
          <Link to="/fax/composer/client">
            <DocumentIcon className="h-6 w-6 text-blue-500" /> Fax
          </Link>
          <Link to="/history">
            <PhoneIcon className="h-6 w-6 text-blue-500" /> Anrufliste
          </Link>
          <Link to="/archive">
            <ArchiveBoxIcon className="h-6 w-6 text-blue-500" /> Archiv
          </Link>
        </div>
      </div>
    </aside>
  );
};
