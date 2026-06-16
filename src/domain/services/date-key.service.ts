export function getLocalDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function getWeekKey(date = new Date()) {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - ((start.getDay() + 6) % 7));

  return getLocalDateKey(start);
}

export function getTomorrowLabel(date = new Date()) {
  const tomorrow = new Date(date);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  const diffMs = tomorrow.getTime() - date.getTime();
  const hours = Math.max(0, Math.floor(diffMs / 3_600_000));
  const minutes = Math.max(0, Math.floor((diffMs % 3_600_000) / 60_000));

  return `${hours}h ${minutes}m`;
}
