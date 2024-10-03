export type NavItem = {
    href: string;
    icon: React.ElementType;
    label: string;
    subItems?: NavItem[];
  };
  
  export type Section = {
    section: string;
    items: NavItem[];
  };

export const navItems: Section[] = [
    {
      section: "USERS",
      items: [
        { href: "/admin/update/user-role", icon: Home, label: "UPDATE ROLES" },
      ],
    },
    {
      section: "PRODUCTS",
      items: [
        {
          href: "/admin/products",
          icon: FileText,
          label: "PRODUCTS",
          subItems: [
            {
              href: "/headwear",
              icon: FileText,
              label: "HEADWEAR",
              subItems: [
                {
                  href: "/leisure-collection",
                  icon: FileText,
                  label: "LEISURE",
                },
                {
                  href: "/industrial-collection",
                  icon: FileText,
                  label: "INDUSTRIAL",
                },
                {
                  href: "/signature-collection",
                  icon: FileText,
                  label: "SIGNATURE",
                },
                {
                  href: "/baseball-collection",
                  icon: FileText,
                  label: "BASEBALL",
                },
                {
                  href: "/fashion-collection",
                  icon: FileText,
                  label: "FASHION",
                },
                {
                  href: "/sport-collection",
                  icon: FileText,
                  label: "SPORT",
                },
                {
                  href: "/multi-functional-collection",
                  icon: FileText,
                  label: "MULTI-FUNC",
                },
                {
                  href: "/new-in-headwear-collection",
                  icon: FileText,
                  label: "NEW",
                },
                {
                  href: "/african-collection",
                  icon: FileText,
                  label: "AFRICAN",
                },
              ],
            },
            {
              href: "/apparel",
              icon: FileText,
              label: "APPAREL",
              subItems: [
                {
                  href: "/new-in-apparel-collection",
                  icon: FileText,
                  label: "NEW",
                },
                {
                  href: "/men-collection",
                  icon: FileText,
                  label: "MEN",
                },
                {
                  href: "/woman-collection",
                  icon: FileText,
                  label: "WOMAN",
                },
                {
                  href: "/kids-collection",
                  icon: FileText,
                  label: "KIDS",
                },
                {
                  href: "/t-shirts-collection",
                  icon: FileText,
                  label: "T-SHIRTS",
                },
                {
                  href: "/golfers-collection",
                  icon: FileText,
                  label: "GOLFERS",
                },
                {
                  href: "/hoodies-collection",
                  icon: FileText,
                  label: "HOODIES",
                },
                {
                  href: "/jackets-collection",
                  icon: FileText,
                  label: "JACKETS",
                },
                {
                  href: "/bottoms-collection",
                  icon: FileText,
                  label: "BOTTOMS",
                },
              ],
            },
            {
              href: "/all-collections",
              icon: FileText,
              label: "ALL COLLECTIONS",
              subItems: [
                {
                  href: "/signature",
                  icon: FileText,
                  label: "SIGNATURE",
                },
                {
                  href: "/baseball",
                  icon: FileText,
                  label: "BASEBALL",
                },
                {
                  href: "/fashion",
                  icon: FileText,
                  label: "FASHION",
                },
                {
                  href: "/leisure",
                  icon: FileText,
                  label: "LEISURE",
                },
                {
                  href: "/sport",
                  icon: FileText,
                  label: "SPORT",
                },
                {
                  href: "/industrial",
                  icon: FileText,
                  label: "INDUSTRIAL",
                },
                {
                  href: "/camo",
                  icon: FileText,
                  label: "CAMO",
                },
                {
                  href: "/summer",
                  icon: FileText,
                  label: "SUMMER",
                },
                {
                  href: "/winter",
                  icon: FileText,
                  label: "WINTER",
                },
                {
                  href: "/kids",
                  icon: FileText,
                  label: "KIDS",
                },
                {
                  href: "/african",
                  icon: FileText,
                  label: "AFRICAN",
                },
              ],
            },
          ],
        },
        { href: "/admin/products/create", icon: FileText, label: "CREATE" },
      ],
    },
  ];