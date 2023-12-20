import type { MetaFunction } from "@remix-run/node";

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
    </div>
  );
}
