export const initialOf = (name: string | null | undefined) => (name?.trim()[0] ?? "?").toUpperCase();

// Today shows the time, anything older shows the date (like most chat apps)
export const formatListTime = (value: string | null) => {
  if (!value) return "";
  const date = new Date(value);
  const isToday = date.toDateString() === new Date().toDateString();
  return isToday
    ? date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
    : date.toLocaleDateString([], { day: "numeric", month: "short" });
};

export const formatMessageTime = (value: string) =>
  new Date(value).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
