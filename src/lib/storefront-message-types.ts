export type StorefrontMessageSender = "user" | "shop" | "system";

export type StorefrontMessage = {
  body: string;
  createdAt: string;
  eventType: string;
  id: string;
  isReadByShop: boolean;
  isReadByUser: boolean;
  orderId?: string;
  piUid: string;
  senderLabel: string;
  senderType: StorefrontMessageSender;
  username?: string;
};
