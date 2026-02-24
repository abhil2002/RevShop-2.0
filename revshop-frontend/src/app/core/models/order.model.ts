export interface OrderItem {
  productName: string;
  quantity: number;
  price: number;
}

export interface Order {
  orderId: number;
  orderDate: string;
  status: string;
  paymentStatus: string;
  totalAmount: number;
  items: OrderItem[];
}