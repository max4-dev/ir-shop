import { Suspense } from "react";

import { VerifyEmailPage } from "@/src/pages/auth/ui";

const VerifyEmail = () => {
  return (
    <Suspense fallback={null}>
      <VerifyEmailPage />
    </Suspense>
  );
};

export default VerifyEmail;
