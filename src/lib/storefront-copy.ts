import type { SiteLocale } from "@/lib/i18n";

export const BRAND_SLOGAN = "\u0103n n\u1ea5m v\u00ec s\u1ee9c kh\u1ecfe";

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
  signInLabel: string;
  signOutLabel: string;
  adminPanel: string;
  staffPanel: string;
  loading: string;
  inStock: string;
  inventoryLabel: string;
  inventoryIssue: string;
  outOfStock: string;
  packagingLabel: string;
  shopTitle: string;
  shopLead: string;
  cartPageTitle: string;
  cartPageDescription: string;
  cartTitle: string;
  cartLead: string;
  emptyCartTitle: string;
  emptyCartBody: string;
  continueShopping: string;
  quantity: string;
  lineTotal: string;
  subtotal: string;
  remove: string;
  clearCart: string;
  total: string;
  weightLabel: string;
  linesLabel: string;
  itemsLabel: string;
  quantityPickerTitle: string;
  quantityPickerLead: string;
  quantityPickerConfirm: string;
  quantityPickerCancel: string;
  cartSummaryTitle: string;
  checkoutTitle: string;
  checkoutLead: string;
  checkoutHint: string;
  shippingAddressTitle: string;
  shippingAddressLead: string;
  savedAddressesTitle: string;
  noSavedAddresses: string;
  addAddressTitle: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  ward: string;
  district: string;
  city: string;
  country: string;
  note: string;
  setAsDefault: string;
  saveAddress: string;
  defaultAddress: string;
  selectedAddress: string;
  addressRequired: string;
  locationGeocodeFailed: string;
  locationMismatch: string;
  locationPermissionDenied: string;
  locationRequired: string;
  locationUnavailable: string;
  locationVerified: string;
  locationVerifyButton: string;
  locationVerifyLead: string;
  locationVerifyTitle: string;
  locationVerifying: string;
  placeOrder: string;
  placingOrder: string;
  signInToCheckout: string;
  checkoutSignedInAs: string;
  paymentSuccess: string;
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
  addressBookTitle: string;
  addressBookLead: string;
  noAddresses: string;
  deliverTo: string;
  cartShortcut: string;
  browseShop: string;
};

const en: StorefrontCopy = {
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
  signInLabel: "Sign in with Pi",
  signOutLabel: "Sign out",
  adminPanel: "Admin",
  staffPanel: "Staff",
  loading: "Loading...",
  inStock: "In stock",
  inventoryLabel: "Stock",
  inventoryIssue: "Adjust sold-out items or quantities before placing the order.",
  outOfStock: "Out of stock",
  packagingLabel: "Packaging",
  shopTitle: "Shop",
  shopLead: "Tap a product, choose quantity, then add it to your cart.",
  cartPageTitle: "Cart | Mushroom.Pi",
  cartPageDescription:
    "Review your Mushroom.Pi cart, choose a delivery address, and pay with Pi.",
  cartTitle: "Your cart",
  cartLead: "Review products, choose delivery details, and place one Pi order for the whole cart.",
  emptyCartTitle: "Your cart is empty",
  emptyCartBody: "Add a few mushroom products from the shop and they will appear here right away.",
  continueShopping: "Continue shopping",
  quantity: "Quantity",
  lineTotal: "Line total",
  subtotal: "Subtotal",
  remove: "Remove",
  clearCart: "Clear cart",
  total: "Total",
  weightLabel: "Weight",
  linesLabel: "lines",
  itemsLabel: "items",
  quantityPickerTitle: "Choose quantity",
  quantityPickerLead: "Adjust the amount before adding this product to the cart.",
  quantityPickerConfirm: "Add now",
  quantityPickerCancel: "Cancel",
  cartSummaryTitle: "Order summary",
  checkoutTitle: "Pi checkout",
  checkoutLead: "Sign in with Pi, confirm your address, and pay the full cart in one order.",
  checkoutHint: "Successful payments are saved to your account order history.",
  shippingAddressTitle: "Delivery address",
  shippingAddressLead: "Choose a saved address or add a new one before placing the order.",
  savedAddressesTitle: "Saved addresses",
  noSavedAddresses: "No saved addresses yet. Add one below to continue.",
  addAddressTitle: "Add new address",
  fullName: "Full name",
  phone: "Phone number",
  addressLine1: "Street address",
  addressLine2: "Apartment, suite, building",
  ward: "Ward",
  district: "District",
  city: "City",
  country: "Country",
  note: "Delivery note",
  setAsDefault: "Set as default",
  saveAddress: "Save address",
  defaultAddress: "Default",
  selectedAddress: "Selected",
  addressRequired: "Choose or save a delivery address before placing the order.",
  locationGeocodeFailed:
    "We could not identify your GPS country. Please try again.",
  locationMismatch:
    "GPS country does not match the delivery country. Please check the address.",
  locationPermissionDenied:
    "Location permission was denied. Allow GPS verification before checkout.",
  locationRequired: "Verify your GPS country before placing the order.",
  locationUnavailable:
    "GPS verification is unavailable on this browser or device.",
  locationVerified: "GPS country matches the delivery country.",
  locationVerifyButton: "Verify GPS location",
  locationVerifyLead:
    "We compare your GPS country with the delivery country to reduce fake addresses.",
  locationVerifyTitle: "Address verification",
  locationVerifying: "Checking GPS...",
  placeOrder: "Pay and place order",
  placingOrder: "Preparing Pi payment...",
  signInToCheckout: "Sign in with Pi",
  checkoutSignedInAs: "Signed in as",
  paymentSuccess: "Order saved to your account.",
  accountPageTitle: "Account | Mushroom.Pi",
  accountPageDescription:
    "View your Mushroom.Pi Pi sign-in status, saved addresses, and local order history.",
  accountTitle: "Account",
  accountLead: "Keep your Pi identity, saved delivery addresses, and order history in one place.",
  statusTitle: "Pi shopper status",
  statusSignedIn: "Your Pi account is connected in this browser session.",
  statusGuest: "No Pi account is connected yet. Sign in from checkout and it will appear here automatically.",
  usernameLabel: "Username",
  walletLabel: "Wallet",
  orderHistoryTitle: "Recent orders",
  noOrders: "No orders yet.",
  addressBookTitle: "Saved addresses",
  addressBookLead: "Addresses created during checkout are stored here for faster future orders.",
  noAddresses: "No addresses saved yet.",
  deliverTo: "Deliver to",
  cartShortcut: "Open cart",
  browseShop: "Browse shop",
};

