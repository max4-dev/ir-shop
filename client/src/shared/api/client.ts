import ky from "ky";

import { getIsRefreshSent, handleRefreshToken } from "./authHelper";
import { HttpCodes } from "./const/httpCodes";

export const client = ky.create({
  prefixUrl: process.env.NEXT_PUBLIC_API_URL,
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
  },
  hooks: {
    afterResponse: [
      async (request, options, response) => {
        if (response.status === HttpCodes.Unauthorized) {
          const isSentToRefresh = await getIsRefreshSent();
          if (isSentToRefresh) {
            throw new Error("Already tried to refresh token");
          }

          try {
            await handleRefreshToken();

            const retryRequest = new Request(request, {
              headers: new Headers(request.headers),
            });
            return ky(retryRequest, options);
          } catch (err) {
            throw err;
          }
        }

        if (response.status === HttpCodes.Forbidden) {
          throw new Error("Forbidden");
        }

        if (!response.ok) {
          try {
            const data = await response.json();
            console.log(data);
          } catch {
            console.log({ message: "Unknown error", type: "error" });
          }
          throw new Error(response.statusText);
        }

        return response;
      },
    ],
  },
});
