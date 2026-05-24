import { useState } from "react";

import { UserDetailsModal } from "@src/features/user";
import { AdminLayout } from "@src/widgets/layout";
import { UsersTable } from "@src/widgets/user";

export const UsersPage = () => {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  return (
    <AdminLayout title="Пользователи">
      <UsersTable onView={setSelectedUserId} />
      <UserDetailsModal userId={selectedUserId} onClose={() => setSelectedUserId(null)} />
    </AdminLayout>
  );
};