const copy: Record<SiteLocale, StorefrontCopy> = {
  en,
  vi: {
    ...en,
    addToCart: "Th\u00eam v\u00e0o gi\u1ecf",
    addedToCart: "\u0110\u00e3 th\u00eam",
    cart: "Gi\u1ecf h\u00e0ng",
    cartAria: "M\u1edf gi\u1ecf h\u00e0ng",
    account: "C\u00e1 nh\u00e2n",
    accountAria: "M\u1edf khu v\u1ef1c c\u00e1 nh\u00e2n",
    languageAria: "\u0110\u1ed5i ng\u00f4n ng\u1eef",
    guestLabel: "Kh\u00e1ch",
    signedInLabel: "\u0110\u00e3 \u0111\u0103ng nh\u1eadp",
    signInLabel: "\u0110\u0103ng nh\u1eadp v\u1edbi Pi",
    signOutLabel: "\u0110\u0103ng xu\u1ea5t",
    adminPanel: "Qu\u1ea3n tr\u1ecb",
    staffPanel: "Nh\u00e2n vi\u00ean",
    loading: "\u0110ang t\u1ea3i...",
    inStock: "C\u00f2n h\u00e0ng",
    inventoryLabel: "T\u1ed3n kho",
    inventoryIssue:
      "H\u00e3y \u0111i\u1ec1u ch\u1ec9nh s\u1ea3n ph\u1ea9m h\u1ebft h\u00e0ng ho\u1eb7c v\u01b0\u1ee3t t\u1ed3n kho tr\u01b0\u1edbc khi \u0111\u1eb7t h\u00e0ng.",
    outOfStock: "H\u1ebft h\u00e0ng",
    packagingLabel: "Bao b\u00ec",
    shopTitle: "C\u1eeda h\u00e0ng",
    shopLead:
      "Ch\u1ecdn s\u1ea3n ph\u1ea9m, t\u0103ng gi\u1ea3m s\u1ed1 l\u01b0\u1ee3ng r\u1ed3i th\u00eam v\u00e0o gi\u1ecf.",
    cartPageTitle: "Gi\u1ecf h\u00e0ng | Mushroom.Pi",
    cartPageDescription:
      "Xem l\u1ea1i gi\u1ecf h\u00e0ng Mushroom.Pi, ch\u1ecdn \u0111\u1ecba ch\u1ec9 nh\u1eadn h\u00e0ng v\u00e0 thanh to\u00e1n b\u1eb1ng Pi.",
    cartTitle: "Gi\u1ecf h\u00e0ng c\u1ee7a b\u1ea1n",
    cartLead:
      "Xem l\u1ea1i s\u1ea3n ph\u1ea9m, ch\u1ecdn \u0111\u1ecba ch\u1ec9 nh\u1eadn h\u00e0ng v\u00e0 t\u1ea1o m\u1ed9t \u0111\u01a1n Pi cho to\u00e0n b\u1ed9 gi\u1ecf.",
    emptyCartTitle: "Gi\u1ecf h\u00e0ng \u0111ang tr\u1ed1ng",
    emptyCartBody:
      "H\u00e3y th\u00eam v\u00e0i s\u1ea3n ph\u1ea9m n\u1ea5m t\u1eeb shop, ch\u00fang s\u1ebd hi\u1ec7n \u1edf \u0111\u00e2y ngay.",
    continueShopping: "Ti\u1ebfp t\u1ee5c mua s\u1eafm",
    quantity: "S\u1ed1 l\u01b0\u1ee3ng",
    lineTotal: "T\u1ed5ng m\u00f3n",
    subtotal: "T\u1ea1m t\u00ednh",
    remove: "X\u00f3a",
    clearCart: "X\u00f3a gi\u1ecf h\u00e0ng",
    total: "T\u1ed5ng c\u1ed9ng",
    weightLabel: "Kh\u1ed1i l\u01b0\u1ee3ng",
    linesLabel: "d\u00f2ng",
    itemsLabel: "m\u00f3n",
    quantityPickerTitle: "Ch\u1ecdn s\u1ed1 l\u01b0\u1ee3ng",
    quantityPickerLead:
      "Ch\u1ec9nh s\u1ed1 l\u01b0\u1ee3ng tr\u01b0\u1edbc khi th\u00eam s\u1ea3n ph\u1ea9m v\u00e0o gi\u1ecf.",
    quantityPickerConfirm: "Th\u00eam ngay",
    quantityPickerCancel: "\u0110\u00f3ng",
    cartSummaryTitle: "T\u00f3m t\u1eaft \u0111\u01a1n h\u00e0ng",
    checkoutTitle: "Thanh to\u00e1n Pi",
    checkoutLead:
      "\u0110\u0103ng nh\u1eadp Pi, x\u00e1c nh\u1eadn \u0111\u1ecba ch\u1ec9 giao h\u00e0ng v\u00e0 thanh to\u00e1n to\u00e0n b\u1ed9 gi\u1ecf trong m\u1ed9t \u0111\u01a1n.",
    checkoutHint:
      "Khi thanh to\u00e1n th\u00e0nh c\u00f4ng, \u0111\u01a1n s\u1ebd \u0111\u01b0\u1ee3c l\u01b0u v\u00e0o khu v\u1ef1c c\u00e1 nh\u00e2n.",
    shippingAddressTitle: "\u0110\u1ecba ch\u1ec9 nh\u1eadn h\u00e0ng",
    shippingAddressLead:
      "Ch\u1ecdn \u0111\u1ecba ch\u1ec9 \u0111\u00e3 l\u01b0u ho\u1eb7c t\u1ea1o \u0111\u1ecba ch\u1ec9 m\u1edbi tr\u01b0\u1edbc khi \u0111\u1eb7t h\u00e0ng.",
    savedAddressesTitle: "\u0110\u1ecba ch\u1ec9 \u0111\u00e3 l\u01b0u",
    noSavedAddresses:
      "Ch\u01b0a c\u00f3 \u0111\u1ecba ch\u1ec9 n\u00e0o. H\u00e3y th\u00eam m\u1ed9t \u0111\u1ecba ch\u1ec9 b\u00ean d\u01b0\u1edbi \u0111\u1ec3 ti\u1ebfp t\u1ee5c.",
    addAddressTitle: "Th\u00eam \u0111\u1ecba ch\u1ec9 m\u1edbi",
    fullName: "H\u1ecd v\u00e0 t\u00ean",
    phone: "S\u1ed1 \u0111i\u1ec7n tho\u1ea1i",
    addressLine1: "\u0110\u1ecba ch\u1ec9",
    addressLine2: "C\u0103n h\u1ed9, t\u00f2a nh\u00e0, s\u1ed1 t\u1ea7ng",
    ward: "Ph\u01b0\u1eddng / x\u00e3",
    district: "Qu\u1eadn / huy\u1ec7n",
    city: "T\u1ec9nh / th\u00e0nh ph\u1ed1",
    country: "Qu\u1ed1c gia",
    note: "Ghi ch\u00fa giao h\u00e0ng",
    setAsDefault: "\u0110\u1eb7t l\u00e0m m\u1eb7c \u0111\u1ecbnh",
    saveAddress: "L\u01b0u \u0111\u1ecba ch\u1ec9",
    defaultAddress: "M\u1eb7c \u0111\u1ecbnh",
    selectedAddress: "\u0110ang ch\u1ecdn",
    addressRequired:
      "H\u00e3y ch\u1ecdn ho\u1eb7c l\u01b0u \u0111\u1ecba ch\u1ec9 nh\u1eadn h\u00e0ng tr\u01b0\u1edbc khi \u0111\u1eb7t \u0111\u01a1n.",
    locationGeocodeFailed:
      "Ch\u01b0a x\u00e1c \u0111\u1ecbnh \u0111\u01b0\u1ee3c qu\u1ed1c gia t\u1eeb GPS. B\u1ea1n vui l\u00f2ng th\u1eed l\u1ea1i.",
    locationMismatch:
      "Qu\u1ed1c gia GPS kh\u00f4ng kh\u1edbp v\u1edbi qu\u1ed1c gia trong \u0111\u1ecba ch\u1ec9. H\u00e3y ki\u1ec3m tra l\u1ea1i \u0111\u1ecba ch\u1ec9.",
    locationPermissionDenied:
      "B\u1ea1n ch\u01b0a c\u1ea5p quy\u1ec1n v\u1ecb tr\u00ed. H\u00e3y cho ph\u00e9p x\u00e1c minh GPS tr\u01b0\u1edbc khi thanh to\u00e1n.",
    locationRequired:
      "H\u00e3y x\u00e1c minh qu\u1ed1c gia b\u1eb1ng GPS tr\u01b0\u1edbc khi \u0111\u1eb7t h\u00e0ng.",
    locationUnavailable:
      "Tr\u00ecnh duy\u1ec7t ho\u1eb7c thi\u1ebft b\u1ecb n\u00e0y ch\u01b0a h\u1ed7 tr\u1ee3 x\u00e1c minh GPS.",
    locationVerified:
      "Qu\u1ed1c gia GPS kh\u1edbp v\u1edbi qu\u1ed1c gia trong \u0111\u1ecba ch\u1ec9 giao h\u00e0ng.",
    locationVerifyButton: "X\u00e1c minh GPS",
    locationVerifyLead:
      "H\u1ec7 th\u1ed1ng so s\u00e1nh qu\u1ed1c gia t\u1eeb GPS v\u1edbi qu\u1ed1c gia giao h\u00e0ng \u0111\u1ec3 h\u1ea1n ch\u1ebf \u0111\u1ecba ch\u1ec9 \u1ea3o.",
    locationVerifyTitle: "X\u00e1c minh \u0111\u1ecba ch\u1ec9",
    locationVerifying: "\u0110ang ki\u1ec3m tra GPS...",
    placeOrder: "Thanh to\u00e1n v\u00e0 \u0111\u1eb7t h\u00e0ng",
    placingOrder: "\u0110ang chu\u1ea9n b\u1ecb thanh to\u00e1n Pi...",
    signInToCheckout: "\u0110\u0103ng nh\u1eadp b\u1eb1ng Pi",
    checkoutSignedInAs: "\u0110\u00e3 \u0111\u0103ng nh\u1eadp d\u01b0\u1edbi t\u00ean",
    paymentSuccess: "\u0110\u01a1n h\u00e0ng \u0111\u00e3 \u0111\u01b0\u1ee3c l\u01b0u v\u00e0o t\u00e0i kho\u1ea3n.",
    accountPageTitle: "C\u00e1 nh\u00e2n | Mushroom.Pi",
    accountPageDescription:
      "Xem t\u00ecnh tr\u1ea1ng \u0111\u0103ng nh\u1eadp Pi, \u0111\u1ecba ch\u1ec9 \u0111\u00e3 l\u01b0u v\u00e0 l\u1ecbch s\u1eed \u0111\u01a1n h\u00e0ng c\u1ee7a Mushroom.Pi.",
    accountTitle: "Khu v\u1ef1c c\u00e1 nh\u00e2n",
    accountLead:
      "L\u01b0u tr\u1eef th\u00f4ng tin Pi, \u0111\u1ecba ch\u1ec9 giao h\u00e0ng v\u00e0 l\u1ecbch s\u1eed \u0111\u1eb7t h\u00e0ng trong c\u00f9ng m\u1ed9t n\u01a1i.",
    statusTitle: "Tr\u1ea1ng th\u00e1i ng\u01b0\u1eddi d\u00f9ng Pi",
    statusSignedIn:
      "T\u00e0i kho\u1ea3n Pi c\u1ee7a b\u1ea1n \u0111\u00e3 \u0111\u01b0\u1ee3c k\u1ebft n\u1ed1i tr\u00ean tr\u00ecnh duy\u1ec7t n\u00e0y.",
    statusGuest:
      "Hi\u1ec7n ch\u01b0a c\u00f3 t\u00e0i kho\u1ea3n Pi n\u00e0o \u0111\u01b0\u1ee3c k\u1ebft n\u1ed1i. \u0110\u0103ng nh\u1eadp t\u1eeb b\u01b0\u1edbc thanh to\u00e1n, th\u00f4ng tin s\u1ebd hi\u1ec7n \u1edf \u0111\u00e2y.",
    usernameLabel: "T\u00ean ng\u01b0\u1eddi d\u00f9ng",
    walletLabel: "V\u00ed",
    orderHistoryTitle: "\u0110\u01a1n h\u00e0ng g\u1ea7n \u0111\u00e2y",
    noOrders: "Ch\u01b0a c\u00f3 \u0111\u01a1n h\u00e0ng n\u00e0o.",
    addressBookTitle: "\u0110\u1ecba ch\u1ec9 \u0111\u00e3 l\u01b0u",
    addressBookLead:
      "Nh\u1eefng \u0111\u1ecba ch\u1ec9 t\u1ea1o trong l\u00fac thanh to\u00e1n s\u1ebd \u0111\u01b0\u1ee3c l\u01b0u \u1edf \u0111\u00e2y \u0111\u1ec3 \u0111\u1eb7t h\u00e0ng nhanh h\u01a1n.",
    noAddresses: "Ch\u01b0a c\u00f3 \u0111\u1ecba ch\u1ec9 n\u00e0o \u0111\u01b0\u1ee3c l\u01b0u.",
    deliverTo: "Giao t\u1edbi",
    cartShortcut: "M\u1edf gi\u1ecf h\u00e0ng",
    browseShop: "V\u00e0o shop",
  },
  es: {
    ...en,
    addToCart: "Agregar al carrito",
    addedToCart: "Agregado",
    cart: "Carrito",
    cartAria: "Abrir carrito",
    account: "Cuenta",
    accountAria: "Abrir cuenta",
    languageAria: "Cambiar idioma",
    signedInLabel: "Conectado",
    shopLead: "Toca un producto, elige cantidad y agregalo al carrito.",
    cartPageDescription:
      "Revisa tu carrito de Mushroom.Pi, elige direccion de entrega y paga con Pi.",
    cartLead:
      "Revisa productos, elige entrega y crea un solo pedido Pi para todo el carrito.",
    continueShopping: "Seguir comprando",
    quantityPickerTitle: "Elegir cantidad",
    quantityPickerLead:
      "Ajusta la cantidad antes de agregar este producto al carrito.",
    quantityPickerConfirm: "Agregar ahora",
    quantityPickerCancel: "Cancelar",
    cartSummaryTitle: "Resumen del pedido",
    checkoutTitle: "Pago Pi",
    checkoutLead:
      "Inicia sesion con Pi, confirma tu direccion y paga todo el carrito en un solo pedido.",
    checkoutHint:
      "Los pagos exitosos se guardan en el area de cuenta.",
    shippingAddressTitle: "Direccion de entrega",
    shippingAddressLead:
      "Elige una direccion guardada o agrega una nueva antes de hacer el pedido.",
    savedAddressesTitle: "Direcciones guardadas",
    noSavedAddresses: "Todavia no hay direcciones guardadas.",
    addAddressTitle: "Agregar nueva direccion",
    fullName: "Nombre completo",
    phone: "Telefono",
    addressLine1: "Direccion",
    addressLine2: "Apartamento, edificio, piso",
    ward: "Barrio",
    district: "Distrito",
    city: "Ciudad",
    country: "Pais",
    note: "Nota de entrega",
    setAsDefault: "Usar por defecto",
    saveAddress: "Guardar direccion",
    defaultAddress: "Predeterminada",
    selectedAddress: "Seleccionada",
    addressRequired:
      "Elige o guarda una direccion antes de hacer el pedido.",
    placeOrder: "Hacer pedido con Pi",
    placingOrder: "Preparando pago Pi...",
    signInToCheckout: "Entrar con Pi",
    checkoutSignedInAs: "Conectado como",
    paymentSuccess: "Pedido guardado en tu cuenta.",
    accountPageDescription:
      "Consulta el estado de Pi, las direcciones guardadas y el historial local de pedidos.",
    accountLead:
      "Guarda tu identidad Pi, tus direcciones y tu historial en un solo lugar.",
    statusTitle: "Estado del comprador Pi",
    statusSignedIn: "Tu cuenta Pi esta conectada en este navegador.",
    statusGuest:
      "Todavia no hay una cuenta Pi conectada. Inicia sesion desde el checkout y aparecera aqui.",
    orderHistoryTitle: "Pedidos recientes",
    noOrders: "Todavia no hay pedidos locales.",
    addressBookTitle: "Direcciones guardadas",
    addressBookLead:
      "Las direcciones creadas durante el checkout se guardan aqui para futuros pedidos.",
    noAddresses: "Todavia no hay direcciones guardadas.",
    deliverTo: "Entregar a",
    browseShop: "Ver tienda",
  },
  fr: {
    ...en,
    addToCart: "Ajouter au panier",
    addedToCart: "Ajoute",
    cart: "Panier",
    cartAria: "Ouvrir le panier",
    account: "Compte",
    accountAria: "Ouvrir le compte",
    languageAria: "Changer de langue",
    signedInLabel: "Connecte",
    shopLead: "Touchez un produit, choisissez la quantite, puis ajoutez-le au panier.",
    cartPageDescription:
      "Consultez votre panier Mushroom.Pi, choisissez une adresse et payez en Pi.",
    cartLead:
      "Revoyez les produits, choisissez la livraison et creez une seule commande Pi pour tout le panier.",
    emptyCartBody:
      "Ajoutez quelques produits de champignons depuis la boutique et ils apparaitront ici tout de suite.",
    continueShopping: "Continuer vos achats",
    quantityPickerTitle: "Choisir la quantite",
    quantityPickerLead:
      "Ajustez la quantite avant d'ajouter ce produit au panier.",
    quantityPickerConfirm: "Ajouter maintenant",
    quantityPickerCancel: "Fermer",
    cartSummaryTitle: "Resume de commande",
    checkoutTitle: "Paiement Pi",
    checkoutLead:
      "Connectez-vous avec Pi, confirmez votre adresse et payez tout le panier en une seule commande.",
    checkoutHint:
      "Les paiements reussis sont enregistres dans l'espace compte.",
    shippingAddressTitle: "Adresse de livraison",
    shippingAddressLead:
      "Choisissez une adresse enregistree ou ajoutez-en une avant la commande.",
    savedAddressesTitle: "Adresses enregistrees",
    noSavedAddresses: "Aucune adresse enregistree pour le moment.",
    addAddressTitle: "Ajouter une adresse",
    fullName: "Nom complet",
    phone: "Telephone",
    addressLine1: "Adresse",
    addressLine2: "Appartement, batiment, etage",
    ward: "Quartier",
    district: "District",
    city: "Ville",
    country: "Pays",
    note: "Note de livraison",
    setAsDefault: "Definir par defaut",
    saveAddress: "Enregistrer l'adresse",
    defaultAddress: "Par defaut",
    selectedAddress: "Selectionnee",
    addressRequired:
      "Choisissez ou enregistrez une adresse avant de passer la commande.",
    placeOrder: "Commander avec Pi",
    placingOrder: "Preparation du paiement Pi...",
    signInToCheckout: "Se connecter avec Pi",
    checkoutSignedInAs: "Connecte en tant que",
    paymentSuccess: "Commande enregistree sur votre compte.",
    accountPageDescription:
      "Consultez votre statut Pi, vos adresses enregistrees et l'historique local des commandes.",
    accountLead:
      "Gardez votre identite Pi, vos adresses et vos commandes au meme endroit.",
    statusTitle: "Statut acheteur Pi",
    statusSignedIn: "Votre compte Pi est connecte dans ce navigateur.",
    statusGuest:
      "Aucun compte Pi n'est connecte pour le moment. Connectez-vous depuis le checkout et il apparaitra ici.",
    orderHistoryTitle: "Commandes recentes",
    noOrders: "Aucune commande locale pour le moment.",
    addressBookTitle: "Adresses enregistrees",
    addressBookLead:
      "Les adresses creees pendant le checkout sont conservees ici pour les prochaines commandes.",
    noAddresses: "Aucune adresse enregistree pour le moment.",
    deliverTo: "Livrer a",
    browseShop: "Voir la boutique",
  },
  zh: {
    ...en,
    addToCart: "\u52a0\u5165\u8d2d\u7269\u8f66",
    addedToCart: "\u5df2\u52a0\u5165",
    cart: "\u8d2d\u7269\u8f66",
    cartAria: "\u6253\u5f00\u8d2d\u7269\u8f66",
    account: "\u4e2a\u4eba\u4e2d\u5fc3",
    accountAria: "\u6253\u5f00\u4e2a\u4eba\u4e2d\u5fc3",
    languageAria: "\u5207\u6362\u8bed\u8a00",
    guestLabel: "\u8bbf\u5ba2",
    signedInLabel: "\u5df2\u767b\u5f55",
    loading: "\u52a0\u8f7d\u4e2d...",
    shopTitle: "\u5546\u5e97",
    shopLead:
      "\u70b9\u51fb\u5546\u54c1\u540e\u5148\u9009\u62e9\u6570\u91cf\uff0c\u518d\u52a0\u5165\u8d2d\u7269\u8f66\u3002",
    cartPageDescription:
      "\u67e5\u770b Mushroom.Pi \u8d2d\u7269\u8f66\uff0c\u9009\u62e9\u6536\u8d27\u5730\u5740\uff0c\u5e76\u4f7f\u7528 Pi \u652f\u4ed8\u3002",
    cartTitle: "\u4f60\u7684\u8d2d\u7269\u8f66",
    cartLead:
      "\u68c0\u67e5\u5546\u54c1\uff0c\u9009\u62e9\u6536\u8d27\u4fe1\u606f\uff0c\u7136\u540e\u4e3a\u6574\u4e2a\u8d2d\u7269\u8f66\u521b\u5efa\u4e00\u7b14 Pi \u8ba2\u5355\u3002",
    emptyCartTitle: "\u8d2d\u7269\u8f66\u8fd8\u662f\u7a7a\u7684",
    emptyCartBody:
      "\u4ece\u5546\u5e97\u91cc\u5148\u52a0\u5165\u4e00\u4e9b\u8631\u83c7\u5546\u54c1\uff0c\u5b83\u4eec\u4f1a\u7acb\u5373\u51fa\u73b0\u5728\u8fd9\u91cc\u3002",
    continueShopping: "\u7ee7\u7eed\u8d2d\u7269",
    quantity: "\u6570\u91cf",
    lineTotal: "\u5355\u9879\u5408\u8ba1",
    subtotal: "\u5c0f\u8ba1",
    remove: "\u79fb\u9664",
    clearCart: "\u6e05\u7a7a\u8d2d\u7269\u8f66",
    total: "\u603b\u8ba1",
    linesLabel: "\u884c",
    itemsLabel: "\u4ef6",
    quantityPickerTitle: "\u9009\u62e9\u6570\u91cf",
    quantityPickerLead:
      "\u5148\u8c03\u6574\u6570\u91cf\uff0c\u518d\u5c06\u6b64\u5546\u54c1\u52a0\u5165\u8d2d\u7269\u8f66\u3002",
    quantityPickerConfirm: "\u7acb\u5373\u52a0\u5165",
    quantityPickerCancel: "\u53d6\u6d88",
    cartSummaryTitle: "\u8ba2\u5355\u6458\u8981",
    checkoutTitle: "Pi \u652f\u4ed8",
    checkoutLead:
      "\u5148\u767b\u5f55 Pi\uff0c\u786e\u8ba4\u6536\u8d27\u5730\u5740\uff0c\u518d\u4e3a\u6574\u4e2a\u8d2d\u7269\u8f66\u652f\u4ed8\u3002",
    checkoutHint:
      "\u652f\u4ed8\u6210\u529f\u540e\uff0c\u8ba2\u5355\u4f1a\u4fdd\u5b58\u5230\u4e2a\u4eba\u4e2d\u5fc3\u3002",
    shippingAddressTitle: "\u6536\u8d27\u5730\u5740",
    shippingAddressLead:
      "\u4e0b\u5355\u524d\u5148\u9009\u62e9\u5df2\u4fdd\u5b58\u5730\u5740\uff0c\u6216\u8005\u65b0\u589e\u4e00\u4e2a\u5730\u5740\u3002",
    savedAddressesTitle: "\u5df2\u4fdd\u5b58\u5730\u5740",
    noSavedAddresses:
      "\u8fd8\u6ca1\u6709\u4fdd\u5b58\u7684\u5730\u5740\uff0c\u8bf7\u5148\u5728\u4e0b\u65b9\u65b0\u5efa\u4e00\u4e2a\u3002",
    addAddressTitle: "\u65b0\u589e\u5730\u5740",
    fullName: "\u6536\u4ef6\u4eba\u59d3\u540d",
    phone: "\u7535\u8bdd\u53f7\u7801",
    addressLine1: "\u8857\u9053\u5730\u5740",
    addressLine2: "\u516c\u5bd3\uff0c\u697c\u680b\uff0c\u697c\u5c42",
    ward: "\u8857\u9053 / \u793e\u533a",
    district: "\u533a / \u53bf",
    city: "\u57ce\u5e02",
    country: "\u56fd\u5bb6",
    note: "\u914d\u9001\u5907\u6ce8",
    setAsDefault: "\u8bbe\u4e3a\u9ed8\u8ba4",
    saveAddress: "\u4fdd\u5b58\u5730\u5740",
    defaultAddress: "\u9ed8\u8ba4",
    selectedAddress: "\u5df2\u9009\u62e9",
    addressRequired:
      "\u8bf7\u5148\u9009\u62e9\u6216\u4fdd\u5b58\u4e00\u4e2a\u6536\u8d27\u5730\u5740\uff0c\u518d\u8fdb\u884c\u4e0b\u5355\u3002",
    placeOrder: "\u4f7f\u7528 Pi \u4e0b\u5355",
    placingOrder: "\u6b63\u5728\u51c6\u5907 Pi \u652f\u4ed8...",
    signInToCheckout: "\u4f7f\u7528 Pi \u767b\u5f55",
    checkoutSignedInAs: "\u5df2\u767b\u5f55\u4e3a",
    paymentSuccess: "\u8ba2\u5355\u5df2\u4fdd\u5b58\u5230\u4f60\u7684\u8d26\u6237\u3002",
    accountPageTitle: "\u4e2a\u4eba\u4e2d\u5fc3 | Mushroom.Pi",
    accountPageDescription:
      "\u67e5\u770b Mushroom.Pi \u7684 Pi \u767b\u5f55\u72b6\u6001\uff0c\u5df2\u4fdd\u5b58\u5730\u5740\u548c\u672c\u5730\u8ba2\u5355\u8bb0\u5f55\u3002",
    accountTitle: "\u4e2a\u4eba\u4e2d\u5fc3",
    accountLead:
      "\u5728\u4e00\u4e2a\u5730\u65b9\u7ba1\u7406 Pi \u8eab\u4efd\uff0c\u6536\u8d27\u5730\u5740\u548c\u8ba2\u5355\u8bb0\u5f55\u3002",
    statusTitle: "Pi \u7528\u6237\u72b6\u6001",
    statusSignedIn:
      "\u4f60\u7684 Pi \u8d26\u6237\u5df2\u5728\u5f53\u524d\u6d4f\u89c8\u5668\u4e2d\u8fde\u63a5\u3002",
    statusGuest:
      "\u5f53\u524d\u8fd8\u6ca1\u6709\u8fde\u63a5 Pi \u8d26\u6237\u3002\u53ea\u8981\u5728 checkout \u4e2d\u767b\u5f55\uff0c\u8fd9\u91cc\u5c31\u4f1a\u81ea\u52a8\u663e\u793a\u3002",
    usernameLabel: "\u7528\u6237\u540d",
    walletLabel: "\u94b1\u5305",
    orderHistoryTitle: "\u6700\u8fd1\u8ba2\u5355",
    noOrders: "\u8fd8\u6ca1\u6709\u672c\u5730\u8ba2\u5355\u3002",
    addressBookTitle: "\u5df2\u4fdd\u5b58\u5730\u5740",
    addressBookLead:
      "\u5728 checkout \u4e2d\u521b\u5efa\u7684\u5730\u5740\u4f1a\u4fdd\u7559\u5728\u8fd9\u91cc\uff0c\u4ee5\u4fbf\u4e0b\u6b21\u66f4\u5feb\u4e0b\u5355\u3002",
    noAddresses: "\u8fd8\u6ca1\u6709\u4fdd\u5b58\u5730\u5740\u3002",
    deliverTo: "\u914d\u9001\u81f3",
    cartShortcut: "\u6253\u5f00\u8d2d\u7269\u8f66",
    browseShop: "\u524d\u5f80\u5546\u5e97",
  },
};

export function getStorefrontCopy(locale: SiteLocale) {
  return copy[locale];
}
