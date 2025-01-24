import type { MetaFunction } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { Navigation } from "../components/organisms/Navigation";

export const meta: MetaFunction = () => {
  return [
    { title: "Mundwerk pdf tools" },
    { name: "description", content: "Welcome to Mundwerk pdf tools" },
  ];
};

export default function Index() {
  return (
    <div
      style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}
      className="h-full flex"
    >
      <Navigation />
      <div className="flex flex-col w-11/12">
        <Outlet />
      </div>
    </div>
  );
}
