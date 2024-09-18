import type { MetaFunction } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { Link } from "../components/atoms/Link";

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
      <Outlet />
      <Link to="./fax/composer/client">📠 zum Fax</Link>
      <Link to="./fax/composer/client">📞 zur Anrufliste</Link>
    </div>
  );
}
