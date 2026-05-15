import React, { useEffect, useState } from "react";
import { FiUpload } from "react-icons/fi";
import ManualDropdown from "./ManualDropdown";
import api from "../../services/api";
import { toast } from "react-toastify";

const AddProducts = ({ mode, onClose, setNewProduct, newProduct }) => {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    
    if (
      mode === "edit" &&
      newProduct.image &&
      typeof newProduct.image === "string"
    ) {
      setImagePreview(newProduct.image.startsWith('http') ? newProduct.image : `/${newProduct.image}`);
    }
  }, [newProduct.image, mode, imageFile]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    
    if (name === "rating") {
      let num = parseFloat(value);

      if (num > 5) num = 5;
      if (num < 0) num = 0;

      setNewProduct((prev) => ({ ...prev, [name]: num }));
      return;
    }

    setNewProduct((prev) => ({ ...prev, [name]: files ? files[0] : value }));
  };

  const requiredFields = [
    "productName",
    "type",
    "price",
    "status",
    "brand",
    "model",
    "rating",
    "stockCount",
    "description",
  ];


  const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 60000,
      });

      if (!response?.data?.imageUrl) {
        throw new Error("Image upload succeeded but no Cloudinary URL was returned");
      }

      return response.data.imageUrl; 
    } catch (error) {
      const serverMessage = error?.response?.data?.message;
      throw new Error(serverMessage || error?.message || "Image upload failed");
    }
  };

  const handleAddProduct = async () => {
    
    for (const field of requiredFields) {
      if (!newProduct[field] || newProduct[field].toString().trim() === "") {
        toast.error(`Please fill ${field} field`);
        return;
      }
    }

    if (!imageFile) {
      toast.error("Please upload a product image!");
      return;
    }

    try {
      setIsUploading(true);
      toast.info("Uploading image to Cloudinary...", { autoClose: 2000 });
      
    
      const secureImageUrl = await uploadImageToCloudinary(imageFile);

    
      const finalProduct = {
        id: "PROD-" + Date.now() + "-" + Math.random().toString(36).substr(2, 5),
        productName: newProduct.productName,
        type: newProduct.type,
        price: newProduct.price,
        image: secureImageUrl, 
        status: newProduct.status,
        brand: newProduct.brand,
        model: newProduct.model,
        rating: newProduct.rating,
        stockCount: parseInt(newProduct.stockCount, 10),
        description: newProduct.description,
      };

     
      const response = await api.post("/products", finalProduct, { timeout: 15000 });

      if (response.status === 201 || response.status === 200) {
        toast.success("Product added to Database Successfully!");
        onClose(false);
      }
    } catch (error) {
      const serverMessage = error?.response?.data?.message;
      toast.error(serverMessage || error?.message || "Failed to add product");
      console.error("Failed to add products:", error?.response?.data || error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleUpdateProduct = async () => {
    try {
      setIsUploading(true);
      let finalImageUrl = newProduct.image;
    
      if (imageFile) {
        toast.info("Uploading new image to Cloudinary...", { autoClose: 2000 });
        finalImageUrl = await uploadImageToCloudinary(imageFile);
      }

      const updatedProduct = {
        ...newProduct,
        image: finalImageUrl,
      };

      const response = await api.put(`/products/${updatedProduct.id}`, updatedProduct, { timeout: 15000 });

      if (response.status === 201 || response.status === 200) {
        toast.success("Product updated successfully!");
        onClose(false);
      }
    } catch (error) {
      const serverMessage = error?.response?.data?.message;
      toast.error(serverMessage || error?.message || "Failed to update product");
      console.error("Something went wrong while updating product:", error?.response?.data || error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-7 mb-8">
      <h3 className="text-xl font-semibold text-gray-800 mb-6">
        Add New Product
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Product Name */}
        <div className="flex flex-col">
          <label className="text-gray-500 text-sm mb-1">Product Name</label>
          <input
            type="text"
            className="px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-700"
            placeholder="product name"
            name="productName"
            onChange={handleChange}
            value={newProduct.productName}
          />
        </div>

        {/* Price */}
        <div className="flex flex-col">
          <label className="text-gray-500 text-sm mb-1">Price (₹)</label>
          <input
            type="number"
            className="px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-700"
            placeholder="1999"
            name="price"
            onChange={handleChange}
            value={newProduct.price}
          />
        </div>

        {/* type */}
        <div className="flex justify-between">
          <div className="flex flex-col">
            <label className="text-gray-500 text-sm mb-1">Type</label>
            <ManualDropdown
              options={["Headphone", "TWS", "Speaker"]}
              selected={newProduct.type}
              onSelect={(value) =>
                handleChange({ target: { name: "type", value } })
              }
            />
          </div>

          {/* Status */}
          <div className="flex flex-col">
            <label className="text-gray-500 text-sm mb-1">Status</label>
            <ManualDropdown
              selected={newProduct.status}
              options={["Flagship", "Bestseller", "Budget"]}
              onSelect={(value) =>
                handleChange({ target: { name: "status", value } })
              }
            />
          </div>
        </div>

        {/* Image Upload */}
        <div className="flex flex-col">
          <label className="text-gray-500 text-sm mb-2">Product Image</label>

          <label className="flex items-center justify-between px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-pointer hover:bg-gray-100 transition">
            <div className="flex items-center gap-3">
              <FiUpload className="text-gray-500" size={18} />
              <span className="text-gray-400">
                {imageFile ? imageFile.name : "Upload Image"}
              </span>
            </div>

            {imagePreview && (
              <img
                src={imagePreview}
                className="w-10 h-10 rounded-lg object-cover border"
                alt="preview"
              />
            )}

            <input
              type="file"
              accept="image/*"
              className="hidden"
              name="image"
              onChange={handleImageChange}
            />
          </label>
        </div>

        {/* Brand */}
        <div className="flex flex-col">
          <label className="text-gray-500 text-sm mb-1">Brand</label>
          <input
            type="text"
            name="brand"
            placeholder="Sony"
            onChange={handleChange}
            value={newProduct.brand}
            className="px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 
               focus:outline-none focus:ring-2 focus:ring-gray-700"
          />
        </div>

        {/* Model */}
        <div className="flex flex-col">
          <label className="text-gray-500 text-sm mb-1">Model</label>
          <input
            type="text"
            name="model"
            placeholder="WF-1000XM5"
            onChange={handleChange}
            value={newProduct.model}
            className="px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 
               focus:outline-none focus:ring-2 focus:ring-gray-700"
          />
        </div>

        {/* Rating */}
        <div className="flex flex-col">
          <label className="text-gray-500 text-sm mb-1">Rating (0 - 5)</label>
          <input
            type="number"
            name="rating"
            step="0.1"
            min="0"
            max="5"
            placeholder="4.3"
            onChange={handleChange}
            value={newProduct.rating}
            className="px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 
               focus:outline-none focus:ring-2 focus:ring-gray-700"
          />
        </div>

        {/* Stock Count */}
        <div className="flex flex-col">
          <label className="text-gray-500 text-sm mb-1">Stock Count</label>
          <input
            type="number"
            name="stockCount"
            min="0"
            placeholder="100"
            onChange={handleChange}
            value={newProduct.stockCount}
            className="px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 
               focus:outline-none focus:ring-2 focus:ring-gray-700"
          />
        </div>

        {/* Description */}
        <div className="flex flex-col">
          <label className="text-gray-500 text-sm mb-1">Description</label>
          <textarea
            name="description"
            placeholder="Describe the sound quality, features, build, etc."
            rows={4}
            onChange={handleChange}
            value={newProduct.description}
            className="px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 
               focus:outline-none focus:ring-2 focus:ring-gray-700 resize-none"
          ></textarea>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end mt-8 gap-3">
        {/* Cancel Button */}
        <button
          className="px-6 py-2.5 bg-red-500 text-white rounded-lg font-medium shadow-sm 
               hover:bg-red-600 transition"
          onClick={() => onClose(false)}
        >
          Cancel
        </button>

        {/* Add Button */}
        {mode === "add" ? (
          <button
            disabled={isUploading}
            className={`px-6 py-2.5 text-white rounded-lg font-medium shadow-sm transition ${isUploading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
            onClick={handleAddProduct}
          >
            {isUploading ? "Uploading..." : "Add Product"}
          </button>
        ) : (
          <button
            disabled={isUploading}
            className={`px-6 py-2.5 text-white rounded-lg font-medium shadow-sm transition ${isUploading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
            onClick={handleUpdateProduct}
          >
            {isUploading ? "Uploading..." : "Edit Product"}
          </button>
        )}
      </div>
    </div>
  );
};

export default AddProducts;
