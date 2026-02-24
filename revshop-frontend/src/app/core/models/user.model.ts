export enum Role {
  BUYER = 'BUYER',
  SELLER = 'SELLER'
}

export interface User {
  id?: number;
  name: string;
  email: string;
  password?: string;
  phone: string;
  address: string;
  role: Role;
}

export interface RegisterRequest extends User {}