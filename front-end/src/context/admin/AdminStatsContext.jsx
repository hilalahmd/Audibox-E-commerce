import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../../services/api";

const AdminStatsContext = createContext();

export const AdminStatsProvider = ({ children }) => {
  const [stats, setStats] = useState({
    users: [],
    orders: [],
    products: [],
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    revenue: 0,
  });

  useEffect(() => {
    const loadStats = async () => {
      const [users, products, orders] = await Promise.all([
        api.get("/users"),
        api.get("/products?status=all"),
        api.get("/orders"),
      ]);

      const revenue = orders.data.reduce(
        (sum, item) => sum + (Number(item.total) || 0),
        0
      );

      setStats({
        users: users.data,
        orders: orders.data,
        products: products.data,
        totalUsers: users.data.length,
        totalProducts: products.data.length,
        totalOrders: orders.data.length,
        revenue: revenue.toFixed(2),
      });
    };

    loadStats();
  }, []);

  return (
    <AdminStatsContext.Provider value={{ stats, setStats }}>
      {children}
    </AdminStatsContext.Provider>
  );
};

export const useAdminStats = () => useContext(AdminStatsContext);
