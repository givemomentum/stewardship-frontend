export type PrimaryKey = number;

export type UrlString = string;

export interface Org {
  pk: PrimaryKey;
  name: string;
  contact_first_name: string;
  contact_last_name: string;
  support_email: string;
}

export interface BlackbaudConnection {
  linked_entity_name: string;
  linked_user_email: string;
  connection_successful: boolean;
}

export interface AdminOrg extends Org {
  blackbaud_connection?: BlackbaudConnection;
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
  is_staff: boolean;
  membership?: OrgMembership;
}
