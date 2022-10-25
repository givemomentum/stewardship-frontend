import { PrimaryKey, UrlString } from "~/apps/auth/interfaces";

export interface FiscExport {
  pk: PrimaryKey;
  org: PrimaryKey;
  date: string;
  is_downloaded: boolean;
  gifts_export_url: UrlString;
  optout_export_url: UrlString;
  num_scans: number;
  num_scans_unread: number;
  num_gifts: number;
  num_optouts: number;
  donation_total: number;
  file_name: string;
}

export interface FiscGift {
  pk: PrimaryKey;
  donor_id: PrimaryKey;
  is_existing_donor: boolean;
  first_name: string;
  last_name: string;
  salutation: string;
  home_phone: string;
  opt_line: string;
  email: string;
  org_rec: string;
  donor_type: string;
  address: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  gift_date: string;
  amount: string;
  ty_letter_no: string;
  taxyear: string;
  reference: string;
  gift_type: string;
  gl_code: string;
  solicit_code: string;
  campaign: string;
  sub_solicit_code: string;
  gift_narrative: string;
  record_type: string;
  flags: string;
  memory_honor: string;
  gfname: string;
  glname: string;
  export: string;
}

export interface FiscOptOut {
  pk: PrimaryKey;
  scan: PrimaryKey;
  first_name: string;
  last_name: string;
  address: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
}

export interface FiscScan {
  pk: PrimaryKey;
  gift?: FiscGift;
  optout?: FiscOptOut;
  is_existing_donor: boolean;
  image_front: UrlString;
  image_back: UrlString;
  account: number;
  donor_id: number;
  date?: string;
  amount: string;
  is_viewed: boolean;
  is_duplicated: boolean;
}
