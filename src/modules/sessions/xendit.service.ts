import axios from 'axios';
import {
  XCreateCustomerDto,
  IXenditInvoiceBodyData,
  IXenditPayoutDto,
  XCreateSubscriptionPlan,
} from '@/dto/xendit.dto';

interface Transaction {
  amount: number;
}
export default class XenditService {
  private readonly API_GATEWAY_URL = 'https://api.xendit.co';
  private readonly CHANNEL_CODE = 'PH_GCASH';
  private readonly CURRENCY = 'PHP';
  private readonly TYPE = 'INDIVIDUAL';
  private readonly RECUR_ACTION = 'PAYMENT';

  public async createInvoice(data: IXenditInvoiceBodyData) {
    try {
      const response = await axios.post(
        this.API_GATEWAY_URL + '/v2/invoices',
        {
          external_id: data.external_id!,
          currency: data.currency!,
          amount: data.amount!,
          failure_redirect_url: data.failure_redirect_url!,
          success_redirect_url: data.success_redirect_url!,
          payer_email: data.payer_email!,
          description: data.description!,
        },
        {
          timeout: 10000,
          auth: {
            username: process.env.XENDIT_API_KEY,
            password: '',
          },
        }
      );
      return response.data.invoice_url;
    } catch (error) {
      console.error('HTTP Request Error:', error);
      throw error;
    }
  }

  public async createPayout(data: IXenditPayoutDto) {
    try {
      const response = await axios.post(
        this.API_GATEWAY_URL + '/v2/payouts',
        {
          ...data,
          channel_code: this.CHANNEL_CODE,
          currency: this.CURRENCY,
        },
        {
          timeout: 10000,
          headers: {
            'Idempotency-key': `payout-${data.reference_id}`,
          },
          auth: {
            username: process.env.XENDIT_API_KEY,
            password: '',
          },
        }
      );
      // console.log('payout response', response.data);
      return response.data;
    } catch (error) {
      console.error('HTTP Request Error:', error);
      throw error;
    }
  }

  public async getInvoices() {
    try {
      const response = await axios.get(this.API_GATEWAY_URL + '/v2/invoices', {
        timeout: 10000,
        auth: {
          username: process.env.XENDIT_API_KEY,
          password: '',
        },
      });
      // console.log('invoice response', response.data);
      return response.data;
    } catch (error) {
      console.error('HTTP Request Error:', error);
      throw error;
    }
  }
  public async createCustomer(data: XCreateCustomerDto) {
    try {
      const response = await axios.post(
        this.API_GATEWAY_URL + '/customers',
        {
          ...data,
          type: this.TYPE,
        },
        {
          auth: {
            username: process.env.XENDIT_API_KEY,
            password: '',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('HTTP Request Error:', error);
      throw error;
    }
  }
  public async createRecurringPlan(data: XCreateSubscriptionPlan) {
    try {
      const response = await axios.post(
        this.API_GATEWAY_URL + '/recurring/plans',
        {
          ...data,
          recurring_action: this.RECUR_ACTION,
          currency: this.CURRENCY,
          schedule: {
            reference_id: data.reference_id,
            interval: 'DAY',
            interval_count: 1,
            retry_interval: 'DAY',
            retry_interval_count: 3,
            total_retry: 2,
            failed_attempt_notifications: [1, 2],
          },
          immediate_action_type: 'FULL_AMOUNT',
          notification_config: {
            recurring_created: ['EMAIL'],
            recurring_succeeded: ['EMAIL'],
            recurring_failed: ['EMAIL'],
          },
          failed_cycle_action: 'STOP',
          payment_link_for_failed_attempt: true,
          description: 'Formapp Premium Subscription',
          success_return_url: 'https://www.google.com/', //change to formapp
          failure_return_url: 'https://www.google.com/', //change to formapp
        },
        {
          auth: {
            username: process.env.XENDIT_API_KEY,
            password: '',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('HTTP Request Error:', error);
      throw error;
    }
  }
  public convertToGMT8(date: string) {
    let newDate = new Date(date);
    newDate.setTime(newDate.getTime() + 20 * 59 * 60 * 1000);

    return newDate;
  }
  public async getTransactionReport(from: string, to: string) {
    try {
      if (!from || !to) throw new Error('Date is required');

      const fromDate = this.convertToGMT8(from);
      const fromDateUTC = fromDate.toISOString();
      const toDate = this.convertToGMT8(to);
      const toDateUTC = toDate.toISOString();
      const response = await axios.get(
        this.API_GATEWAY_URL +
          `/transactions?currency=PHP&types=PAYMENT&statuses=SUCCESS&created[gte]=${fromDateUTC}&created[lte]=${toDateUTC}
          `,
        {
          timeout: 10000,
          auth: {
            username: process.env.XENDIT_API_KEY,
            password: '',
          },
        }
      );

      const result = response.data;

      let onlinePayment = 0;
      result.data.forEach((data: Transaction) => {
        const res = (onlinePayment += data.amount);
        return res;
      });
      return { result, onlinePayment };
    } catch (error) {
      console.error('HTTP Request Error:', error);
      throw error;
    }
  }
}
