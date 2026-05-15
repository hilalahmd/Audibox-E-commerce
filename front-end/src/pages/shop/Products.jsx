import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "../../components/layout/Footer";
import SubHead from "../../components/ui/SubHead";
import { useProducts } from "../../context/ProductContext";
import Header from "../../components/layout/Header";
import { IoFilter, IoClose } from "react-icons/io5";
import { useSearch } from "../../context/SearchContext";
import api from "../../services/api";
import Card from "../../components/ui/Card";
import { mirage } from "ldrs";

mirage.register();

const Products = () => {
  const { products, loading } = useProducts();
  const { searchTerm, results, setResults } = useSearch();
  const [filter, setFilter] = useState([]);
  const [isFiltering, setIsFiltering] = useState(false);
  const [showFilter, setShowFilter] = useState(false);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }

    const fetchLocalProducts = async () => {
      try {
        const response = await api.get(`/products?q=${searchTerm}`);
        setResults(response.data);
      } catch (error) {
        console.error("Error while fetching searched items", error);
      }
    };

    fetchLocalProducts();
  }, [searchTerm]);

  const finalProducts = searchTerm.trim() ? results : products;

  useEffect(() => {
    if (isFiltering) return;
    setFilter(finalProducts);
  }, [finalProducts, isFiltering]);

  const handleFilter = (filterType) => {
    setIsFiltering(true);
    let filtered = [...finalProducts];

    switch (filterType) {
      case "lowToHigh":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "highToLow":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "bestsellers":
        filtered = filtered.filter(item => item.status === "Bestseller");
        break;
      case "flagships":
        filtered = filtered.filter(item => item.status === "Flagship");
        break;
      case "budgets":
        filtered = filtered.filter(item => item.status === "Budget");
        break;
      case "reset":
        filtered = [...finalProducts];
        setIsFiltering(false);
        break;
      default:
        break;
    }

    setFilter(filtered);
    setShowFilter(false);
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-[#fafafa]">
        <l-mirage size="80" speed="2.5" color="#18181b"></l-mirage>
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-screen bg-[#fafafa] text-zinc-900 pb-24 font-sans selection:bg-emerald-100 selection:text-emerald-900">

      {/* 🌟 HEADER */}
      <div className="sticky top-0 z-50">
        <Header />
      </div>

      <div className="max-w-7xl mx-auto px-4 pt-10 lg:pt-32">

        {/* 🌟 TITLE + FILTER */}
        <div className="w-full flex justify-between items-end mb-12">
          <div className="flex flex-col gap-2">
            <SubHead head="All Products" sub="Explore the complete audio catalog" />
            <div className="w-24 h-[2px] bg-gradient-to-r from-zinc-200 to-transparent mt-2" />
          </div>

          {/* 🌟 FILTER BUTTON */}
          <div className="relative">
            <button
              onClick={() => setShowFilter(!showFilter)}
              className="flex items-center gap-3 px-6 py-3 bg-white border border-zinc-200 rounded-2xl hover:bg-zinc-50 hover:shadow-sm transition-all cursor-pointer group shadow-sm"
            >
              <span className="text-xs uppercase tracking-[0.3em] font-black text-zinc-500 group-hover:text-zinc-900 transition-colors">
                Sort & Filter
              </span>
              <IoFilter className="text-zinc-600 group-hover:rotate-180 transition-transform duration-500" />
            </button>

            {/* 🌟 FILTER DROPDOWN */}
            <AnimatePresence>
              {showFilter && (
                <>
                  <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="fixed inset-0 z-40 bg-zinc-900/10 backdrop-blur-sm" 
                    onClick={() => setShowFilter(false)} 
                  />
                  <motion.div 
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="absolute top-16 right-0 w-[240px] bg-white border border-zinc-200 rounded-3xl shadow-xl z-50 overflow-hidden"
                  >
                    <div className="p-4 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
                      <span className="text-[10px] uppercase tracking-widest text-zinc-400 font-black">
                        Preferences
                      </span>
                      <IoClose 
                        className="cursor-pointer text-zinc-400 hover:text-zinc-900 transition-colors" 
                        onClick={() => setShowFilter(false)} 
                        size={18}
                      />
                    </div>

                    <ul className="flex flex-col p-2 bg-white">
                      {[
                        { label: "Price: Low to High", slug: "lowToHigh" },
                        { label: "Price: High to Low", slug: "highToLow" },
                        { label: "Bestsellers", slug: "bestsellers" },
                        { label: "Flagships", slug: "flagships" },
                        { label: "Budgets", slug: "budgets" },
                        { label: "Reset Filter", slug: "reset", color: "text-red-500 hover:text-red-600 hover:bg-red-50" },
                      ].map((opt) => (
                        <li
                          key={opt.slug}
                          className={`px-4 py-3 text-sm font-bold rounded-xl cursor-pointer hover:bg-zinc-100 transition-colors ${
                            opt.color || "text-zinc-600 hover:text-zinc-900"
                          }`}
                          onClick={() => handleFilter(opt.slug)}
                        >
                          {opt.label}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* 🌟 PRODUCTS GRID */}
        {filter.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
            className="h-[40vh] flex items-center justify-center border border-dashed border-zinc-300 rounded-[3rem] bg-white shadow-sm"
          >
            <p className="text-zinc-400 tracking-widest uppercase text-xs font-black">
              No matching audio gear found
            </p>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10"
          >
            {filter.map((product) => (
              <div key={product.id}>
                <Card
                  id={product.id}
                  productName={product.productName}
                  type={product.type}
                  price={product.price}
                  img={product.image}
                  stockCount={product.stockCount}
                />
              </div>
            ))}
          </motion.div>
        )}

        {/* 🌟 FOOTER */}
        <div className="mt-32 pt-16">
          <Footer />
        </div>

      </div>
    </div>
  );
};

export default Products;