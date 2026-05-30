import ky from "ky";

const serverApiUrl = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL;

export const serverClient = ky.create({
  prefix: serverApiUrl,
  headers: { "Content-Type": "application/json" },
});
