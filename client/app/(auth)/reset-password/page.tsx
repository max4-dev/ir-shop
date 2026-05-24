import { Suspense } from "react";

import { ResetPasswordPage } from "@/src/pages/auth/ui";

const ResetPassword = () => {
  return (
    <Suspense fallback={null}>
      <ResetPasswordPage />
    </Suspense>
  );
};

export default ResetPassword;
