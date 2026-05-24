import ky from "ky";

export const serverClient = ky.create({
  prefix: process.env.NEXT_PUBLIC_API_URL,
  headers: { "Content-Type": "application/json" },
});
