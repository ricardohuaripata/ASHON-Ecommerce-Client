import { Product } from './product';
import { Color } from './color';
import { Size } from './size';

export interface Order {
  _id?: string;
  products: OrderProduct[]; // Puedes ajustar el tipo de datos de "products" según tu caso
  user: string;
  totalPrice: number;
  isPaid: boolean;
  paidAt?: Date;
  isDelivered: boolean;
  deliveredAt?: Date;
  shippingAddress: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: string;
  paymentStripeId?: string;
  taxPrice: number;
  shippingPrice: number;
  phone: string;
  status:
    | 'Not Processed'
    | 'Processing'
    | 'Shipped'
    | 'Delivered'
    | 'Cancelled';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface OrderProduct {
  _id?: string;
  product: string;
  selectedColor: Color;
  selectedSize: Size;
  totalProductQuantity: number;
  totalProductPrice: number;
}
