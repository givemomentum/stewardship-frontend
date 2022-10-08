export function toLocalDate(date?: string) {
  if (date) {
    return (new Date(date)).toLocaleDateString();
  }
  return "";
}
