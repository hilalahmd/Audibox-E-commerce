import React, { useState } from "react";
import { FiEdit, FiPlus, FiCheckCircle, FiSlash } from "react-icons/fi";
import ManualDropdown from "../../components/admin/ManualDropdown";
import { useAdminStats } from "../../context/admin/AdminStatsContext";
import AddProducts from "../../components/admin/AddProducts";
import api from "../../services/api";
import { toast } from "react-toastify";

const AdminProducts = () => {
  const { stats, setStats } = useAdminStats();
  const products = stats.products || [];

  const emptyProduct = {
    productName: "",
    type: "",
    price: "",
    image: "",
    status: "",
    brand: "",
    model: "",
    rating: "3",
    stockCount: 0,
    description: "",
  };

  const [isAdding, setIsAdding] = useState(false);
  const [newProduct, setNewProduct] = useState(emptyProduct);

  const [isEditing, setIsEditing] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");

  /* ---------------- FILTER PRODUCTS ---------------- */

  const filteredProducts = products.filter((product) => {
    return (
      product.productName
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      product.type
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
  });

  /* ---------------- ADD PRODUCT ---------------- */

  const handleAdd = () => {
    setIsEditing(false);
    setEditProduct(null);
    setNewProduct(emptyProduct);
    setIsAdding(true);
  };

  /* ---------------- EDIT PRODUCT ---------------- */

  const handleEditProduct = (product) => {
    setIsEditing(true);
    setEditProduct(product);
    setNewProduct(product);
    setIsAdding(false);
  };

  /* ---------------- ENABLE / DISABLE PRODUCT ---------------- */

  const handleToggleActive = async (product) => {
    const confirmAction = window.confirm(
      `Are you sure you want to ${
        product.isActive ? "Disable" : "Enable"
      } this product?`
    );

    if (!confirmAction) return;

    try {
      const updatedStatus =
        product.isActive === false ? true : false;
      
      const action = updatedStatus ? "enable" : "disable";

      const response = await api.patch(`/products/${product.id}/${action}`);

      if (
        response.status === 200 ||
        response.status === 201
      ) {
        toast.success(
          `Product ${
            updatedStatus ? "Enabled" : "Disabled"
          } successfully`
        );

        /* Update local state safely */

        setStats((prev) => ({
          ...prev,
          products: prev.products.map((item) =>
            item.id === product.id
              ? {
                  ...item,
                  isActive: updatedStatus,
                }
              : item
          ),
        }));
      }
    } catch (error) {
      toast.error(
        "Failed to update product status"
      );

      console.error(
        "Toggle Product Error:",
        error
      );
    }
  };

  return (
    <div className="p-6 w-full min-h-screen bg-gray-50">
      {/* ---------------- TOP BAR ---------------- */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div className="flex gap-3">
          {/* Search */}

          <input
            type="text"
            placeholder="Search products"
            className="px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-700"
            onChange={(e) =>
              setSearchQuery(e.target.value)
            }
          />

          {/* Optional Dropdown */}

          {/* <ManualDropdown /> */}
        </div>

        {/* Add Product Button */}

        <button
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-md font-medium hover:bg-indigo-700 transition"
          onClick={handleAdd}
        >
          <FiPlus size={18} />
          Add Product
        </button>
      </div>

      {/* ---------------- MODAL ---------------- */}

      {(isAdding || isEditing) && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-6xl max-h-[90vh] overflow-y-auto overflow-x-hidden rounded-xl shadow-xl animate-fadeIn">
            <AddProducts
              mode={
                isAdding ? "add" : "edit"
              }
              onClose={
                isAdding
                  ? setIsAdding
                  : setIsEditing
              }
              setNewProduct={
                setNewProduct
              }
              newProduct={newProduct}
            />
          </div>
        </div>
      )}

      {/* ---------------- TABLE ---------------- */}

      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Products ({products.length})
        </h2>

        <div className="w-full overflow-x-auto pb-4">
          <table className="w-full text-left min-w-[900px]">
            <thead>
              <tr className="border-b text-gray-600">
                <th className="py-2">#ID</th>
                <th className="py-2">
                  Product Image
                </th>
                <th className="py-2">
                  Product Name
                </th>
                <th className="py-2">
                  Category
                </th>
                <th className="py-2">
                  Price
                </th>
                <th className="py-2">
                  Stock
                </th>
                <th className="py-2 text-center">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="text-gray-700">
              {filteredProducts.map(
                (product) => (
                  <tr
                    key={product.id}
                    className="border-b"
                  >
                    <td className="py-3">
                      {product.id}
                    </td>

                    <td className="py-3">
                      <div className="flex items-center justify-center w-20 h-20 mx-3 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                        <img
                          src={
                            product.image?.startsWith(
                              "http"
                            )
                              ? product.image
                              : `/${product.image}`
                          }
                          alt={
                            product.productName
                          }
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>

                    <td className="py-3">
                      {
                        product.productName
                      }

                      {product.isActive ===
                        false && (
                        <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-600 text-[10px] uppercase font-bold rounded-full">
                          Disabled
                        </span>
                      )}
                    </td>

                    <td className="py-3">
                      {product.type}
                    </td>

                    <td className="py-3">
                      ₹{product.price}
                    </td>

                    <td className="py-3 font-bold">
                      {product.stockCount ||
                        0}
                    </td>

                    {/* ACTIONS */}

                    <td className="py-3 text-center">
                      <div className="flex items-center justify-center gap-4">
                        {/* EDIT */}

                        <button
                          className="text-blue-400 hover:text-blue-500"
                          onClick={() =>
                            handleEditProduct(
                              product
                            )
                          }
                        >
                          <FiEdit size={18} />
                        </button>

                        {/* ENABLE / DISABLE */}

                        <button
                          onClick={() =>
                            handleToggleActive(
                              product
                            )
                          }
                          className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium transition
                            ${
                              product.isActive ===
                              false
                                ? "bg-green-100 text-green-700 hover:bg-green-200"
                                : "bg-red-100 text-red-700 hover:bg-red-200"
                            }
                          `}
                        >
                          {product.isActive ===
                          false ? (
                            <>
                              <FiCheckCircle size={14} />
                              Enable
                            </>
                          ) : (
                            <>
                              <FiSlash size={14} />
                              Disable
                            </>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;