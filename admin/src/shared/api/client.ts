import { isHTTPError, type Options } from "ky";
import ky from "ky";

import { CONFIG } from "../config";
import { SessionEvent, sessionEventBus } from "../lib";

import { HttpCodes } from "./constants/http-codes.constants";

type RefreshSubscriber = (error?: Error) => void;

let isRefreshing = false;
let refreshSubscribers: RefreshSubscriber[] = [];

const subscribeTokenRefresh = (cb: RefreshSubscriber) => {
  refreshSubscribers.push(cb);
};

const onTokenRefreshed = () => {
  isRefreshing = false;
  const subscribers = refreshSubscribers;
  refreshSubscribers = [];
  subscribers.forEach((cb) => cb());
};

const onRefreshFailed = (error: Error) => {
  isRefreshing = false;
  const subscribers = refreshSubscribers;
  refreshSubscribers = [];
  subscribers.forEach((cb) => cb(error));

  sessionEventBus.emit(SessionEvent.SessionExpired);
};

const baseConfig: Options = {
  prefix: CONFIG.API_URL,
  credentials: "include",
  headers: { "Content-Type": "application/json" },
};

export const baseKy = ky.create(baseConfig);

export const uploadClient = ky.create({
  prefix: CONFIG.API_URL,
  credentials: "include",
});

export const client = ky.create({
  ...baseConfig,
  hooks: {
    afterResponse: [
      async ({ request, response }) => {
        if (response.status !== HttpCodes.UNAUTHORIZED) {
          return response;
        }

        if (new URL(request.url).pathname.endsWith("/auth/admin/refresh-token")) {
          return response;
        }

        if (isRefreshing) {
          return new Promise<Response>((resolve, reject) => {
            subscribeTokenRefresh(async (error?: Error) => {
              if (error) return reject(error);
              try {
                resolve(await baseKy(request.clone()));
              } catch (err) {
                reject(err);
              }
            });
          });
        }

        isRefreshing = true;

        try {
          await baseKy.post("auth/admin/refresh-token");

          onTokenRefreshed();

          return baseKy(request.clone());
        } catch {
          const error = new Error("Сессия истекла");
          onRefreshFailed(error);
          throw error;
        }
      },
    ],

    beforeError: [
      async ({ error }) => {
        if (!isHTTPError(error)) {
          return error;
        }

        let message = error.response.statusText;

        try {
          const body = error.data as { message?: string } | undefined;
          if (body?.message) message = body.message;
        } catch {
          // ignore parse errors
        }

        error.message = message;
        return error;
      },
    ],
  },
});
