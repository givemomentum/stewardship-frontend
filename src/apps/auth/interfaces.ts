export type PrimaryKey = number;

export type UrlString = string;

export interface Org {
  pk: PrimaryKey;
  slug: string | "kessler" | "hor" | "ysgn";
  name: string;
  domain: string;
  contact_first_name: string;
  contact_last_name: string;
  support_email: string;
  is_enable_app_emails: boolean;
  is_enable_app_letters: boolean;
  is_enable_beta_features: boolean;
}

export interface BlackbaudConnection {
  linked_entity_name: string;
  linked_user_email: string;
  connection_successful: boolean;
}

export interface SalesforceConnection {
  sf_username: string;
  connection_successful: boolean;
}

export interface AdminOrg extends Org {
  blackbaud_connection?: BlackbaudConnection;
  salesforce_connection?: SalesforceConnection;
}

export interface OrgMembership {
  org: Org;
  is_org_admin: boolean;
}

export interface User {
  pk: PrimaryKey;
  email: string;
  avatar?: UrlString;
  first_name: string;
  last_name: string;
  position: string;
  is_momentum_admin: boolean;
  membership?: OrgMembership;
}
