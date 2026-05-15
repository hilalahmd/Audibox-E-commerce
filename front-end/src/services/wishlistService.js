import api from "./api";  

export const getWishlist = async (userId) => {  
  try {  
    const { data: wishlistItems } = await api.get(`/wishlist`);  
    return wishlistItems || [];  
  }  
  catch (error) { 
    console.error("Error while fetching wishlist", error); 
    return []; 
  }
};  

export const addToWishlist = async (userId, product) => {  
  try {
    await api.post(`/wishlist`, { product }); 
  } catch (error) {
    console.error("Error while adding to wishlist", error);
  }
}; 

export const removeFromWishlist = async (userId, productId) => { 
  try {
    await api.delete(`/wishlist/${productId}`); 
  } catch (error) {
    console.error("Error while removing from wishlist", error);
  }
};  
