export const formatContactTime = (dateStr) => {
  const date = new Date(dateStr);
  const now = new Date();

  const isToday = date.toDateString() === now.toDateString();

  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  const isThisWeek = date >= startOfWeek;

  if (isToday) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
  } else if (isThisWeek) {
    return date.toLocaleDateString([], { weekday: "short" }); // Mon, Tue, etc.
  } else {
    return date.toLocaleDateString([], { day: "2-digit", month: "2-digit", year: "2-digit" });
  }
};