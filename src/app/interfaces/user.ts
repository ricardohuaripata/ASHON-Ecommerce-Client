export interface User {
  _id?: string;
  name?: string;
  username?: string;
  email: string;
  password: string;
  passwordConfirmation?: string;
  role?: 'user' | 'admin' | 'seller';
  isEmailVerified?: boolean;
  passwordChangedAt?: Date;
  address?: string;
  companyName?: string;
  phone?: string;
  discountCode?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
