import { ConfigProvider } from "antd";
import ruRU from "antd/locale/ru_RU";

import { Router } from "../../router/router";
import { AuthProvider } from "../AuthProvider/AuthProvider";
import { QueryProvider } from "../QueryProvider/QueryProvider";

export const AppProvider = () => {
  return (
    <ConfigProvider locale={ruRU}>
      <QueryProvider>
        <AuthProvider>
          <Router />
        </AuthProvider>
      </QueryProvider>
    </ConfigProvider>
  );
};
