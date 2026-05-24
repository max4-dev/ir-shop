import { NotFoundPage } from "@/src/pages/not-found/ui";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 — Страница не найдена",
};

export default function NotFound() {
  return <NotFoundPage />;
}
