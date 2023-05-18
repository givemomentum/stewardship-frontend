export namespace urls {
  export const isCurrentPage = (url: string) => window.location.pathname === url;

  export const tasks = {
    list: "/tasks",
    listAll: "/tasks/all",
    detail: (slug: string) => `/tasks/${slug}`,
    detailRec: (taskSlug: string, recSlug: string) => `/tasks/${taskSlug}/recs/${recSlug}`,
  };

  export const portfolios = {
    portfolios: "/portfolios/",
    portfolio: (id: string) => `/portfolios/${id}/portfolio`,
    skipRec: (id: string) => `/portfolios/skip/${id}/`,
  };

  export const fiscExport = {
    list: "/fisc-exports",
    detail: (id: number | string) => `/fisc-exports/${id}/`,
    detailScans: (id: number, date: string) => `/fisc-exports/${id}/scans/${date}/`,
  };

  export const partners = {
    hor: {
      donationList: "/partners/hor/donation-list",
    },
  };

  export const emails = {
    base: "/emails/",
    batches: {
      list: "/emails/batches",
      edit: (batchPk: number) => `/emails/batch-${batchPk}/edit`,
    },
  };

  export const letters = {
    segmentList: "/letters/segments",
    archive: "/letters/archive",
    batchLettersList: (batchPk: number) => `/letters/segments/batches/${batchPk}/letters`,
  };

  export const organization = "/organization";
  export const account = "/account";

  export const donorPerfect = {
    donor: (id: number | string) => `https://www.donorperfect.net/prod/ScreenDesigner/Donor/Edit/${id}`,
  };
}
