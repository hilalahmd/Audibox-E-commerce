const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const createCheckoutSession = async (req, res) => {
  try {
    const { items, orderId } = req.body;

    const lineItems = items.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: item.productName || "Product",

          images: item.image ? [item.image] : [],
        },

        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity || 1,
    }));

    const subTotal = items.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
    const gst = subTotal * 0.18;

    lineItems.push({
      price_data: {
        currency: "inr",
        product_data: {
          name: "GST (18%)",
        },
        unit_amount: Math.round(gst * 100),
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",

      success_url: `http://localhost:5173/checkout-success`,
      cancel_url: `http://localhost:5173/checkout`,
    });

    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createCheckoutSession };
