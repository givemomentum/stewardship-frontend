export type PrimaryKey = number;

export interface User {
  pk: PrimaryKey;
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
