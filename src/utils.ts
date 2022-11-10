import * as datefns from "date-fns";

export function toLocaleDateString(date?: string) {
  if (date) {
    return datefns.parseISO(date).toLocaleDateString();
  }
  return "";
}

export function formatMoney(amount?: string | number): string {
  return format.money(amount);
}

export namespace format {
  export function dateHuman(date?: string): string {
    if (date) {
      return datefns.format(datefns.parseISO(date), "MMM d");
    }
      return "";
  }

  export function dateFromUnix(date: number): string {
    return datefns.format(new Date(date), "MMM d y");
  }

  export function dateAgo(date: string): string {
    return datefns.formatDistance(new Date(date), new Date(), { addSuffix: true });
  }

  export function money(amount?: string | number): string {
    if (amount) {
      return `$${Number(amount).toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
    }
    return "";
  }
}
