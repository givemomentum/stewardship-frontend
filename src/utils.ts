import { fromUnixTime } from "date-fns";
import * as datefns from "date-fns";
import { CrmDonor } from "~/apps/letters/interfaces";

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
      return datefns.format(datefns.parseISO(date), "MMM do");
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

  export function dateFromUnixV2(date: number, isIncludeYear = true): string {
    if (isIncludeYear) {
      return datefns.format(fromUnixTime(Number(date)), "MMM d, y");
    }
    return datefns.format(fromUnixTime(Number(date)), "MMM d");
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
        { minimumFractionDigits: decimals, maximumFractionDigits: decimals },
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

export function getCommunicationPreferences(donor?: CrmDonor) {
  if (!donor) {
    return "";
  }

  if (donor.source == "blackbaud") {
    return ""; // Blackbaud doesn't have trustworthy communication preferences at the moment.
  }

  const preferences = [];
  if (donor.do_not_contact) {
    preferences.push("Do Not Contact");
  }
  if (donor.do_not_call) {
    preferences.push("Do Not Call");
  }
  if (donor.do_not_email) {
    preferences.push("Do Not Email");
  }
  if (donor.do_not_mail) {
    preferences.push("Do Not Mail");
  }

  return preferences.join(", ");
}

export function getRecurringGiftDescription(donor?: CrmDonor) {
  const last_recurring_gift_date = donor?.last_recurring_gift_date;
  if (!last_recurring_gift_date) {
    return "They are not a recurring donor";
  }
  if (last_recurring_gift_date < datefns.sub(new Date(), { days: 35 }).toISOString()) {
    return `They were a recurring donor until ${format.date(last_recurring_gift_date)}`;
  }
  return "They are an active recurring donor";
}


export function getShortRecurringGiftDescription(donor?: CrmDonor) {
  const last_recurring_gift_date = donor?.last_recurring_gift_date;
  if (!last_recurring_gift_date) {
    return "Not a recurring donor";
  }
  if (last_recurring_gift_date < datefns.sub(new Date(), { days: 35 }).toISOString()) {
    return `Recurring donor until ${format.date(last_recurring_gift_date)}`;
  }
  return "Active recurring donor";
}

export function supportsRecurringGiving(donor?: CrmDonor) {
  return ['blackbaud', 'donor_perfect', 'salesforce'].includes(donor?.source)
}