import { parseISO } from "date-fns";

export function toLocalDate(date?: string) {
  if (date) {
    return parseISO(date).toLocaleDateString();
  }
  return "";
}
