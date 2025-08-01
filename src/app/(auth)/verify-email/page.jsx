import React, { Suspense } from "react";
import VerifyEmail from "@/components/VerifyEmail";

const page = () => {
  return (
    <Suspense>
      <VerifyEmail fallback={<div>Loading...</div>} />
    </Suspense>
  );
};

export default page;
