import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "./AuthContext";


const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
 
  const [orders, setOrders] = useState([]);
  

  const { user } = useAuth();
  

  const userId = user?.id || user?._id;


  useEffect(() => {
    
    if (!userId) return;

    
    const loadUserOrders = async () => {
      
      const res = await api.get(`/orders`);
      
     
      setOrders(res.data);
    };

 
    loadUserOrders();
  }, [userId]);


  const createNewOrder = async (orderData) => {
    const res = await api.post(`/orders`, orderData);
    
 
    setOrders((prev) => [...prev, res.data]);
    
    return res.data;
  };

  const cancelOrder = async (orderId, cancellationReason) => {
    const res = await api.patch(`/orders/${orderId}/cancel`, { cancellationReason });
    setOrders((prev) => prev.map(order => order.id === orderId ? res.data : order));
    return res.data;
  };

  return (
    <OrderContext.Provider value={{ orders, createNewOrder, cancelOrder }}>
      {children}
    </OrderContext.Provider>
  );
};


export const useOrders = () => useContext(OrderContext);
