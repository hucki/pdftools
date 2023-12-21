import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "Mundwerk pdf tools" },
    { name: "description", content: "Welcome to Mundwerk pdf tools" },
  ];
};

export default function Index() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1 className="m-2">Mundwerk PDF Tools</h1>
      <Link
        className="rounded-md p-1 bg-orange-400 text-slate-950 cursor-pointer"
        to="./fax-composer/client"
      >
        zu den PDF tools
      </Link>
    </div>
  );
}
