import { Product } from './product';

export interface Size {
  _id: string;
  product?: Product[];
  size?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
