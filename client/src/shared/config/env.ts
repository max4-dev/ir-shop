export type EnvConfig = {
  API_URL: string;
};

export const CONFIG: EnvConfig = {
  API_URL: `${process.env.NEXT_PUBLIC_API_URL}`,
};
