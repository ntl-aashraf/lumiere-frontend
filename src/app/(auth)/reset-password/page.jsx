import React, { Suspense } from "react";
import ResetPasswordPage from "@/components/ResetPassword";

const page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordPage />
    </Suspense>
  );
};

export default page;
