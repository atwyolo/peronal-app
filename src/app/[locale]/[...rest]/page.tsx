// Rendering: dynamic (any unknown path). Without this catch-all, unmatched paths under a locale would skip
// the [locale] layout; calling notFound() here renders src/app/[locale]/not-found.tsx inside it, with a 404 status.
import { notFound } from "next/navigation";
import type { FC } from "react";

const CatchAllPage: FC = () => {
  notFound();
};

export default CatchAllPage;
