import React, { useEffect, useState } from "react";
import StatusDropdown from "../../components/admin/StatusDropdown";
import { useAdminStats } from "../../context/admin/AdminStatsContext";
import api from "../../services/api";
import toast from "react-hot-toast";

const AdminOrders = () => {
  const { stats } = useAdminStats();
  const [ordersList, setOrdersList] = useState(stats.orders || []);
  const [searchQuery, setSearchQuery] = useState("");

  // setting orders to state and handling backend search
  useEffect(() => {
    if (!searchQuery) {
      if (stats.orders) {
        setOrdersList(stats.orders);
      }
      return;
    }

    const fetchFilteredOrders = async () => {
      try {
        const response = await api.get(`/orders?search=${searchQuery}`);
        setOrdersList(response.data);
      } catch (error) {
        console.error("Failed to fetch filtered orders:", error);
      }
    };

    const timer = setTimeout(() => {
      fetchFilteredOrders();
    }, 400); // Debounce to prevent excessive API calls

    return () => clearTimeout(timer);
  }, [stats.orders, searchQuery]);

  // handle status
  const handleStatusChange = async (newStatus, orderId) => {
    try {
      const response = await api.patch(`/orders/${orderId}`, {
        status: newStatus,
      });

      if (response.status === 200 || response.status === 201) {
        setOrdersList((prev) =>
          prev.map((order) =>
            order.id === orderId ? { ...order, status: newStatus } : order
          )
        );

        toast.success("Order status updated");
      }
    } catch (error) {
      toast.error("Failed to update status");
      console.error("Failed to update order status:", error);
    }
  };

  // date formatter
  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <div className="p-6 w-full min-h-screen bg-gray-50">
      {/* Page Title */}
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Orders</h1>

      {/* Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Search Order ID"
            className="px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-700"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Orders ({ordersList.length})
        </h2>

        <div className="w-full overflow-x-auto pb-4">
          <table className="w-full text-left min-w-[1000px]">
          <thead>
            <tr className="border-b text-gray-600">
              <th className="py-2 w-[12%]">Order ID</th>
              <th className="py-2 w-[15%]">Customer</th>
              <th className="py-2 w-[18%]">Products</th>
              <th className="py-2 w-[10%]">Total</th>
              <th className="py-2 w-[25%]">Address</th>
              <th className="py-2 w-[10%]">Date</th>
              <th className="py-2 w-[10%]">Status</th>
            </tr>
          </thead>

          <tbody className="text-gray-700">
            {ordersList.sort((a, b) => new Date(b.date) - new Date(a.date)).map((order) => {
              // Find the user to display their username
              const orderUser = stats.users?.find(u => u.id === order.userId || u._id === order.userId);
              const displayName = orderUser?.username || (order.address?.firstName ? `${order.address.firstName} ${order.address.lastName}` : "Unknown User");

              return (
                <tr key={order.id || order.orderId} className="border-b hover:bg-gray-50/50 transition-colors">
                  <td className="py-3 font-medium text-xs text-gray-500">#{order.id}</td>

                  <td className="py-3">
                    <div className="flex flex-col">
                      <span className="font-bold text-sm text-gray-900">{displayName}</span>
                      {orderUser?.email && <span className="text-[10px] text-gray-400">{orderUser.email}</span>}
                    </div>
                  </td>

                  <td className="py-3 text-sm text-gray-500">
                    {(() => {
                      const names = order.items?.map((item) => item.productName) || [];

                      if (names.length === 0) return "Unknown";
                      if (names.length === 1) return names[0];

                      return `${names[0]} + ${names.length - 1} more`;
                    })()}
                  </td>

                  <td className="py-3 font-medium">₹{order.total?.toLocaleString() || order.total}</td>

                  <td className="py-3 text-xs text-gray-500 max-w-[200px] truncate">
                    {order.address?.address}
                    {order.address?.city && `, ${order.address.city}`}
                    <br />
                    {order.address?.country}
                  </td>

                  <td className="py-3 text-xs">
                    {formatDate(order.date)}
                  </td>

                  <td className="py-3">
                    <StatusDropdown
                      value={order.status}
                      onChange={(newStatus) =>
                        handleStatusChange(newStatus, order.id)
                      }
                    />
                  </td>
                </tr>
              );
            })}

            {ordersList.length === 0 && (
              <tr>
                <td colSpan="7" className="py-6 text-center text-gray-500">
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
