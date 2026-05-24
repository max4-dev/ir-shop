export const formatDateTime = (value: string | Date): string => {
  const date = typeof value === "string" ? new Date(value) : value;

  return date.toLocaleString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
