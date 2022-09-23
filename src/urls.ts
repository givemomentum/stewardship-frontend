export namespace urls {
  export enum accounts {
    login = "/accounts/login",
    signup = "/accounts/signup",
  }

  export const isCurrentPage = (url: string) => window.location.pathname === url;
}
