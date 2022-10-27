import { PrimaryKey, UrlString } from "~/apps/auth/interfaces";

export interface LetterSegment {
  pk: PrimaryKey;
  name: string;
  unsent_batches_count: number;
  unsent_letters_count: number;
  template: LetterTemplate;
  is_recurring: boolean;
  donation_amount_min: URL;
  donation_amount_max: URL;
  donation_amount_total_min: number;
  donation_amount_total_max: number;
  created_at: string;
  updated_at: string;
}

export class CrmDonor {
  pk: PrimaryKey;
  mailing_address: {
    pk: PrimaryKey;
    address_line1: string;
    address_line2: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  first_name: string;
  last_name: string;
  email: string;
  birthday: string;
  donated_total: number;
}

export class CrmGift {
  pk: PrimaryKey;
  source_data: any;
  donor?: CrmDonor;
  amount: number;
  date: string;
  gift_type: string;
  acknowledgment_status: string;
  notes: string;
  appeal: PrimaryKey;
}

export interface Letter {
  pk: PrimaryKey;
  donor: CrmDonor;
  gift: CrmGift;
  template: LetterTemplate;
  segment: LetterSegment;
  html?: string;
  html_default: string;
  is_viewed: boolean;
  created_at: string;
  updated_at: string;
}

export interface LetterBatch {
  pk: PrimaryKey;
  segment: LetterSegment;
  letters: Letter[];
  letters_count: number;
  letters_new_count: number;
  is_downloaded: boolean;
  zip_file: UrlString;
  created_at: string;
  updated_at: string;
}

export interface LetterTemplate {
  pk: PrimaryKey;
  name: string;
  description?: string;
  template_file_docx: UrlString;
  template_file_img: UrlString;
  merge_variables: Map<string, string>;
  created_at: string;
  updated_at: string;
}
