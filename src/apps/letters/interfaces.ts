import { PrimaryKey, UrlString } from "~/apps/auth/interfaces";
import { Task } from "~/apps/tasks/interfaces";

export interface Letter {
  pk: PrimaryKey;
  batch: PrimaryKey;
  rec: {
    pk: PrimaryKey;
    donor: CrmDonor;
    gift: CrmGift;
  };
  html?: string;
  html_default?: string;
  is_viewed: boolean;
  is_excluded: boolean;
  download_pdf_url: string;
  created_at: string;
  updated_at: string;
}

export interface LetterBatch {
  pk: PrimaryKey;
  rec_set: any;
  task: Task;
  template: LetterTemplate;

  letters: Letter[];
  letters_count: number;
  letters_new_count: number;
  is_downloaded: boolean;
  pdf_file: UrlString;
  created_at: string;
  updated_at: string;
}

export interface LetterTemplate {
  pk: PrimaryKey;
  name: string;
  html: string;
  variables: Array<LetterTemplateVariable>;
  created_at: string;
  updated_at: string;
}

export interface LetterTemplateVariable {
  key: string;
  label?: string;
  value_fallback: string;
}

export class CrmGift {
  pk: PrimaryKey;
  source_data: any;
  donor?: CrmDonor;
  amount: string;
  date: string;
  gift_type: string;
  acknowledgment_status: string;
  notes: string;
  appeal?: {
    title: string;
  };

  custom_data: { [field: string]: any };
}

export class CrmDonor {
  id: PrimaryKey;
  pk: PrimaryKey;
  portfolio_plan_id?: PrimaryKey;
  source_id: PrimaryKey;
  source: "blackbaud" | "donor_perfect" | "salesforce" | "every_action" | "other";
  gifts?: CrmGift[];

  linkedin_url: string;
  twitter_url: string;
  facebook_url: string;

  letter_label: string;
  mailing_address: {
    pk: PrimaryKey;
    address_line1: string;
    address_line2: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  name: string;
  first_name: string;
  last_name: string;
  salutation: string;
  email: string;
  phone_number?: string;
  birthday: string;
  donated_total: number;
  crm_url: URL;
  donation_biggest?: number;
  giving_since?: string;
  last_contact?: string;
  last_gift_date?: string;
  last_gift_amount?: number;
  last_recurring_gift_date?: string;
  donation_average: number;
  rec_expected_value: number;
  source_data: any;
  do_not_contact: boolean;
  do_not_call: boolean;
  do_not_email: boolean;
  do_not_mail: boolean;
  spouse_name: string;
  custom_data: { [field: string]: any };
  communication_preferences: string;
  goal_gift_amount: number;
  goal_gift_amount_suggestion: number | null;

  expected_gift_date: string;
  touches_before_gift: number | null;
  is_expected_gift_date_user_set: boolean;

  household?: {
    description: string;
    donors: CrmDonor[];
  }

  actions?: CrmAction[];

  donor_intels?: Array<{
    source: string;
    source_data: any;
    gifts_total: number;
    gifts_count: number;
    capacity_range: string;
    capacity_estimate: number;
    largest_gift_min: number;
    largest_gift_max: number;
    largest_gift_org: string;
    real_estate_estimate: number;
    sec_stock_value: number;
  }>
}

export class CrmAction {
  pk: PrimaryKey;
  donor: PrimaryKey;
  title: string;
  description: string;
  category: string;
  is_completed: boolean;
  completed_date: string;
  action_created_at: string;
  action_updated_at: string;
}
