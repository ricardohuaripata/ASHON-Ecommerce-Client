import { Category } from './category';
import { Color } from './color';
import { Size } from './size';
import { User } from './user';

export interface Product {
  _id: string;
  name?: string;
  slug?: string;
  mainImage?: string;
  mainImageId?: string;
  images?: string[];
  imagesId?: string[];
  description?: string;
  category?: Category;
  genre?: string;
  seller?: User;
  price: number;
  priceAfterDiscount: number;
  priceDiscount?: number;
  colors?: Color[];
  sizes?: Size[];
  quantity?: number;
  sold?: number;
  isOutOfStock?: boolean;
  ratingsAverage?: number;
  ratingsQuantity?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
