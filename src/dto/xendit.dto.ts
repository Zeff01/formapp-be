export class IXenditInvoiceBodyData {
  external_id: string;
  currency: string;
  amount: number;
  failure_redirect_url: string;
  success_redirect_url: string;
  payer_email: string;
  description: string;
}

export interface IInvoiceTransactionOutput {
  id: string;
  user_id: string;
  external_id: string;
  is_high: boolean;
  status: string;
  merchant_name: string;
  amount: number;
  created: string;
  updated: string;
  payer_email: string;
  description: string;
  payment_id: string;
  paid_amount: number;
  payment_method: string;
  ewallet_type: string;
  currency: string;
  paid_at: string;
  payment_channel: string;
  payment_method_id: string;
}

export interface IXenditPayoutOutput {
  id?: string;
  amount?: number;
  channel_code?: string;
  currency?: string;
  description?: string;
  reference_id?: string;
  status?: string;
  created?: string;
  updated?: string;
  estimated_arrival_time?: string;
  business_id?: string;
  channel_properties?: {
    account_number?: string;
    account_holder_name?: string;
  };
  receipt_notification?: {
    email_to?: string[];
    email_cc?: string[];
    email_bcc?: string[];
  };
}

export interface IXenditPayoutDto {
  reference_id: string;
  channel_properties: {
    account_number: string;
    account_holder_name: string;
  };
  amount: number;
  description: string;
  receipt_notification: {
    email_to: string[];
    email_cc: string[];
    email_bcc?: string[];
  };
  metadata?: any;
}
