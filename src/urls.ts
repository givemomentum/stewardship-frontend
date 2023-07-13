import { PrimaryKey } from "~/apps/auth/interfaces";

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
    portfolio: (id: PrimaryKey) => `/portfolios/portfolio/${id}`,
    donor: (portfolioId: PrimaryKey, donorId: PrimaryKey) => `/portfolios/portfolio/${portfolioId}/donor/${donorId}`,
    skipRec: (id: PrimaryKey) => `/portfolios/skip/${id}/`,
    contactDonor: function (id: PrimaryKey, donorId: PrimaryKey, recId?: PrimaryKey) {
      const reqQueryParam = recId ? `?rec_id=${recId}` : "";
      return `/portfolios/portfolio/${id}/donor/${donorId}/contact${reqQueryParam}`;
    },
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
