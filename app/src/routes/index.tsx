import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "POWERVERSE — The Microsoft Power Platform Learning Hub" },
      {
        name: "description",
        content:
          "Everything you need to learn Microsoft Power Platform: tools, live code playground, snippets, real-life scenarios and interview prep.",
      },
      { property: "og:title", content: "POWERVERSE — The Microsoft Power Platform Learning Hub" },
      {
        property: "og:description",
        content:
          "Learn Microsoft Power Platform by doing: live Power Fx playground, 99-function reference, code library, scenarios and interview prep.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  useEffect(() => {
    window.location.replace(new URL("powerverse.html", window.location.href).href);
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <p className="text-sm text-muted-foreground">Loading POWERVERSE…</p>
    </div>
  );
}
