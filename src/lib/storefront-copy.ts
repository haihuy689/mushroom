import type { SiteLocale } from "@/lib/i18n";

export const BRAND_SLOGAN = "ăn nấm vì sức khỏe";

export type StorefrontCopy = {
  brandSlogan: string;
  addToCart: string;
  addedToCart: string;
  cart: string;
  cartAria: string;
  account: string;
  accountAria: string;
  languageAria: string;
  guestLabel: string;
  signedInLabel: string;
  loading: string;
  cartPageTitle: string;
  cartPageDescription: string;
  cartTitle: string;
  cartLead: string;
  emptyCartTitle: string;
  emptyCartBody: string;
  continueShopping: string;
  quantity: string;
  lineTotal: string;
  remove: string;
  clearCart: string;
  total: string;
  linesLabel: string;
  itemsLabel: string;
  cartCheckoutLabel: string;
  cartCheckoutTitle: string;
  cartCheckoutBody: string;
  cartCheckoutHint: string;
  accountPageTitle: string;
  accountPageDescription: string;
  accountTitle: string;
  accountLead: string;
  statusTitle: string;
  statusSignedIn: string;
  statusGuest: string;
  usernameLabel: string;
  walletLabel: string;
  orderHistoryTitle: string;
  noOrders: string;
  cartShortcut: string;
  browseShop: string;
};

