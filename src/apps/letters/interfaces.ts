import { PrimaryKey, UrlString } from "~/apps/auth/interfaces";

export interface LetterSegment {
  pk: PrimaryKey;
  name: string;
  description?: string;
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
  first_name: string;
  last_name: string;
  email: string;
}

export interface Letter {
  pk: PrimaryKey;
  donor: CrmDonor;
  gift: string;
  template: LetterTemplate;
  segment: LetterSegment;
  created_at: string;
  updated_at: string;
}

export interface LetterBatch {
  pk: PrimaryKey;
  segment: LetterSegment;
  count: number;
  is_downloaded: boolean;
  docx_file: UrlString;
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
