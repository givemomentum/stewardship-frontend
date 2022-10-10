import { parseISO } from "date-fns";

export function toLocaleDateString(date?: string) {
  if (date) {
    return parseISO(date).toLocaleDateString();
  }
  return "";
}
