import { Collections, UserCounts } from "./counts";

export const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const INITIAL_USER_COUNTS: UserCounts = {
  pendingApproval: 0,
  customers: 0,
  subscribers: 0,
  promo: 0,
  distributors: 0,
  shopManagers: 0,
  editors: 0,
};

export const INITIAL_COLLECTIONS: Collections = {
  summer: { totalCount: 0, publishedCount: 0, unpublishedCount: 0 },
  fashion: { totalCount: 0, publishedCount: 0, unpublishedCount: 0 },
  industrial: { totalCount: 0, publishedCount: 0, unpublishedCount: 0 },
  kids: { totalCount: 0, publishedCount: 0, unpublishedCount: 0 },
  african: { totalCount: 0, publishedCount: 0, unpublishedCount: 0 },
  leisure: { totalCount: 0, publishedCount: 0, unpublishedCount: 0 },
  signature: { totalCount: 0, publishedCount: 0, unpublishedCount: 0 },
  sport: { totalCount: 0, publishedCount: 0, unpublishedCount: 0 },
  winter: { totalCount: 0, publishedCount: 0, unpublishedCount: 0 },
  camo: { totalCount: 0, publishedCount: 0, unpublishedCount: 0 },
  baseball: { totalCount: 0, publishedCount: 0, unpublishedCount: 0 },
};
