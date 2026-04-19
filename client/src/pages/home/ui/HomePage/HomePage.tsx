"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

import { client } from "@/src/shared/api";

export const HomePage = () => {
  const { data } = useQuery({
    queryKey: ["products"],
    queryFn: () => client.get("products").json(),
  });
  useEffect(() => {
    console.log(data);
  }, [data]);
  return (
    <div>
      <h1>Home</h1>
    </div>
  );
};
