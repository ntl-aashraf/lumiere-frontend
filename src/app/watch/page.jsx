import { Suspense } from "react";
import React from "react";
import WatchPage from "@/components/MoviesPageLayout";

const page = () => {
  return (
    <Suspense>
      <WatchPage fallback={<div>Loading...</div>} />
    </Suspense>
  );
};

export default page;
