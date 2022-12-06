import { PrimaryKey, User } from "~/apps/auth/interfaces";
import { CrmDonor, CrmGift } from "~/apps/letters/interfaces";

export interface Task {
  pk: PrimaryKey;
  email_batch?: PrimaryKey;
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
  is_completed: boolean;  // Deprecated
  state: "new" | "completed" | "dismissed";
}

export interface RecommendationSet {
  pk: PrimaryKey;
  recs: Recommendation[];
  type: "donors" | "gifts" | "letters" | "donor_emails";
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
