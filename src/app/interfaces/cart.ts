import { Product } from './product';
import { Color } from './color';
import { Size } from './size';

export interface Cart {
  _id?: string;
  email: string;
  items: CartItem[];
  totalPrice: number;
  totalQuantity: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CartItem {
  _id?: string;
  product: string;
  selectedColor: Color;
  selectedSize: Size;
  totalProductQuantity: number;
  totalProductPrice: number;
}
