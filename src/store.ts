import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Role = 'visitor' | 'merchant' | 'admin';

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  status: 'pending' | 'approved';
  merchantId?: string;
}

export interface Order {
  id: string;
  items: Product[];
  total: number;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: number;
}

export interface Notification {
  id: string;
  text: string;
  type: 'order' | 'product_approval' | 'merchant_approval' | 'info';
  isRead: boolean;
  targetRole: Role;
  createdAt: number;
}

export interface MerchantRequest {
  id: string;
  name: string;
  status: 'pending' | 'approved';
  createdAt: number;
}

export interface AppState {
  role: Role;
  setRole: (role: Role) => void;
  
  merchantRequests: MerchantRequest[];
  addMerchantRequest: (name: string) => void;
  approveMerchantRequest: (id: string) => void;
  
  products: Product[];
  addProduct: (product: Product) => void;
  approveProduct: (id: string) => void;
  
  cart: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (id: string, status: Order['status']) => void;

  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'isRead' | 'createdAt'>) => void;
  markNotificationAsRead: (id: string) => void;
  markAllAsRead: () => void;
  
  restoreState: (state: Partial<AppState>) => void;
}

const defaultProducts: Product[] = [
  { id: '1', name: 'هاتف ذكي بلس', price: 1500, category: 'إلكترونيات', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80', status: 'approved' },
  { id: '2', name: 'سماعات رأس لاسلكية', price: 300, category: 'إلكترونيات', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80', status: 'approved' },
  { id: '3', name: 'ساعة رياضية مطورة', price: 450, category: 'إكسسوارات', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80', status: 'approved' },
];

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      role: 'visitor',
      setRole: (role) => set({ role }),
      
      merchantRequests: [],
      addMerchantRequest: (name) => set((state) => ({
        merchantRequests: [{ id: Math.random().toString(36).substr(2, 9), name, status: 'pending', createdAt: Date.now() }, ...state.merchantRequests]
      })),
      approveMerchantRequest: (id) => set((state) => ({
        merchantRequests: state.merchantRequests.map(r => r.id === id ? { ...r, status: 'approved' } : r)
      })),

      products: defaultProducts,
      addProduct: (product) => set((state) => ({ products: [...state.products, product] })),
      approveProduct: (id) => set((state) => ({
        products: state.products.map(p => p.id === id ? { ...p, status: 'approved' } : p)
      })),
      
      cart: [],
      addToCart: (product) => set((state) => ({ cart: [...state.cart, product] })),
      removeFromCart: (id) => set((state) => ({ cart: state.cart.filter((p) => p.id !== id) })),
      clearCart: () => set({ cart: [] }),
      
      orders: [],
      addOrder: (order) => set((state) => ({ orders: [order, ...state.orders] })),
      updateOrderStatus: (id, status) => set((state) => ({
        orders: state.orders.map(o => o.id === id ? { ...o, status } : o)
      })),

      notifications: [],
      addNotification: (notification) => set((state) => ({
        notifications: [{ ...notification, id: Math.random().toString(36).substr(2, 9), isRead: false, createdAt: Date.now() }, ...state.notifications]
      })),
      markNotificationAsRead: (id) => set((state) => ({
        notifications: state.notifications.map(n => n.id === id ? { ...n, isRead: true } : n)
      })),
      markAllAsRead: () => set((state) => ({
        notifications: state.notifications.map(n => ({ ...n, isRead: true }))
      })),

      restoreState: (newState) => set((state) => ({ ...state, ...newState })),
    }),
    {
      name: 'almgashy-storage',
    }
  )
);
