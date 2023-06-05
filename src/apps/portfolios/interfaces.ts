import { PrimaryKey, User } from "~/apps/auth/interfaces";

export interface PortfolioPlan {
  id: string;
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
