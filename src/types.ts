export type Category = "BBQ" | "Fast Food" | "Chinese" | "Desi" | "Drinks";

export interface MenuItem {
  id?: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  image: string;
  isAvailable: boolean;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export type OrderStatus = "pending" | "preparing" | "delivered" | "cancelled";

export interface Order {
  id?: string;
  customerName: string;
  phone: string;
  address: string;
  items: CartItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: any; // Firestore Timestamp
  orderId: string;
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}
