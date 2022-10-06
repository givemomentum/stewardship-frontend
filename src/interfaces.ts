export type PrimaryKey = number;

export interface User {
  pk: PrimaryKey;
  email: string;
  first_name: string;
  last_name: string;
  is_staff: boolean;
}

export interface Task {
  pk: PrimaryKey;
  slug: string;
  title: string;
  description: string;
  description_short: string;
  description_plaintext: string;
  donors: any[];
  status: TaskStatusStr;
  author: User;
  author_pk: PrimaryKey;
  assignees: User[];
  assignees_pks: PrimaryKey[];
  org: PrimaryKey;
  created_at: string;
  comments: Comment[];
  comments_count: number;
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

export interface FiscExport {
  pk: PrimaryKey;
  org: PrimaryKey;
  date: string;
  is_downloaded: boolean;
  export_url: string;
  num_scans: number;
  num_gifts: number;
  donation_total: number;
  file_name: string;
}
