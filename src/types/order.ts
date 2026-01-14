
export type Order = {
  id: string;
  customer: string;
  email: string;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Canceled';
  total: number;
  date: string;
  paypalId: string;
  trackingNumber: string;
  shippingAddress: {
    fullName: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  items: {
    id: string;
    name: string;
    quantity: number;
    price: number;
  }[];
  discount?: number;
};
