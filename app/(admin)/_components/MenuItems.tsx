export const menuItems = [
  {
    title: "USERS",
    links: [
      { name: "Pending Approval", href: "/admin/dashboard", count: 5 },
      { name: "Customers", href: "/admin/dashboard/analytics" },
      { name: "Distributors", href: "/admin/dashboard/analytics" },
      { name: "Editors", href: "/admin/dashboard/analytics" },
      { name: "Promo Customers", href: "/admin/dashboard/analytics" },
      { name: "Shop Managers", href: "/admin/dashboard/analytics" },
      { name: "Subscribers", href: "/admin/dashboard/analytics" },
    ],
  },
  {
    title: "Products",
    links: [
      { name: "All Products", href: "/admin/products" },
      { name: "Add Product", href: "/admin/products/add" },
    ],
  },
  {
    title: "Categories",
    links: [
      { name: "All Categories", href: "/admin/categories" },
      { name: "Add Category", href: "/admin/categories/add" },
    ],
  },
  {
    title: "Orders",
    links: [
      { name: "All Orders", href: "/admin/orders" },
      { name: "Pending Orders", href: "/admin/orders/pending" },
    ],
  },
  {
    title: "Customers",
    links: [
      { name: "All Customers", href: "/admin/customers" },
      { name: "Customer Groups", href: "/admin/customers/groups" },
    ],
  },
  {
    title: "Marketing",
    links: [
      { name: "Promotions", href: "/admin/marketing/promotions" },
      { name: "Discounts", href: "/admin/marketing/discounts" },
    ],
  },
  {
    title: "Settings",
    links: [
      { name: "General", href: "/admin/settings" },
      { name: "Security", href: "/admin/settings/security" },
    ],
  },
  {
    title: "Reports",
    links: [
      { name: "Sales Report", href: "/admin/reports/sales" },
      { name: "Inventory Report", href: "/admin/reports/inventory" },
    ],
  },
];
