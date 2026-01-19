import { createContext, useContext, useState } from "react";

export type Order = {
  id: number;
  totalPrice: number;
  createdAt: string;
  items: any[];
};

const OrderContext = createContext<any>(null);

export const OrderProvider = ({ children }: any) => {
  const [orders, setOrders] = useState<Order[]>([]);

  const addOrder = (order: Order) => {
    setOrders((prev) => [order, ...prev]);
  };

  return (
    <OrderContext.Provider value={{ orders, addOrder }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => useContext(OrderContext);
