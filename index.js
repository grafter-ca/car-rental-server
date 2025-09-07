if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({quiet: true});
}
require("dotenv").config(); 
const express = require("express");
const Stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const  cors = require("cors");
const checkoutRouter = require("./routes/checkout");
const connectDB = require("./config/db");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.get('/',(req,res)=>{
  res.send({message:"Welcome To My car Lental APIs."})
})
app.use("/api/checkout", checkoutRouter);
app.use("/api/users", require("./routes/user"));
app.use("/api/products", require("./routes/product"));
app.use("/api/projects", require("./routes/project"));
app.use("/api/contacts", require("./routes/contact"));
app.use("/api/orders", require("./routes/order"));
app.use("/api/booking", require("./routes/booking.route"));
// app.use("/api/stripe", require("./routes/webhook"));

console.log('-----------------------------------------------------------')
console.log(`Server ENV: ${process.env.NODE_ENV}`);
console.log('-----------------------------------------------------------')
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
