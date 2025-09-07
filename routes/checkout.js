const express =require("express");
const Stripe =require("stripe");

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create checkout session dynamically
router.post("/create-session", async (req, res) => {
  try {
    const { products } = req.body;  
    // Example: [{ name: "Car Rental", price: 2000, quantity: 1 }]

    const line_items = products.map((product) => ({
      price_data: {
        currency: "usd",
        product_data: { name: product.name },
        unit_amount: product.price * 100, // cents
      },
      quantity: product.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("Stripe error:", err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/", (req, res) => {
  res.send("Checkout route is working");
});

router.get("/sessions", async (req, res) => {
  try {
    const sessions = await stripe.checkout.sessions.list({
      limit: 10, // you can adjust this or paginate
    });

    res.json(sessions);
  } catch (err) {
    console.error("Error fetching sessions:", err);
    res.status(500).json({ error: err.message });
  }
});

// Retrieve session details


router.get("/session/:id", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(req.params.id);
    res.json(session);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// routes/checkout.js
router.get("/all-sold-products", async (req, res) => {
  try {
    const sessions = await stripe.checkout.sessions.list({ limit: 20 });

    let soldProducts = [];

    for (const session of sessions.data) {
      if (session.payment_status === "paid") {
        const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
        soldProducts.push(...lineItems.data);
      }
    }

    res.json(soldProducts);
  } catch (err) {
    console.error("Error fetching sold products:", err);
    res.status(500).json({ error: err.message });
  }
});


router.get("/sales", async (req, res) => {
  try {
    const sessions = await stripe.checkout.sessions.list({
      limit: 20, // paginate if needed
    });

    // Only keep successful sessions
    const successfulSales = sessions.data.filter(
      (s) => s.payment_status === "paid"
    );

    res.json(successfulSales);
  } catch (err) {
    console.error("Error fetching sales:", err);
    res.status(500).json({ error: err.message });
  }
});


router.post("/webhook", express.raw({ type: "application/json" }), (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    console.log("✅ Payment was successful!", session);
    // Save order to DB, send email, etc.

  }

  res.json({ received: true });
});


module.exports = router;