import { PrimaryKey, User } from "~/apps/auth/interfaces";
import { CrmDonor } from "~/apps/letters/interfaces";

export interface PortfolioPlan {
  id: string;
  org_id: number;
  org: number;
  name: string;
  donors: PrimaryKey[];
  touches_before_the_gift: number;
  min_major_gift_amount: number;
  assignee: User;
  algolia_creds: {
    app_id: string;
    api_key: string;
    index_name: string;
  },
}

export interface TouchRec {
  id: PrimaryKey;
  org: PrimaryKey;
  plan: PortfolioPlan;
  author?: PrimaryKey;
  donor: CrmDonor;
  status: TouchStatus;
  month: number;
  year: number;
  scheduled_for?: string;
  scheduled_for_reason?: string;
  type: string;
  is_priority_urgent: boolean;
  is_stop_other_recs_until_reached: boolean;
  notified_at?: string;
  handled_at?: string;
  email_subject: string;
  email_prompt: string;
  email_content_md: string;
  call_prompt: string;
  call_content_md: string;
  created_at: string;
  updated_at: string;
}

export type TouchStatus = "drafted_by_admin"
    | "created"
    | "user_notified"
    | "completed"
    | "skipped_as_unqualified"
    | "skipped_as_already_handled"
    | "skipped_to_next_month"
    | "skipped_to_next_quarter";
