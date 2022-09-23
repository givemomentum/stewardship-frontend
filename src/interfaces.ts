export type PrimaryKey = number;

export interface User {
  email: string;
  first_name: string;
  last_name: string;
}

export interface Task {
  pk: PrimaryKey;
  title: string;
  description: string;
  description_short: string;
  donors: any[];
  status: TaskStatus;
  author: User;
  assignees: User[];
  assignees_pks: PrimaryKey[];
  org: PrimaryKey;
  created_at: string;
}

export type TaskStatus = 
  "draft" |
  "pending" |
  "recommended" |
  "recommendation_declined" |
  "review" |
  "scheduled" |
  "in_progress" |
  "completed" |
  "failed" |
  "archived";
