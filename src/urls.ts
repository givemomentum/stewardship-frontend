export namespace urls {
  export const isCurrentPage = (url: string) => window.location.pathname === url;

  export const fiscExport = {
    list: "/fisc-exports/",
    detail: (id: number | string) => `/fisc-exports/${id}/`,
    detailScans: (id: number, date: string) => `/fisc-exports/${id}/scans/${date}/`,
  };
}
