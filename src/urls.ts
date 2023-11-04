import { PrimaryKey } from "~/apps/auth/interfaces";

export namespace urls {
  export const portfolios = {
    portfolios: "/portfolios/",
    portfolio: (id: PrimaryKey) => `/portfolios/portfolio/${id}`,
    donor: (portfolioId: PrimaryKey, donorId: PrimaryKey) => `/portfolios/portfolio/${portfolioId}/donor/${donorId}`,
    skipRec: (id: PrimaryKey) => `/portfolios/skip/${id}/`,
    contactDonor: function (id: PrimaryKey, donorId: PrimaryKey, recId?: PrimaryKey, isSkipMode = false) {
      const recQueryParam = recId ? `?rec_id=${recId}` : "";
      const skipQueryParam = isSkipMode ? `&mode=skip` : "";
      return `/portfolios/portfolio/${id}/donor/${donorId}/contact${recQueryParam}${skipQueryParam}`;
    },
  };

  export const emails = {
    base: "/emails/",
    batches: {
      list: "/emails/batches",
      edit: (batchPk: number) => `/emails/batch-${batchPk}/edit`,
    },
  };
}
