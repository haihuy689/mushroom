import type { SiteLocale } from "@/lib/i18n";

export type OrderCenterCopy = {
  allOrders: string;
  browseShop: string;
  delivered: string;
  latestOrdersTitle: string;
  menuGuestHint: string;
  menuNoOrders: string;
  menuSignedInHint: string;
  openCart: string;
  orderCodeLabel: string;
  orders: string;
  ordersAria: string;
  ordersEmptyBody: string;
  ordersEmptyTitle: string;
  ordersLead: string;
  ordersPageDescription: string;
  ordersPageTitle: string;
  ordersTitle: string;
  processing: string;
  shipping: string;
  statusSummaryTitle: string;
  updatedLabel: string;
  viewAllOrders: string;
};

const copy: Record<SiteLocale, OrderCenterCopy> = {
  en: {
    allOrders: "All",
    browseShop: "Browse shop",
    delivered: "Delivered",
    latestOrdersTitle: "Latest orders",
    menuGuestHint: "Track your cart and orders from one shopper menu.",
    menuNoOrders: "No orders yet.",
    menuSignedInHint: "Review your cart, orders, and current delivery state here.",
    openCart: "Open cart",
    orderCodeLabel: "Order code",
    orders: "Orders",
    ordersAria: "Open orders",
    ordersEmptyBody:
      "Your successful Pi orders will appear here for follow-up tracking.",
    ordersEmptyTitle: "No orders yet",
    ordersLead:
      "This order center keeps your Mushroom.Pi purchases organized with clear stages for processing, shipping, and delivered.",
    ordersPageDescription:
      "Track Mushroom.Pi orders by processing, shipping, and delivered states.",
    ordersPageTitle: "Orders | Mushroom.Pi",
    ordersTitle: "Order center",
    processing: "Processing",
    shipping: "Shipping",
    statusSummaryTitle: "Order status",
    updatedLabel: "Updated",
    viewAllOrders: "View all orders",
  },
  vi: {
    allOrders: "T\u1ea5t c\u1ea3",
    browseShop: "V\u00e0o shop",
    delivered: "\u0110\u00e3 giao",
    latestOrdersTitle: "\u0110\u01a1n g\u1ea7n \u0111\u00e2y",
    menuGuestHint:
      "Theo d\u00f5i gi\u1ecf h\u00e0ng v\u00e0 \u0111\u01a1n h\u00e0ng ngay trong menu mua s\u1eafm.",
    menuNoOrders: "Ch\u01b0a c\u00f3 \u0111\u01a1n n\u00e0o.",
    menuSignedInHint:
      "Xem gi\u1ecf h\u00e0ng, \u0111\u01a1n h\u00e0ng v\u00e0 tr\u1ea1ng th\u00e1i giao h\u00e0ng ngay t\u1ea1i \u0111\u00e2y.",
    openCart: "M\u1edf gi\u1ecf h\u00e0ng",
    orderCodeLabel: "M\u00e3 \u0111\u01a1n",
    orders: "\u0110\u01a1n h\u00e0ng",
    ordersAria: "M\u1edf \u0111\u01a1n h\u00e0ng",
    ordersEmptyBody:
      "Khi thanh to\u00e1n Pi th\u00e0nh c\u00f4ng, \u0111\u01a1n s\u1ebd hi\u1ec7n \u1edf \u0111\u00e2y \u0111\u1ec3 theo d\u00f5i.",
    ordersEmptyTitle: "Ch\u01b0a c\u00f3 \u0111\u01a1n h\u00e0ng",
    ordersLead:
      "Trung t\u00e2m n\u00e0y gom c\u00e1c \u0111\u01a1n Mushroom.Pi theo ki\u1ec3u storefront, gi\u00fap ng\u01b0\u1eddi d\u00f9ng nh\u00ecn nhanh \u0111ang x\u1eed l\u00fd, \u0111ang giao hay \u0111\u00e3 giao.",
    ordersPageDescription:
      "Theo d\u00f5i \u0111\u01a1n Mushroom.Pi theo c\u00e1c tr\u1ea1ng th\u00e1i x\u1eed l\u00fd, \u0111ang giao v\u00e0 \u0111\u00e3 giao.",
    ordersPageTitle: "\u0110\u01a1n h\u00e0ng | Mushroom.Pi",
    ordersTitle: "Trung t\u00e2m \u0111\u01a1n h\u00e0ng",
    processing: "\u0110ang x\u1eed l\u00fd",
    shipping: "\u0110ang giao",
    statusSummaryTitle: "Tr\u1ea1ng th\u00e1i \u0111\u01a1n",
    updatedLabel: "C\u1eadp nh\u1eadt",
    viewAllOrders: "Xem t\u1ea5t c\u1ea3 \u0111\u01a1n",
  },
  es: {
    allOrders: "Todos",
    browseShop: "Ver tienda",
    delivered: "Entregado",
    latestOrdersTitle: "Pedidos recientes",
    menuGuestHint:
      "Controla tu carrito y tus pedidos desde un solo menu de compra.",
    menuNoOrders: "Aun no hay pedidos.",
    menuSignedInHint:
      "Revisa tu carrito, pedidos y estado de entrega desde aqui.",
    openCart: "Abrir carrito",
    orderCodeLabel: "Codigo",
    orders: "Pedidos",
    ordersAria: "Abrir pedidos",
    ordersEmptyBody:
      "Tus pedidos pagados con Pi apareceran aqui para seguimiento.",
    ordersEmptyTitle: "Aun no hay pedidos",
    ordersLead:
      "Este centro organiza las compras de Mushroom.Pi con etapas claras para procesamiento, envio y entrega.",
    ordersPageDescription:
      "Sigue los pedidos de Mushroom.Pi por procesamiento, envio y entregado.",
    ordersPageTitle: "Pedidos | Mushroom.Pi",
    ordersTitle: "Centro de pedidos",
    processing: "Procesando",
    shipping: "En camino",
    statusSummaryTitle: "Estado del pedido",
    updatedLabel: "Actualizado",
    viewAllOrders: "Ver todos los pedidos",
  },
  fr: {
    allOrders: "Tous",
    browseShop: "Voir la boutique",
    delivered: "Livre",
    latestOrdersTitle: "Commandes recentes",
    menuGuestHint:
      "Suivez votre panier et vos commandes depuis un seul menu client.",
    menuNoOrders: "Aucune commande pour le moment.",
    menuSignedInHint:
      "Consultez panier, commandes et statut de livraison ici.",
    openCart: "Ouvrir le panier",
    orderCodeLabel: "Code commande",
    orders: "Commandes",
    ordersAria: "Ouvrir les commandes",
    ordersEmptyBody:
      "Vos commandes payees avec Pi apparaitront ici pour le suivi.",
    ordersEmptyTitle: "Aucune commande pour le moment",
    ordersLead:
      "Ce centre regroupe les achats Mushroom.Pi avec des etapes lisibles pour la preparation, l'expedition et la livraison.",
    ordersPageDescription:
      "Suivez les commandes Mushroom.Pi par preparation, expedition et livraison.",
    ordersPageTitle: "Commandes | Mushroom.Pi",
    ordersTitle: "Centre de commandes",
    processing: "Preparation",
    shipping: "Expedition",
    statusSummaryTitle: "Statut des commandes",
    updatedLabel: "Mise a jour",
    viewAllOrders: "Voir toutes les commandes",
  },
  zh: {
    allOrders: "\u5168\u90e8",
    browseShop: "\u524d\u5f80\u5546\u5e97",
    delivered: "\u5df2\u9001\u8fbe",
    latestOrdersTitle: "\u6700\u8fd1\u8ba2\u5355",
    menuGuestHint:
      "\u5728\u4e00\u4e2a\u8d2d\u7269\u83dc\u5355\u91cc\u8ddf\u8e2a\u8d2d\u7269\u8f66\u548c\u8ba2\u5355\u3002",
    menuNoOrders: "\u8fd8\u6ca1\u6709\u8ba2\u5355\u3002",
    menuSignedInHint:
      "\u53ef\u4ee5\u5728\u8fd9\u91cc\u67e5\u770b\u8d2d\u7269\u8f66\u3001\u8ba2\u5355\u548c\u5f53\u524d\u914d\u9001\u72b6\u6001\u3002",
    openCart: "\u6253\u5f00\u8d2d\u7269\u8f66",
    orderCodeLabel: "\u8ba2\u5355\u53f7",
    orders: "\u8ba2\u5355",
    ordersAria: "\u6253\u5f00\u8ba2\u5355",
    ordersEmptyBody:
      "\u6210\u529f\u7684 Pi \u8ba2\u5355\u4f1a\u51fa\u73b0\u5728\u8fd9\u91cc\u4f9b\u4f60\u7ee7\u7eed\u8ddf\u8e2a\u3002",
    ordersEmptyTitle: "\u8fd8\u6ca1\u6709\u8ba2\u5355",
    ordersLead:
      "\u8fd9\u4e2a\u8ba2\u5355\u4e2d\u5fc3\u4ee5 storefront \u65b9\u5f0f\u6574\u7406 Mushroom.Pi \u7684\u8d2d\u7269\u8bb0\u5f55\uff0c\u65b9\u4fbf\u67e5\u770b\u5904\u7406\u4e2d\u3001\u8fd0\u9001\u4e2d\u548c\u5df2\u9001\u8fbe\u3002",
    ordersPageDescription:
      "\u6309\u5904\u7406\u4e2d\u3001\u8fd0\u9001\u4e2d\u3001\u5df2\u9001\u8fbe\u8ddf\u8e2a Mushroom.Pi \u8ba2\u5355\u3002",
    ordersPageTitle: "\u8ba2\u5355 | Mushroom.Pi",
    ordersTitle: "\u8ba2\u5355\u4e2d\u5fc3",
    processing: "\u5904\u7406\u4e2d",
    shipping: "\u914d\u9001\u4e2d",
    statusSummaryTitle: "\u8ba2\u5355\u72b6\u6001",
    updatedLabel: "\u66f4\u65b0",
    viewAllOrders: "\u67e5\u770b\u5168\u90e8\u8ba2\u5355",
  },
};

export function getOrderCenterCopy(locale: SiteLocale) {
  return copy[locale];
}
