import api from "./api"



export const getCartItems =
  async () => {

    try {

      const { data }
        = await api.get("/cart")

      return data

    }

    catch (error) {

      console.error(error)

      return []

    }

  }



export const addToCart =
  async (productId) => {

    try {

      await api.post("/cart", {

        productId

      })

    }

    catch (error) {

      console.error(error)

    }

  }



export const updateCartQuantity =
  async (productId, quantity) => {

    try {

      await api.put(

        `/cart/${productId}`,

        { quantity }

      )

    }

    catch (error) {

      console.error(error)

    }

  }



export const removeFromCart =
  async (productId) => {

    try {

      await api.delete(

        `/cart/${productId}`

      )

    }

    catch (error) {

      console.error(error)

    }

  }



export const clearCart =
  async () => {

    try {

      await api.delete("/cart")

    }

    catch (error) {

      console.error(error)

    }

  }