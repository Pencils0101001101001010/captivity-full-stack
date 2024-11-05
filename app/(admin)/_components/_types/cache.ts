import { Collections, UserCounts } from "./counts";

type CacheData = {
  userCounts: UserCounts | null;
  collections: Collections | null;
  lastFetched: number;
  isFetching: boolean;
};

export const cache: CacheData = {
  userCounts: null,
  collections: null,
  lastFetched: 0,
  isFetching: false,
};
