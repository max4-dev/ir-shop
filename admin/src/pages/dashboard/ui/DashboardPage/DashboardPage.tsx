import { AdminLayout } from "@src/widgets/layout";
import { DashboardStats, PendingOrdersTable } from "@src/widgets/dashboard";

export const DashboardPage = () => {
  return (
    <AdminLayout title="Дашборд">
      <DashboardStats />
      <PendingOrdersTable />
    </AdminLayout>
  );
};
