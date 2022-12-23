import * as datefns from "date-fns";

export function toLocaleDateString(date?: string) {
  if (date) {
    return datefns.parseISO(date).toLocaleDateString();
  }
  return "";
}

export namespace format {
  export function date(date?: string): string {
    if (date) {
      return datefns.format(datefns.parseISO(date), "MMM d, y");
    }
    return "";
  }

  export function dateHumanShort(date?: string): string {
    if (date) {
      return datefns.format(datefns.parseISO(date), "MMM d");
    }
    return "";
  }

  export function datetimeHumanShort(date?: string): string {
    if (date) {
      return datefns.format(datefns.parseISO(date), "MMM d, h:mmaaa");
    }
    return "";
  }

  export function dateMonth(date?: string): string {
    if (date) {
      return datefns.format(datefns.parseISO(date), "MMM y");
    }
    return "";
  }

  export function dateFromUnix(date: number): string {
    return datefns.format(new Date(date), "MMM d, y");
  }

  export function dateAgo(date?: string): string {
    if (date) {
      return datefns.formatDistance(new Date(date), new Date(), { addSuffix: true });
    }
    return "";
  }

  export function money(amount?: string | number, decimals: number = 0): string {
    if (amount) {
      return `$${Number(amount).toLocaleString(
        "en-US",
        { minimumFractionDigits: decimals, maximumFractionDigits: decimals }
      )}`;
    }
    return "";
  }

  export function percentage(num: number): string {
    if (num) {
      return `${num.toFixed(2)}%`;
    }
    return "";
  }
}
