import { Product } from './product';

export interface Color {
  _id: string;
  product?: Product[];
  color?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
