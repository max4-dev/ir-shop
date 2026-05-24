import { BrowserRouter, Route, Routes } from "react-router";

import { CategoriesPage } from "@src/pages/categories";
import { DashboardPage } from "@src/pages/dashboard";
import { LoginPage } from "@src/pages/login";
import { OrderDetailPage, OrdersPage } from "@src/pages/orders";
import { PromoCodesPage } from "@src/pages/promo-codes";
import { ProductCreatePage, ProductEditPage, ProductsPage } from "@src/pages/products";
import { UsersPage } from "@src/pages/users";
import { ROUTES } from "@src/shared/config";

import { GuestRoute } from "./GuestRoute";
import { ProtectedRoute } from "./ProtectedRoute";

export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          element={
            <GuestRoute>
              <LoginPage />
            </GuestRoute>
          }
          path={ROUTES.AUTH.LOGIN}
        />
        <Route
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
          path={ROUTES.DASHBOARD}
        />
        <Route
          element={
            <ProtectedRoute>
              <ProductsPage />
            </ProtectedRoute>
          }
          path={ROUTES.PRODUCTS.ROOT}
        />
        <Route
          element={
            <ProtectedRoute>
              <ProductCreatePage />
            </ProtectedRoute>
          }
          path={ROUTES.PRODUCTS.CREATE}
        />
        <Route
          element={
            <ProtectedRoute>
              <ProductEditPage />
            </ProtectedRoute>
          }
          path="/products/:id"
        />
        <Route
          element={
            <ProtectedRoute>
              <OrdersPage />
            </ProtectedRoute>
          }
          path={ROUTES.ORDERS.ROOT}
        />
        <Route
          element={
            <ProtectedRoute>
              <OrderDetailPage />
            </ProtectedRoute>
          }
          path="/orders/:id"
        />
        <Route
          element={
            <ProtectedRoute>
              <CategoriesPage />
            </ProtectedRoute>
          }
          path={ROUTES.CATEGORIES.ROOT}
        />
        <Route
          element={
            <ProtectedRoute>
              <UsersPage />
            </ProtectedRoute>
          }
          path={ROUTES.USERS.ROOT}
        />
        <Route
          element={
            <ProtectedRoute>
              <PromoCodesPage />
            </ProtectedRoute>
          }
          path={ROUTES.PROMO_CODES.ROOT}
        />
      </Routes>
    </BrowserRouter>
  );
};
