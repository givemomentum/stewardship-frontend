import { PrimaryKey } from "~/apps/auth/interfaces";
import { Rec, RecommendationSet, Task } from "~/apps/tasks/interfaces";

export interface EmailTemplate {
  pk: PrimaryKey;
  title: string;
  content_html: string;
  subject: string;
  email_from: string;
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
  created_at: string;
}

export interface Email {
  pk: PrimaryKey;
  rec: Rec;
  template: EmailTemplate;

  subject: string;
  cc_list: string;
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

  prompt_outputs?: PromptOutput[];
}

export interface PromptOutput {
  pk: PrimaryKey;
  email: PrimaryKey;
  prompt: string;
  output: string;
  created_at: string;
}

export interface EmailTemplateVariable {
  key: string;
  label?: string;
  value_fallback: string;
}
