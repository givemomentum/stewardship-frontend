export namespace urls {
  export const isCurrentPage = (url: string) => window.location.pathname === url;

  export const tasks = {
    list: "/tasks",
    detail: (slug: string) => `/tasks/${slug}`,
  };

  export const fiscExport = {
    list: "/fisc-exports",
    detail: (id: number | string) => `/fisc-exports/${id}/`,
    detailScans: (id: number, date: string) => `/fisc-exports/${id}/scans/${date}/`,
  };

  export const letterSegments = {
    list: "/letter-segments",
  };

  export const lettersBatches = {
    list: "/letter-batches",
  };

  export const organization = "/organization";
  export const account = "/account";

  export const donorPerfect = {
    donor: (id: number | string) => `https://www.donorperfect.net/prod/ScreenDesigner/Donor/Edit/${id}`,
  };
}
