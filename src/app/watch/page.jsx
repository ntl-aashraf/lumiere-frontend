import React, { Suspense } from "react";
import WatchPage from "@/components/MoviesPageLayout";

const page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <WatchPage />
    </Suspense>
  );
};

export default page;
