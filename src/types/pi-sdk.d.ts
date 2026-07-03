import type {
  PiAuthResult,
  PiPaymentData,
  PiPaymentDto,
  PiScope,
} from "@/lib/pi-types";

export {};

declare global {
  interface Window {
    Pi?: {
      init(options: { version: "2.0"; sandbox?: boolean }): void;
      authenticate(
        scopes: PiScope[],
        onIncompletePaymentFound: (payment: PiPaymentDto) => void,
      ): Promise<PiAuthResult>;
      createPayment(
        paymentData: PiPaymentData,
        callbacks: {
          onReadyForServerApproval: (paymentId: string) => void;
          onReadyForServerCompletion: (
            paymentId: string,
            txid: string,
          ) => void;
          onCancel: (paymentId: string) => void;
          onError: (error: Error, payment?: PiPaymentDto) => void;
        },
      ): void;
    };
  }
}
