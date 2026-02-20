export function toSqlDate(date: Date | string | undefined | null): string | null {
  if (!date) return null;

  const d = typeof date === "string" ? new Date(date) : date;

  // Verificăm dacă data este validă (e.g. să nu fie "invalid date")
  if (isNaN(d.getTime())) return null;

  return d.toISOString().split("T")[0];
}