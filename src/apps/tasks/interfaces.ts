import { PrimaryKey, User } from "~/apps/auth/interfaces";
import { CrmGift } from "~/apps/letters/interfaces";

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
  recommendation_set?: RecommendationSet;
}

export interface Recommendation {
  pk: PrimaryKey;
  donor?: any;
  gift?: CrmGift;
  explanation: string;
  is_completed: boolean;
}

export interface RecommendationSet {
  pk: PrimaryKey;
  recommendations: Recommendation[];
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