const copy: Record<SiteLocale, StorefrontCopy> = {
  en: {
    brandSlogan: BRAND_SLOGAN,
    addToCart: "Add to cart",
    addedToCart: "Added",
    cart: "Cart",
    cartAria: "Open cart",
    account: "Account",
    accountAria: "Open account",
    languageAria: "Change language",
    guestLabel: "Guest",
    signedInLabel: "Signed in",
    loading: "Loading...",
    cartPageTitle: "Cart | Mushroom.Pi",
    cartPageDescription: "Review your Mushroom.Pi cart and continue with Pi testnet checkout.",
    cartTitle: "Your cart",
    cartLead: "Products added from the storefront appear here so shoppers can review, adjust quantity, and continue to Pi checkout.",
    emptyCartTitle: "Your cart is empty",
    emptyCartBody: "Add a few mushroom products from the shop and they will show up here right away.",
    continueShopping: "Continue shopping",
    quantity: "Quantity",
    lineTotal: "Line total",
    remove: "Remove",
    clearCart: "Clear cart",
    total: "Total",
    linesLabel: "lines",
    itemsLabel: "items",
    cartCheckoutLabel: "Pi testnet checkout",
    cartCheckoutTitle: "Pay each cart line with Pi",
    cartCheckoutBody: "Each payment button below uses the quantity currently in your cart, so shoppers can complete test purchases without leaving this page.",
    cartCheckoutHint: "Successful testnet payments are saved to the account area as local order history.",
    accountPageTitle: "Account | Mushroom.Pi",
    accountPageDescription: "View your Mushroom.Pi Pi sign-in status and local order history.",
    accountTitle: "Account",
    accountLead: "This space is ready for shopper-facing details like Pi identity, order history, and quick access back to the cart.",
    statusTitle: "Pi shopper status",
    statusSignedIn: "Your Pi account is connected in this browser session.",
    statusGuest: "No Pi account is connected yet. Sign in from the checkout panel and it will appear here automatically.",
    usernameLabel: "Username",
    walletLabel: "Wallet",
    orderHistoryTitle: "Recent orders",
    noOrders: "No local order history yet.",
    cartShortcut: "Open cart",
    browseShop: "Browse shop",
  },
  vi: {
    brandSlogan: BRAND_SLOGAN,
    addToCart: "Thêm vào giỏ",
    addedToCart: "Đã thêm",
    cart: "Giỏ hàng",
    cartAria: "Mở giỏ hàng",
    account: "Cá nhân",
    accountAria: "Mở khu vực cá nhân",
    languageAria: "Đổi ngôn ngữ",
    guestLabel: "Khách",
    signedInLabel: "Đã đăng nhập",
    loading: "Đang tải...",
    cartPageTitle: "Giỏ hàng | Mushroom.Pi",
    cartPageDescription: "Xem lại giỏ hàng Mushroom.Pi và tiếp tục thanh toán bằng Pi testnet.",
    cartTitle: "Giỏ hàng của bạn",
    cartLead: "Những sản phẩm được thêm từ storefront sẽ hiện ở đây để người dùng xem lại, chỉnh số lượng và tiếp tục sang bước thanh toán Pi.",
    emptyCartTitle: "Giỏ hàng đang trống",
    emptyCartBody: "Hãy thêm vài sản phẩm nấm từ shop, chúng sẽ xuất hiện ở đây ngay.",
    continueShopping: "Tiếp tục mua sắm",
    quantity: "Số lượng",
    lineTotal: "Tổng dòng",
    remove: "Xóa",
    clearCart: "Xóa giỏ hàng",
    total: "Tổng cộng",
    linesLabel: "dòng",
    itemsLabel: "món",
    cartCheckoutLabel: "Thanh toán Pi testnet",
    cartCheckoutTitle: "Thanh toán từng dòng sản phẩm bằng Pi",
    cartCheckoutBody: "Mỗi nút thanh toán bên dưới sẽ lấy đúng số lượng hiện có trong giỏ, để người dùng test mua hàng ngay trên trang giỏ.",
    cartCheckoutHint: "Khi thanh toán testnet thành công, đơn sẽ được lưu vào khu vực cá nhân dưới dạng lịch sử cục bộ.",
    accountPageTitle: "Cá nhân | Mushroom.Pi",
    accountPageDescription: "Xem trạng thái đăng nhập Pi và lịch sử đơn hàng cục bộ của Mushroom.Pi.",
    accountTitle: "Khu vực cá nhân",
    accountLead: "Phần này đã sẵn sàng cho các nội dung hướng người mua như định danh Pi, lịch sử đơn hàng và đường tắt quay lại giỏ hàng.",
    statusTitle: "Trạng thái người dùng Pi",
    statusSignedIn: "Tài khoản Pi của bạn đã được kết nối trên trình duyệt này.",
    statusGuest: "Hiện chưa có tài khoản Pi nào được kết nối. Chỉ cần đăng nhập từ khu vực thanh toán, thông tin sẽ tự hiện ở đây.",
    usernameLabel: "Tên người dùng",
    walletLabel: "Ví",
    orderHistoryTitle: "Đơn hàng gần đây",
    noOrders: "Chưa có lịch sử đơn hàng cục bộ.",
    cartShortcut: "Mở giỏ hàng",
    browseShop: "Vào shop",
  },
  es: {
    brandSlogan: BRAND_SLOGAN,
    addToCart: "Agregar al carrito",
    addedToCart: "Agregado",
    cart: "Carrito",
    cartAria: "Abrir carrito",
    account: "Cuenta",
    accountAria: "Abrir cuenta",
    languageAria: "Cambiar idioma",
    guestLabel: "Invitado",
    signedInLabel: "Conectado",
    loading: "Cargando...",
    cartPageTitle: "Carrito | Mushroom.Pi",
    cartPageDescription: "Revisa tu carrito de Mushroom.Pi y continúa con el pago en Pi testnet.",
    cartTitle: "Tu carrito",
    cartLead: "Los productos agregados desde la tienda aparecen aquí para que el usuario revise, ajuste cantidades y continúe con el pago en Pi.",
    emptyCartTitle: "Tu carrito está vacío",
    emptyCartBody: "Agrega algunos productos de hongos desde la tienda y aparecerán aquí al instante.",
    continueShopping: "Seguir comprando",
    quantity: "Cantidad",
    lineTotal: "Total de línea",
    remove: "Eliminar",
    clearCart: "Vaciar carrito",
    total: "Total",
    linesLabel: "líneas",
    itemsLabel: "artículos",
    cartCheckoutLabel: "Pago Pi testnet",
    cartCheckoutTitle: "Paga cada línea del carrito con Pi",
    cartCheckoutBody: "Cada botón de pago usa la cantidad actual del carrito para que los compradores completen pruebas sin salir de esta página.",
    cartCheckoutHint: "Los pagos testnet exitosos se guardan en el área de cuenta como historial local.",
    accountPageTitle: "Cuenta | Mushroom.Pi",
    accountPageDescription: "Consulta el estado de inicio de sesión de Pi y el historial local de pedidos.",
    accountTitle: "Cuenta",
    accountLead: "Este espacio está listo para mostrar identidad Pi, historial de pedidos y acceso rápido al carrito.",
    statusTitle: "Estado del comprador Pi",
    statusSignedIn: "Tu cuenta Pi está conectada en este navegador.",
    statusGuest: "Todavía no hay una cuenta Pi conectada. Inicia sesión desde el panel de pago y aparecerá aquí automáticamente.",
    usernameLabel: "Usuario",
    walletLabel: "Billetera",
    orderHistoryTitle: "Pedidos recientes",
    noOrders: "Todavía no hay historial local de pedidos.",
    cartShortcut: "Abrir carrito",
    browseShop: "Ver tienda",
  },
  fr: {
    brandSlogan: BRAND_SLOGAN,
    addToCart: "Ajouter au panier",
    addedToCart: "Ajoute",
    cart: "Panier",
    cartAria: "Ouvrir le panier",
    account: "Compte",
    accountAria: "Ouvrir le compte",
    languageAria: "Changer de langue",
    guestLabel: "Invite",
    signedInLabel: "Connecte",
    loading: "Chargement...",
    cartPageTitle: "Panier | Mushroom.Pi",
    cartPageDescription: "Consultez votre panier Mushroom.Pi et poursuivez le paiement en Pi testnet.",
    cartTitle: "Votre panier",
    cartLead: "Les produits ajoutes depuis la boutique apparaissent ici pour revoir le contenu, ajuster la quantite et poursuivre vers le paiement Pi.",
    emptyCartTitle: "Votre panier est vide",
    emptyCartBody: "Ajoutez quelques produits a la boutique et ils apparaitront ici immediatement.",
    continueShopping: "Continuer vos achats",
    quantity: "Quantite",
    lineTotal: "Total de ligne",
    remove: "Retirer",
    clearCart: "Vider le panier",
    total: "Total",
    linesLabel: "lignes",
    itemsLabel: "articles",
    cartCheckoutLabel: "Paiement Pi testnet",
    cartCheckoutTitle: "Payer chaque ligne du panier avec Pi",
    cartCheckoutBody: "Chaque bouton de paiement reprend la quantite actuelle du panier pour permettre des achats test directement depuis cette page.",
    cartCheckoutHint: "Les paiements testnet reussis sont enregistres dans l'espace compte comme historique local.",
    accountPageTitle: "Compte | Mushroom.Pi",
    accountPageDescription: "Consultez l'etat de connexion Pi et l'historique local des commandes.",
    accountTitle: "Compte",
    accountLead: "Cet espace est pret pour l'identite Pi, l'historique des commandes et un acces rapide au panier.",
    statusTitle: "Statut acheteur Pi",
    statusSignedIn: "Votre compte Pi est connecte dans ce navigateur.",
    statusGuest: "Aucun compte Pi n'est encore connecte. Connectez-vous depuis le panneau de paiement et il apparaitra ici automatiquement.",
    usernameLabel: "Nom d'utilisateur",
    walletLabel: "Portefeuille",
    orderHistoryTitle: "Commandes recentes",
    noOrders: "Aucun historique local pour le moment.",
    cartShortcut: "Ouvrir le panier",
    browseShop: "Voir la boutique",
  },
  zh: {
    brandSlogan: BRAND_SLOGAN,
    addToCart: "加入购物车",
    addedToCart: "已加入",
    cart: "购物车",
    cartAria: "打开购物车",
    account: "个人中心",
    accountAria: "打开个人中心",
    languageAria: "切换语言",
    guestLabel: "访客",
    signedInLabel: "已登录",
    loading: "加载中...",
    cartPageTitle: "购物车 | Mushroom.Pi",
    cartPageDescription: "查看 Mushroom.Pi 购物车并继续使用 Pi 测试网付款。",
    cartTitle: "你的购物车",
    cartLead: "从商店加入的商品会显示在这里，方便用户查看、调整数量并继续进入 Pi 付款流程。",
    emptyCartTitle: "购物车还是空的",
    emptyCartBody: "先去商店添加一些蘑菇产品，它们会立刻出现在这里。",
    continueShopping: "继续购物",
    quantity: "数量",
    lineTotal: "单项合计",
    remove: "移除",
    clearCart: "清空购物车",
    total: "总计",
    linesLabel: "行",
    itemsLabel: "件",
    cartCheckoutLabel: "Pi 测试网支付",
    cartCheckoutTitle: "按购物车单项使用 Pi 支付",
    cartCheckoutBody: "下面每个支付按钮都会按当前购物车数量发起测试支付，让用户无需离开此页即可完成测试购买。",
    cartCheckoutHint: "测试网支付成功后，会在个人中心保存为本地订单记录。",
    accountPageTitle: "个人中心 | Mushroom.Pi",
    accountPageDescription: "查看 Mushroom.Pi 的 Pi 登录状态与本地订单记录。",
    accountTitle: "个人中心",
    accountLead: "这里已经为 Pi 身份、订单历史和返回购物车的快捷入口准备好了结构。",
    statusTitle: "Pi 用户状态",
    statusSignedIn: "你的 Pi 账户已在当前浏览器中连接。",
    statusGuest: "当前还没有连接 Pi 账户。只要在支付区域登录，这里就会自动显示。",
    usernameLabel: "用户名",
    walletLabel: "钱包",
    orderHistoryTitle: "最近订单",
    noOrders: "还没有本地订单记录。",
    cartShortcut: "打开购物车",
    browseShop: "前往商店",
  },
};

export function getStorefrontCopy(locale: SiteLocale) {
  return copy[locale];
}
