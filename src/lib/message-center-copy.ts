import type { SiteLocale } from "@/lib/i18n";

export type MessageCenterCopy = {
  adminEmpty: string;
  adminLead: string;
  adminReplyPlaceholder: string;
  adminTitle: string;
  allMessages: string;
  customer: string;
  emptyBody: string;
  emptyTitle: string;
  linkedOrder: string;
  loading: string;
  messageBodyLabel: string;
  messagePageDescription: string;
  messagePageTitle: string;
  messages: string;
  noLinkedOrder: string;
  orderSelectLabel: string;
  refresh: string;
  send: string;
  sending: string;
  sendFailed: string;
  sendSuccess: string;
  signInBody: string;
  signInButton: string;
  signInTitle: string;
  shop: string;
  system: string;
  thread: string;
  user: string;
  userLead: string;
  userPlaceholder: string;
  userTitle: string;
};

const copy: Record<SiteLocale, MessageCenterCopy> = {
  en: {
    adminEmpty: "No conversations yet.",
    adminLead: "Reply to customers and review automatic order updates from one inbox.",
    adminReplyPlaceholder: "Write a reply to this customer...",
    adminTitle: "Shop inbox",
    allMessages: "All messages",
    customer: "Customer",
    emptyBody: "When you send a question or the shop updates an order, the conversation will appear here.",
    emptyTitle: "No messages yet",
    linkedOrder: "Linked order",
    loading: "Loading messages...",
    messageBodyLabel: "Message",
    messagePageDescription: "Message Mushroom.Pi about products and orders.",
    messagePageTitle: "Messages | Mushroom.Pi",
    messages: "Messages",
    noLinkedOrder: "General question",
    orderSelectLabel: "Attach to order",
    refresh: "Refresh",
    send: "Send message",
    sending: "Sending...",
    sendFailed: "Could not send the message. Please try again.",
    sendSuccess: "Message sent.",
    signInBody: "Sign in with Pi to message the shop and follow order updates.",
    signInButton: "Sign in with Pi",
    signInTitle: "Sign in to message the shop",
    shop: "Shop",
    system: "System",
    thread: "Conversation",
    user: "You",
    userLead: "Ask Mushroom.Pi about products, delivery, or a specific order.",
    userPlaceholder: "Type your question for Mushroom.Pi...",
    userTitle: "Message the shop",
  },
  vi: {
    adminEmpty: "Chưa có cuộc trò chuyện nào.",
    adminLead: "Trả lời khách hàng và xem tin tự động theo đơn trong một hộp thư.",
    adminReplyPlaceholder: "Viết phản hồi cho khách hàng này...",
    adminTitle: "Hộp thư shop",
    allMessages: "Tất cả tin nhắn",
    customer: "Khách hàng",
    emptyBody: "Khi bạn gửi câu hỏi hoặc shop cập nhật đơn hàng, cuộc trò chuyện sẽ hiện ở đây.",
    emptyTitle: "Chưa có tin nhắn",
    linkedOrder: "Đơn hàng liên quan",
    loading: "Đang tải tin nhắn...",
    messageBodyLabel: "Nội dung tin nhắn",
    messagePageDescription: "Nhắn tin với Mushroom.Pi về sản phẩm và đơn hàng.",
    messagePageTitle: "Tin nhắn | Mushroom.Pi",
    messages: "Tin nhắn",
    noLinkedOrder: "Câu hỏi chung",
    orderSelectLabel: "Gắn với đơn hàng",
    refresh: "Làm mới",
    send: "Gửi tin nhắn",
    sending: "Đang gửi...",
    sendFailed: "Chưa gửi được tin nhắn. Bạn thử lại giúp mình nhé.",
    sendSuccess: "Đã gửi tin nhắn.",
    signInBody: "Đăng nhập bằng Pi để nhắn với shop và theo dõi cập nhật đơn hàng.",
    signInButton: "Đăng nhập bằng Pi",
    signInTitle: "Đăng nhập để nhắn shop",
    shop: "Shop",
    system: "Hệ thống",
    thread: "Cuộc trò chuyện",
    user: "Bạn",
    userLead: "Hỏi Mushroom.Pi về sản phẩm, giao hàng hoặc một đơn hàng cụ thể.",
    userPlaceholder: "Nhập câu hỏi của bạn cho Mushroom.Pi...",
    userTitle: "Nhắn tin với shop",
  },
  es: {
    adminEmpty: "Aun no hay conversaciones.",
    adminLead: "Responde a clientes y revisa actualizaciones automaticas de pedidos.",
    adminReplyPlaceholder: "Escribe una respuesta para este cliente...",
    adminTitle: "Bandeja de tienda",
    allMessages: "Todos los mensajes",
    customer: "Cliente",
    emptyBody: "Cuando envies una pregunta o la tienda actualice un pedido, aparecera aqui.",
    emptyTitle: "Sin mensajes",
    linkedOrder: "Pedido vinculado",
    loading: "Cargando mensajes...",
    messageBodyLabel: "Mensaje",
    messagePageDescription: "Escribe a Mushroom.Pi sobre productos y pedidos.",
    messagePageTitle: "Mensajes | Mushroom.Pi",
    messages: "Mensajes",
    noLinkedOrder: "Pregunta general",
    orderSelectLabel: "Vincular a pedido",
    refresh: "Actualizar",
    send: "Enviar mensaje",
    sending: "Enviando...",
    sendFailed: "No se pudo enviar el mensaje. Intentalo de nuevo.",
    sendSuccess: "Mensaje enviado.",
    signInBody: "Inicia sesion con Pi para escribir a la tienda y seguir pedidos.",
    signInButton: "Iniciar sesion con Pi",
    signInTitle: "Inicia sesion para escribir",
    shop: "Tienda",
    system: "Sistema",
    thread: "Conversacion",
    user: "Tu",
    userLead: "Pregunta sobre productos, entrega o un pedido especifico.",
    userPlaceholder: "Escribe tu pregunta para Mushroom.Pi...",
    userTitle: "Escribir a la tienda",
  },
  fr: {
    adminEmpty: "Aucune conversation pour le moment.",
    adminLead: "Repondez aux clients et suivez les mises a jour automatiques des commandes.",
    adminReplyPlaceholder: "Ecrivez une reponse pour ce client...",
    adminTitle: "Boite de reception",
    allMessages: "Tous les messages",
    customer: "Client",
    emptyBody: "Vos questions et les mises a jour de commande apparaitront ici.",
    emptyTitle: "Aucun message",
    linkedOrder: "Commande liee",
    loading: "Chargement des messages...",
    messageBodyLabel: "Message",
    messagePageDescription: "Contacter Mushroom.Pi au sujet des produits et commandes.",
    messagePageTitle: "Messages | Mushroom.Pi",
    messages: "Messages",
    noLinkedOrder: "Question generale",
    orderSelectLabel: "Associer a une commande",
    refresh: "Actualiser",
    send: "Envoyer",
    sending: "Envoi...",
    sendFailed: "Impossible d'envoyer le message. Reessayez.",
    sendSuccess: "Message envoye.",
    signInBody: "Connectez-vous avec Pi pour contacter la boutique et suivre vos commandes.",
    signInButton: "Connexion Pi",
    signInTitle: "Connectez-vous pour contacter la boutique",
    shop: "Boutique",
    system: "Systeme",
    thread: "Conversation",
    user: "Vous",
    userLead: "Posez une question sur les produits, la livraison ou une commande.",
    userPlaceholder: "Ecrivez votre question pour Mushroom.Pi...",
    userTitle: "Contacter la boutique",
  },
  zh: {
    adminEmpty: "暂无会话。",
    adminLead: "在一个收件箱中回复客户并查看订单自动更新。",
    adminReplyPlaceholder: "给这位客户回复...",
    adminTitle: "店铺收件箱",
    allMessages: "全部消息",
    customer: "客户",
    emptyBody: "当你发送问题或店铺更新订单时，会话会显示在这里。",
    emptyTitle: "暂无消息",
    linkedOrder: "关联订单",
    loading: "正在加载消息...",
    messageBodyLabel: "消息内容",
    messagePageDescription: "就产品和订单联系 Mushroom.Pi。",
    messagePageTitle: "消息 | Mushroom.Pi",
    messages: "消息",
    noLinkedOrder: "一般问题",
    orderSelectLabel: "关联订单",
    refresh: "刷新",
    send: "发送消息",
    sending: "发送中...",
    sendFailed: "消息发送失败，请重试。",
    sendSuccess: "消息已发送。",
    signInBody: "使用 Pi 登录后即可联系店铺并跟踪订单更新。",
    signInButton: "使用 Pi 登录",
    signInTitle: "登录后联系店铺",
    shop: "店铺",
    system: "系统",
    thread: "会话",
    user: "你",
    userLead: "向 Mushroom.Pi 咨询产品、配送或具体订单。",
    userPlaceholder: "输入你想咨询 Mushroom.Pi 的问题...",
    userTitle: "联系店铺",
  },
};

export function getMessageCenterCopy(locale: SiteLocale) {
  return copy[locale] ?? copy.en;
}
