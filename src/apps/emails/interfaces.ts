import { PrimaryKey } from "~/apps/auth/interfaces";
import { CrmDonor } from "~/apps/letters/interfaces";
import { RecommendationSet, Task } from "~/apps/tasks/interfaces";

export interface EmailTemplate {
  pk: PrimaryKey;
  title: string;
  content_html: string;
  variables: EmailTemplateVariable[];
}

export interface EmailBatch {
  pk: PrimaryKey;
  template: EmailTemplate;
  task: Task;
  rec_set: RecommendationSet;
  status: "prepopulated" | "pending" | "sent";
  emails_unviewed_count: number;
  emails_count: number;
  open_count: number;
  bounce_count: number;
}

export interface Email {
  pk: PrimaryKey;
  donor: CrmDonor;
  batch: EmailBatch;
  template: EmailTemplate;

  subject: string;
  content_html: string;
  content_html_default: string;

  is_viewed: boolean;
  is_excluded: boolean;

  status: "pending" | "sent" | "opened" | "bounced" | "failed" | "excluded";
  sent_at: string;
  delivered_at: string;
  opened_first_at: string;
  opened_last_at: string;
  is_bounced: boolean;
  click_count: number;
  open_count: number;
}

export interface EmailTemplateVariable {
  key: string;
  label?: string;
  value_fallback: string;
}
