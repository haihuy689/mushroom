import type { SiteLocale } from "@/lib/i18n";

export type OrderCenterCopy = {
  allOrders: string;
  browseShop: string;
  carrierLabel: string;
  confirmed: string;
  delivered: string;
  deliveryAddressLabel: string;
  deliveryDetailsTitle: string;
  expandDetails: string;
  hideDetails: string;
  latestOrdersTitle: string;
  menuGuestHint: string;
  menuNoOrders: string;
  menuSignedInHint: string;
  openCart: string;
  orderCodeLabel: string;
  orderItemsTitle: string;
  orders: string;
  ordersAria: string;
  ordersEmptyBody: string;
  ordersEmptyTitle: string;
  ordersLead: string;
  ordersPageDescription: string;
  ordersPageTitle: string;
  ordersTitle: string;
  paymentDetailsTitle: string;
  paymentFailedNotice: string;
  paymentPendingNotice: string;
  paid: string;
  paymentFailed: string;
  pendingPayment: string;
  placedAtLabel: string;
  preparing: string;
  receiverLabel: string;
  refreshOrders: string;
  refreshingOrders: string;
  retryPayment: string;
  retryPaymentSuccess: string;
  retryingPayment: string;
  shipperLabel: string;
  shipping: string;
  statusSummaryTitle: string;
  syncFailed: string;
  syncSuccess: string;
  totalLabel: string;
  trackingCodeLabel: string;
  updatedLabel: string;
  viewAllOrders: string;
};

