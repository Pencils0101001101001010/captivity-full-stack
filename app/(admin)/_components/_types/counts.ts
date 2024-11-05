export type UserCounts = {
  pendingApproval: number;
  customers: number;
  subscribers: number;
  promo: number;
  distributors: number;
  shopManagers: number;
  editors: number;
};

export type CollectionCounts = {
  totalCount: number;
  publishedCount: number;
  unpublishedCount: number;
};

export type Collections = {
  [key: string]: CollectionCounts;
};

export type MenuLink = {
  name: string;
  href: string;
  count?: number;
};

export type MenuItem = {
  title: string;
  links: MenuLink[];
};
