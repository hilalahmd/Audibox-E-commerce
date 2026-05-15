import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";


const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [bestsellers, setBestsellers] = useState([]);
  const [products, setProducts] = useState([]);
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {

        const [bestsellersResponse, productsResponse] = await Promise.all([
          api.get("/bestsellers"),
          api.get("/products")
        ]);

        setBestsellers(bestsellersResponse.data);
        setProducts(productsResponse.data);
      } catch (err) {
        console.error("Error while loading datas:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);


  return (
    <ProductContext.Provider value={{ bestsellers, products, loading }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => useContext(ProductContext);