const copy: Record<SiteLocale, OrderCenterCopy> = {
  en: {
    allOrders: "All",
    browseShop: "Browse shop",
    carrierLabel: "Carrier",
    confirmed: "Buyer confirmed",
    delivered: "Delivered",
    deliveryAddressLabel: "Delivery address",
    deliveryDetailsTitle: "Delivery details",
    expandDetails: "View details",
    hideDetails: "Hide details",
    latestOrdersTitle: "Latest orders",
    menuGuestHint: "Track your cart and orders from one shopper menu.",
    menuNoOrders: "No orders yet.",
    menuSignedInHint: "Review your cart, orders, and current delivery state here.",
    openCart: "Open cart",
    orderCodeLabel: "Order code",
    orderItemsTitle: "Items",
    orders: "Orders",
    ordersAria: "Open orders",
    ordersEmptyBody:
      "Your successful Pi orders will appear here for follow-up tracking.",
    ordersEmptyTitle: "No orders yet",
    ordersLead:
      "This order center keeps your Mushroom.Pi purchases organized from payment to preparation, shipping, and delivery.",
    ordersPageDescription:
      "Track Mushroom.Pi orders by payment and delivery states.",
    ordersPageTitle: "Orders | Mushroom.Pi",
    ordersTitle: "Order center",
    paymentDetailsTitle: "Payment",
    paymentFailedNotice:
      "This order has not been paid successfully. Please return to checkout and create a new Pi payment when you are ready.",
    paymentPendingNotice:
      "This order is waiting for Pi payment confirmation. If payment was not completed, please checkout again.",
    paid: "Paid",
    paymentFailed: "Payment failed",
    pendingPayment: "Awaiting payment",
    placedAtLabel: "Placed",
    preparing: "Preparing",
    receiverLabel: "Receiver",
    refreshOrders: "Refresh orders",
    refreshingOrders: "Refreshing...",
    retryPayment: "Pay this order",
    retryPaymentSuccess: "Payment completed for this order.",
    retryingPayment: "Opening Pi payment...",
    shipperLabel: "Shipper",
    shipping: "Shipping",
    statusSummaryTitle: "Order status",
    syncFailed: "Could not refresh orders. Please try again.",
    syncSuccess: "Orders refreshed.",
    totalLabel: "Total",
    trackingCodeLabel: "Tracking code",
    updatedLabel: "Updated",
    viewAllOrders: "View all orders",
  },
  vi: {
    allOrders: "T\u1ea5t c\u1ea3",
    browseShop: "V\u00e0o shop",
    carrierLabel: "Đơn vị vận chuyển",
    confirmed: "Ng\u01b0\u1eddi mua \u0111\u00e3 x\u00e1c nh\u1eadn",
    delivered: "\u0110\u00e3 giao",
    deliveryAddressLabel: "Địa chỉ nhận hàng",
    deliveryDetailsTitle: "Thông tin giao hàng",
    expandDetails: "Xem chi tiết",
    hideDetails: "Thu gọn",
    latestOrdersTitle: "\u0110\u01a1n g\u1ea7n \u0111\u00e2y",
    menuGuestHint:
      "Theo d\u00f5i gi\u1ecf h\u00e0ng v\u00e0 \u0111\u01a1n h\u00e0ng ngay trong menu mua s\u1eafm.",
    menuNoOrders: "Ch\u01b0a c\u00f3 \u0111\u01a1n n\u00e0o.",
    menuSignedInHint:
      "Xem gi\u1ecf h\u00e0ng, \u0111\u01a1n h\u00e0ng v\u00e0 tr\u1ea1ng th\u00e1i giao h\u00e0ng ngay t\u1ea1i \u0111\u00e2y.",
    openCart: "M\u1edf gi\u1ecf h\u00e0ng",
    orderCodeLabel: "M\u00e3 \u0111\u01a1n",
    orderItemsTitle: "Sản phẩm trong đơn",
    orders: "\u0110\u01a1n h\u00e0ng",
    ordersAria: "M\u1edf \u0111\u01a1n h\u00e0ng",
    ordersEmptyBody:
      "\u0110\u01a1n \u0111ang ch\u1edd thanh to\u00e1n, thanh to\u00e1n th\u1ea5t b\u1ea1i ho\u1eb7c \u0111\u00e3 thanh to\u00e1n s\u1ebd hi\u1ec7n \u1edf \u0111\u00e2y \u0111\u1ec3 theo d\u00f5i.",
    ordersEmptyTitle: "Ch\u01b0a c\u00f3 \u0111\u01a1n h\u00e0ng",
    ordersLead:
      "Theo d\u00f5i \u0111\u01a1n Mushroom.Pi t\u1eeb l\u00fac ch\u1edd thanh to\u00e1n, \u0111\u00e3 thanh to\u00e1n, \u0111ang so\u1ea1n h\u00e0ng, \u0111ang giao \u0111\u1ebfn khi \u0111\u00e3 giao.",
    ordersPageDescription:
      "Theo d\u00f5i \u0111\u01a1n Mushroom.Pi theo c\u00e1c tr\u1ea1ng th\u00e1i thanh to\u00e1n v\u00e0 giao h\u00e0ng.",
    ordersPageTitle: "\u0110\u01a1n h\u00e0ng | Mushroom.Pi",
    ordersTitle: "Trung t\u00e2m \u0111\u01a1n h\u00e0ng",
    paymentDetailsTitle: "Thanh toán",
    paymentFailedNotice:
      "\u0110\u01a1n n\u00e0y ch\u01b0a thanh to\u00e1n th\u00e0nh c\u00f4ng. H\u00e3y quay l\u1ea1i gi\u1ecf h\u00e0ng v\u00e0 t\u1ea1o thanh to\u00e1n Pi m\u1edbi khi b\u1ea1n s\u1eb5n s\u00e0ng.",
    paymentPendingNotice:
      "\u0110\u01a1n n\u00e0y \u0111ang ch\u1edd x\u00e1c nh\u1eadn thanh to\u00e1n Pi. N\u1ebfu b\u1ea1n ch\u01b0a ho\u00e0n t\u1ea5t thanh to\u00e1n, h\u00e3y thanh to\u00e1n l\u1ea1i t\u1eeb gi\u1ecf h\u00e0ng.",
    paid: "\u0110\u00e3 thanh to\u00e1n",
    paymentFailed: "Thanh to\u00e1n th\u1ea5t b\u1ea1i",
    pendingPayment: "Ch\u1edd thanh to\u00e1n",
    placedAtLabel: "Ngày đặt",
    preparing: "\u0110ang so\u1ea1n h\u00e0ng",
    receiverLabel: "Người nhận",
    refreshOrders: "Làm mới đơn hàng",
    refreshingOrders: "Đang làm mới...",
    retryPayment: "Thanh to\u00e1n \u0111\u01a1n n\u00e0y",
    retryPaymentSuccess: "\u0110\u00e3 thanh to\u00e1n th\u00e0nh c\u00f4ng cho \u0111\u01a1n n\u00e0y.",
    retryingPayment: "\u0110ang m\u1edf thanh to\u00e1n Pi...",
    shipperLabel: "Shipper",
    shipping: "\u0110ang giao",
    statusSummaryTitle: "Tr\u1ea1ng th\u00e1i \u0111\u01a1n",
    syncFailed: "Chưa thể làm mới đơn hàng. Bạn thử lại sau nhé.",
    syncSuccess: "Đã cập nhật đơn hàng mới nhất.",
    totalLabel: "Tổng cộng",
    trackingCodeLabel: "Mã vận đơn",
    updatedLabel: "C\u1eadp nh\u1eadt",
    viewAllOrders: "Xem t\u1ea5t c\u1ea3 \u0111\u01a1n",
  },
  es: {
    allOrders: "Todos",
    browseShop: "Ver tienda",
    carrierLabel: "Transportista",
    confirmed: "Confirmado por comprador",
    delivered: "Entregado",
    deliveryAddressLabel: "Direccion de entrega",
    deliveryDetailsTitle: "Entrega",
    expandDetails: "Ver detalles",
    hideDetails: "Ocultar detalles",
    latestOrdersTitle: "Pedidos recientes",
    menuGuestHint:
      "Controla tu carrito y tus pedidos desde un solo menu de compra.",
    menuNoOrders: "Aun no hay pedidos.",
    menuSignedInHint:
      "Revisa tu carrito, pedidos y estado de entrega desde aqui.",
    openCart: "Abrir carrito",
    orderCodeLabel: "Codigo",
    orderItemsTitle: "Productos",
    orders: "Pedidos",
    ordersAria: "Abrir pedidos",
    ordersEmptyBody:
      "Tus pedidos pagados con Pi apareceran aqui para seguimiento.",
    ordersEmptyTitle: "Aun no hay pedidos",
    ordersLead:
      "Este centro organiza tus compras de Mushroom.Pi desde el pago hasta la preparacion, envio y entrega.",
    ordersPageDescription:
      "Sigue los pedidos de Mushroom.Pi por procesamiento, envio y entregado.",
    ordersPageTitle: "Pedidos | Mushroom.Pi",
    ordersTitle: "Centro de pedidos",
    paymentDetailsTitle: "Pago",
    paymentFailedNotice:
      "Este pedido no se pago correctamente. Vuelve al checkout y crea un nuevo pago Pi cuando estes listo.",
    paymentPendingNotice:
      "Este pedido espera confirmacion de pago Pi. Si no terminaste el pago, vuelve al checkout.",
    paid: "Pagado",
    paymentFailed: "Pago fallido",
    pendingPayment: "Pendiente de pago",
    placedAtLabel: "Pedido",
    preparing: "Preparando",
    receiverLabel: "Recibe",
    refreshOrders: "Actualizar pedidos",
    refreshingOrders: "Actualizando...",
    retryPayment: "Pagar este pedido",
    retryPaymentSuccess: "Pago completado para este pedido.",
    retryingPayment: "Abriendo pago Pi...",
    shipperLabel: "Repartidor",
    shipping: "En camino",
    statusSummaryTitle: "Estado del pedido",
    syncFailed: "No se pudieron actualizar los pedidos. Intentalo de nuevo.",
    syncSuccess: "Pedidos actualizados.",
    totalLabel: "Total",
    trackingCodeLabel: "Codigo de seguimiento",
    updatedLabel: "Actualizado",
    viewAllOrders: "Ver todos los pedidos",
  },
  fr: {
    allOrders: "Tous",
    browseShop: "Voir la boutique",
    carrierLabel: "Transporteur",
    confirmed: "Confirmee par l'acheteur",
    delivered: "Livre",
    deliveryAddressLabel: "Adresse de livraison",
    deliveryDetailsTitle: "Livraison",
    expandDetails: "Voir le detail",
    hideDetails: "Masquer",
    latestOrdersTitle: "Commandes recentes",
    menuGuestHint:
      "Suivez votre panier et vos commandes depuis un seul menu client.",
    menuNoOrders: "Aucune commande pour le moment.",
    menuSignedInHint:
      "Consultez panier, commandes et statut de livraison ici.",
    openCart: "Ouvrir le panier",
    orderCodeLabel: "Code commande",
    orderItemsTitle: "Articles",
    orders: "Commandes",
    ordersAria: "Ouvrir les commandes",
    ordersEmptyBody:
      "Vos commandes payees avec Pi apparaitront ici pour le suivi.",
    ordersEmptyTitle: "Aucune commande pour le moment",
    ordersLead:
      "Ce centre regroupe les achats Mushroom.Pi du paiement a la preparation, l'expedition et la livraison.",
    ordersPageDescription:
      "Suivez les commandes Mushroom.Pi par preparation, expedition et livraison.",
    ordersPageTitle: "Commandes | Mushroom.Pi",
    ordersTitle: "Centre de commandes",
    paymentDetailsTitle: "Paiement",
    paymentFailedNotice:
      "Cette commande n'a pas ete payee correctement. Revenez au checkout et creez un nouveau paiement Pi quand vous etes pret.",
    paymentPendingNotice:
      "Cette commande attend la confirmation du paiement Pi. Si le paiement n'est pas termine, revenez au checkout.",
    paid: "Payee",
    paymentFailed: "Paiement echoue",
    pendingPayment: "Paiement en attente",
    placedAtLabel: "Commande",
    preparing: "Preparation",
    receiverLabel: "Receptionnaire",
    refreshOrders: "Actualiser",
    refreshingOrders: "Actualisation...",
    retryPayment: "Payer cette commande",
    retryPaymentSuccess: "Paiement termine pour cette commande.",
    retryingPayment: "Ouverture du paiement Pi...",
    shipperLabel: "Livreur",
    shipping: "Expedition",
    statusSummaryTitle: "Statut des commandes",
    syncFailed: "Impossible d'actualiser les commandes. Reessayez.",
    syncSuccess: "Commandes actualisees.",
    totalLabel: "Total",
    trackingCodeLabel: "Code suivi",
    updatedLabel: "Mise a jour",
    viewAllOrders: "Voir toutes les commandes",
  },
  zh: {
    allOrders: "\u5168\u90e8",
    browseShop: "\u524d\u5f80\u5546\u5e97",
    carrierLabel: "\u627f\u8fd0\u65b9",
    confirmed: "\u4e70\u5bb6\u5df2\u786e\u8ba4",
    delivered: "\u5df2\u9001\u8fbe",
    deliveryAddressLabel: "\u6536\u8d27\u5730\u5740",
    deliveryDetailsTitle: "\u914d\u9001\u4fe1\u606f",
    expandDetails: "\u67e5\u770b\u8be6\u60c5",
    hideDetails: "\u6536\u8d77",
    latestOrdersTitle: "\u6700\u8fd1\u8ba2\u5355",
    menuGuestHint:
      "\u5728\u4e00\u4e2a\u8d2d\u7269\u83dc\u5355\u91cc\u8ddf\u8e2a\u8d2d\u7269\u8f66\u548c\u8ba2\u5355\u3002",
    menuNoOrders: "\u8fd8\u6ca1\u6709\u8ba2\u5355\u3002",
    menuSignedInHint:
      "\u53ef\u4ee5\u5728\u8fd9\u91cc\u67e5\u770b\u8d2d\u7269\u8f66\u3001\u8ba2\u5355\u548c\u5f53\u524d\u914d\u9001\u72b6\u6001\u3002",
    openCart: "\u6253\u5f00\u8d2d\u7269\u8f66",
    orderCodeLabel: "\u8ba2\u5355\u53f7",
    orderItemsTitle: "\u5546\u54c1",
    orders: "\u8ba2\u5355",
    ordersAria: "\u6253\u5f00\u8ba2\u5355",
    ordersEmptyBody:
      "\u6210\u529f\u7684 Pi \u8ba2\u5355\u4f1a\u51fa\u73b0\u5728\u8fd9\u91cc\u4f9b\u4f60\u7ee7\u7eed\u8ddf\u8e2a\u3002",
    ordersEmptyTitle: "\u8fd8\u6ca1\u6709\u8ba2\u5355",
    ordersLead:
      "\u8fd9\u4e2a\u8ba2\u5355\u4e2d\u5fc3\u4f1a\u4ece\u652f\u4ed8\u3001\u5907\u8d27\u3001\u914d\u9001\u5230\u9001\u8fbe\u6574\u7406 Mushroom.Pi \u8ba2\u5355\u3002",
    ordersPageDescription:
      "\u6309\u5904\u7406\u4e2d\u3001\u8fd0\u9001\u4e2d\u3001\u5df2\u9001\u8fbe\u8ddf\u8e2a Mushroom.Pi \u8ba2\u5355\u3002",
    ordersPageTitle: "\u8ba2\u5355 | Mushroom.Pi",
    ordersTitle: "\u8ba2\u5355\u4e2d\u5fc3",
    paymentDetailsTitle: "\u652f\u4ed8\u4fe1\u606f",
    paymentFailedNotice:
      "\u8fd9\u7b14\u8ba2\u5355\u5c1a\u672a\u6210\u529f\u652f\u4ed8\u3002\u8bf7\u56de\u5230\u7ed3\u8d26\u9875\u91cd\u65b0\u53d1\u8d77 Pi \u652f\u4ed8\u3002",
    paymentPendingNotice:
      "\u8fd9\u7b14\u8ba2\u5355\u6b63\u5728\u7b49\u5f85 Pi \u652f\u4ed8\u786e\u8ba4\u3002\u5982\u679c\u5c1a\u672a\u5b8c\u6210\u652f\u4ed8\uff0c\u8bf7\u56de\u5230\u7ed3\u8d26\u9875\u3002",
    paid: "\u5df2\u652f\u4ed8",
    paymentFailed: "\u652f\u4ed8\u5931\u8d25",
    pendingPayment: "\u5f85\u652f\u4ed8",
    placedAtLabel: "\u4e0b\u5355\u65f6\u95f4",
    preparing: "\u5907\u8d27\u4e2d",
    receiverLabel: "\u6536\u4ef6\u4eba",
    refreshOrders: "\u5237\u65b0\u8ba2\u5355",
    refreshingOrders: "\u5237\u65b0\u4e2d...",
    retryPayment: "\u652f\u4ed8\u6b64\u8ba2\u5355",
    retryPaymentSuccess: "\u6b64\u8ba2\u5355\u5df2\u5b8c\u6210\u652f\u4ed8\u3002",
    retryingPayment: "\u6b63\u5728\u6253\u5f00 Pi \u652f\u4ed8...",
    shipperLabel: "\u914d\u9001\u5458",
    shipping: "\u914d\u9001\u4e2d",
    statusSummaryTitle: "\u8ba2\u5355\u72b6\u6001",
    syncFailed: "\u6682\u65f6\u65e0\u6cd5\u5237\u65b0\u8ba2\u5355\uff0c\u8bf7\u7a0d\u540e\u518d\u8bd5\u3002",
    syncSuccess: "\u8ba2\u5355\u5df2\u5237\u65b0\u3002",
    totalLabel: "\u5408\u8ba1",
    trackingCodeLabel: "\u8ffd\u8e2a\u7801",
    updatedLabel: "\u66f4\u65b0",
    viewAllOrders: "\u67e5\u770b\u5168\u90e8\u8ba2\u5355",
  },
};

export function getOrderCenterCopy(locale: SiteLocale) {
  return copy[locale];
}
