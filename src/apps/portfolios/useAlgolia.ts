import algoliasearch, { SearchClient } from "algoliasearch";
import { PortfolioPlan } from "~/apps/portfolios/interfaces";


export type SortAttribute = "donated_total" | "name" | "last_gift_date" | "expected_gift_date" | "season_progress" | "last_contact_date" | null;

const state = {
  refreshKey: ref(0),
  searchClient: ref(null as SearchClient | null),
  sortByAttribute: ref(null as SortAttribute),
  sortOrder: ref('asc' as 'asc' | 'desc' | null),
};

export function useAlgolia() {
  return {
    refreshKey: state.refreshKey,
    sortByAttribute: state.sortByAttribute,
    searchClient: state.searchClient,
    sortOrder: state.sortOrder,
    init: (portfolio: PortfolioPlan) => {
      state.searchClient.value = algoliasearch(
        portfolio.algolia_creds.app_id,
        portfolio.algolia_creds.api_key,
      );
    },
    reloadPortfolio: () => {
      state.searchClient.value?.clearCache();
      state.refreshKey.value += 1;
    },

    // gpt4 code below

    toggleSortBy(attribute: SortAttribute) {
      if (state.sortByAttribute.value === attribute) {
        // If the same attribute is selected, check the current sortOrder
        if (state.sortOrder.value === 'desc') {
          // If the sortOrder is 'desc', set both to null for no sorting
          state.sortOrder.value = null;
          state.sortByAttribute.value = null;
        } else {
          // Otherwise, toggle the sort order to 'desc'
          state.sortOrder.value = 'desc';
        }
      } else {
        // If a different attribute is selected, start with ascending order
        state.sortByAttribute.value = attribute;
        state.sortOrder.value = 'asc';
      }
      state.refreshKey.value += 1;
    },
    transformItems: (items: Array<any>) => {
      return items.sort((a, b) => {
        const result = a[state.sortByAttribute.value] < b[state.sortByAttribute.value] ? -1 :
          a[state.sortByAttribute.value] > b[state.sortByAttribute.value] ? 1 : 0;
        // Reverse the result for descending order
        const itemsResult = state.sortOrder.value === "desc" ? -result : result;
        return itemsResult;
      });
    },
  }
}
