export type MenuLink = {
  name: string;
  href: string;
  count?: number;
};

export type MenuItem = {
  title: string;
  links: MenuLink[];
};
