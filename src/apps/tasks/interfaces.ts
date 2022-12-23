import { PrimaryKey, User } from "~/apps/auth/interfaces";
import { CrmDonor, CrmGift } from "~/apps/letters/interfaces";

export interface Task {
  pk: PrimaryKey;
  slug: string;
  title: string;
  description: string;
  description_short: string;
  description_plaintext: string;
  status: TaskStatusStr;
  author: User;
  author_pk: PrimaryKey;
  assignee: User;
  assignee_pk: PrimaryKey;
  org: PrimaryKey;
  created_at: string;
  comments: Comment[];
  comments_count: number;
  rec_set?: RecommendationSet;
  is_published: boolean;
}

export interface Recommendation {
  pk: PrimaryKey;
  donor?: CrmDonor;
  gift?: CrmGift;
  explanation: string;
  state: "new" | "completed" | "dismissed";
  action_description: string;
  action_type: "none" | "call" | "letter" | "email" | "other";
  action_state: "none" | "logged_by_user" | "stored_to_crm";
}

export interface RecommendationSet {
  pk: PrimaryKey;
  recs: Recommendation[];
  rule: Rule;
  type: "donors" | "gifts" | "letters" | "donor_emails";
  email_batch?: PrimaryKey;
  letter_batch?: PrimaryKey;
}

export interface Rule {
  pk: PrimaryKey;

  is_trigger_active: boolean;
  trigger_class: string;
  trigger_kwargs: any;

  is_grouper_active: boolean;
  grouper_class: string;
  grouper_kwargs: any;

  is_executor_active: boolean;
  executor_class: string;
  executor_kwargs: any;

  rec_set_type: "donors" | "gifts" | "emails";

  donor_custom_fields: any;
  gift_custom_fields: any;

  emails_to_donors_cc: string;

  default_assignee: PrimaryKey;
  task_title: string;
  task_description_template: string;
  is_show_dismiss_button_on_task: boolean;
  is_show_log_button_on_task: boolean;
  is_published_automatically: boolean;
}

export interface DropdownOption<Value = any> {
  id: string | number;
  value: Value;
  label?: any;
  bg?: string;
  color?: string;

  [key: string]: any;
}

export interface Comment {
  pk: PrimaryKey;
  parent: PrimaryKey;
  task: PrimaryKey;
  author: User;
  content: string;
  children: Array<Comment> | null;
  updated_at: string;
  created_at: string;
}

export type TaskStatusStr =
  "pending" |
  "recommended" |
  "recommendation_declined" |
  "review" |
  "scheduled" |
  "in_progress" |
  "completed" |
  "failed" |
  "archived";
