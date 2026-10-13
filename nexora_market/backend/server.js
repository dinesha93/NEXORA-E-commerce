import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

const AMAZON_TAG = (process.env.AMAZON_AFFILIATE_TAG || "").trim();
const FLIPKART_AFFID = (process.env.FLIPKART_AFFILIATE_ID || "").trim();
const AMAZON_STORE = process.env.AMAZON_STOREFRONT || "www.amazon.in";
const FLIPKART_STORE = process.env.FLIPKART_STOREFRONT || "www.flipkart.com";

const isPlaceholder = (v) => !v || /^(yourtag|your_flipkart_id|change_this)/i.test(v);

function amazonLink(product) {
  if (product.amazonUrl) return product.amazonUrl;
  const query = encodeURIComponent(product.title);
  if (product.asin) {
    const tag = isPlaceholder(AMAZON_TAG) ? "" : `?tag=${encodeURIComponent(AMAZON_TAG)}`;
    return `https://${AMAZON_STORE}/dp/${encodeURIComponent(product.asin)}${tag}`;
  }
  const tag = isPlaceholder(AMAZON_TAG) ? "" : `&tag=${encodeURIComponent(AMAZON_TAG)}`;
  return `https://${AMAZON_STORE}/s?k=${query}${tag}`;
}

function flipkartLink(product) {
  if (product.flipkartUrl) return product.flipkartUrl;
  const query = encodeURIComponent(product.title);
  if (product.flipkartPid) {
    return `https://${FLIPKART_STORE}/${encodeURIComponent(product.flipkartPid)}`;
  }
  const aff = isPlaceholder(FLIPKART_AFFID) ? "" : `&affid=${encodeURIComponent(FLIPKART_AFFID)}`;
  return `https://${FLIPKART_STORE}/search?q=${query}${aff}`;
}

const withMarketLinks = (product) => ({
  ...product,
  id: String(product.id || product._id),
  amazonUrl: amazonLink(product),
  flipkartUrl: flipkartLink(product)
});

const productSchema = new mongoose.Schema({
  title: String, category: String, price: Number, oldPrice: Number,
  rating: Number, reviews: Number, image: String, badge: String,
  description: String, amazonUrl: String, flipkartUrl: String,
  asin: String, flipkartPid: String
}, { timestamps: true });

const userSchema = new mongoose.Schema({
  name: String, email: { type: String, unique: true }, password: String
}, { timestamps: true });

const orderSchema = new mongoose.Schema({
  userEmail: String, items: Array, total: Number, status: { type: String, default: "Placed" }
}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);
const User = mongoose.model("User", userSchema);
const Order = mongoose.model("Order", orderSchema);

const img = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=900&q=80`;

const demoProducts = [
  { id:"1", title:"AeroBeat Pro Wireless Headphones", category:"Electronics", price:2499, oldPrice:3999, rating:4.7, reviews:1842, badge:"BESTSELLER", image:img("1505740420928-5e560c06d30e"), description:"Immersive sound, adaptive comfort and all-day battery.", amazonUrl:"", flipkartUrl:"" },
  { id:"2", title:"Pulse X Smartwatch", category:"Wearables", price:3299, oldPrice:5999, rating:4.5, reviews:928, badge:"TRENDING", image:img("1523275335684-37898b6baf30"), description:"Fitness tracking, notifications and a bright AMOLED display.", amazonUrl:"", flipkartUrl:"" },
  { id:"3", title:"Orbit Mechanical Keyboard", category:"Computing", price:1899, oldPrice:2999, rating:4.6, reviews:612, badge:"HOT", image:img("1587829741301-dc798b83add3"), description:"Compact mechanical keyboard for work, study and gaming.", amazonUrl:"", flipkartUrl:"" },
  { id:"4", title:"Nova Urban Backpack", category:"Lifestyle", price:1299, oldPrice:1999, rating:4.4, reviews:741, badge:"NEW", image:img("1553062407-98eeb64c6a62"), description:"Water-resistant everyday backpack with smart compartments.", amazonUrl:"", flipkartUrl:"" },
  { id:"5", title:"PixelView 27-inch Monitor", category:"Computing", price:12999, oldPrice:16999, rating:4.8, reviews:305, badge:"PRO PICK", image:img("1527443224154-c4a3942d3acf"), description:"Crisp 2K workspace display with smooth refresh.", amazonUrl:"", flipkartUrl:"" },
  { id:"6", title:"CloudStep Running Shoes", category:"Fashion", price:2199, oldPrice:3499, rating:4.6, reviews:1204, badge:"POPULAR", image:img("1542291026-7eec264c27ff"), description:"Lightweight daily trainers with responsive cushioning.", amazonUrl:"", flipkartUrl:"" },
  { id:"7", title:"Lumen 14 Ultrabook", category:"Computing", price:64990, oldPrice:84990, rating:4.7, reviews:486, badge:"PREMIUM", image:img("1517336714731-489689fd1ca8"), description:"Thin 1.1kg aluminium chassis with an 18-hour battery.", amazonUrl:"", flipkartUrl:"" },
  { id:"8", title:"Vertex Studio Notebook", category:"Computing", price:56900, oldPrice:72900, rating:4.6, reviews:352, badge:"PRO PICK", image:img("1496181133206-80ce9b88a853"), description:"Powerful laptop for editing, builds and heavy multitasking.", amazonUrl:"", flipkartUrl:"" },
  { id:"9", title:"Echo Air Earbuds", category:"Electronics", price:1299, oldPrice:2499, rating:4.3, reviews:2610, badge:"BESTSELLER", image:img("1546868871-7041f2a55e12"), description:"Pocket-sized buds with clear calls and 24-hour case battery.", amazonUrl:"", flipkartUrl:"" },
  { id:"10", title:"Vantage Mirrorless Camera", category:"Electronics", price:54900, oldPrice:67900, rating:4.8, reviews:218, badge:"PRO", image:img("1526170375885-4d8ecf77b99f"), description:"24MP sensor, 4K video and fast autofocus for creators.", amazonUrl:"", flipkartUrl:"" },
  { id:"11", title:"Drift Wireless Earbuds", category:"Electronics", price:1799, oldPrice:3299, rating:4.2, reviews:987, badge:"HOT", image:img("1503602642458-232111445657"), description:"Warm signature sound with a low-latency gaming mode.", amazonUrl:"", flipkartUrl:"" },
  { id:"12", title:"Glide Wireless Mouse", category:"Computing", price:899, oldPrice:1599, rating:4.4, reviews:1533, badge:"POPULAR", image:img("1523206489230-c012c64b2b48"), description:"Silent clicks, multi-device pairing and USB-C charging.", amazonUrl:"", flipkartUrl:"" },
  { id:"13", title:"Halo Polarized Sunglasses", category:"Lifestyle", price:1099, oldPrice:2299, rating:4.3, reviews:428, badge:"NEW", image:img("1572635196237-14b3f281503f"), description:"UV400 protection with a lightweight acetate frame.", amazonUrl:"", flipkartUrl:"" },
  { id:"14", title:"Slate TWS Earbuds Pro", category:"Electronics", price:1499, oldPrice:2799, rating:4.1, reviews:1344, badge:"HOT", image:img("1541643600914-78b084683601"), description:"Active noise cancelling and a compact matte case.", amazonUrl:"", flipkartUrl:"" },
  { id:"15", title:"Boom Mini Bluetooth Speaker", category:"Electronics", price:1399, oldPrice:2599, rating:4.5, reviews:876, badge:"TRENDING", image:img("1592750475338-74b7b21085ab"), description:"Pocket speaker with punchy bass and 12-hour playtime.", amazonUrl:"", flipkartUrl:"" },
  { id:"16", title:"Pulse Fitness Band", category:"Wearables", price:999, oldPrice:2499, rating:4.2, reviews:2110, badge:"BESTSELLER", image:img("1524805444758-089113d48a6d"), description:"Steps, sleep and heart rate tracking on a week-long charge.", amazonUrl:"", flipkartUrl:"" },
  { id:"17", title:"Nordic Smart Watch Lite", category:"Wearables", price:1799, oldPrice:3499, rating:4.0, reviews:642, badge:"NEW", image:img("1590658268037-6bf12165a8df"), description:"Slim always-on display with 10 days of battery.", amazonUrl:"", flipkartUrl:"" },
  { id:"18", title:"Strap Smartwatch Sport", category:"Wearables", price:4299, oldPrice:7499, rating:4.4, reviews:517, badge:"PRO PICK", image:img("1611930022073-b7a4ba5fcccd"), description:"Dual-band GPS, SpO2 and a tough silicone sport band.", amazonUrl:"", flipkartUrl:"" },
  { id:"19", title:"Zip Everyday Sneakers", category:"Fashion", price:1599, oldPrice:2999, rating:4.3, reviews:903, badge:"POPULAR", image:img("1600185365483-26d7a4cc7519"), description:"Breathable knit uppers with a cushioned everyday sole.", amazonUrl:"", flipkartUrl:"" },
  { id:"20", title:"Retro Canvas Low Tops", category:"Fashion", price:1199, oldPrice:1999, rating:4.4, reviews:1520, badge:"BESTSELLER", image:img("1560769629-975ec94e6a86"), description:"Classic canvas style with a cushioned insole and grip sole.", amazonUrl:"", flipkartUrl:"" },
  { id:"21", title:"Aero Court Sneakers", category:"Fashion", price:2799, oldPrice:4499, rating:4.5, reviews:688, badge:"TRENDING", image:img("1622434641406-a158123450f9"), description:"Supportive court silhouette built for daily miles.", amazonUrl:"", flipkartUrl:"" },
  { id:"22", title:"Trail Runner Waterproof", category:"Fashion", price:3499, oldPrice:5299, rating:4.6, reviews:394, badge:"NEW", image:img("1606107557195-0e29a4b5b4aa"), description:"Waterproof membrane and aggressive grip for rough trails.", amazonUrl:"", flipkartUrl:"" },
  { id:"23", title:"Terra Insulated Bottle", category:"Lifestyle", price:649, oldPrice:1199, rating:4.4, reviews:1129, badge:"POPULAR", image:img("1583394838336-acd977736f90"), description:"Keeps drinks cold 24 hours, hot 12. BPA-free steel.", amazonUrl:"", flipkartUrl:"" },
  { id:"24", title:"Mesh Panel Daypack", category:"Lifestyle", price:1499, oldPrice:2299, rating:4.2, reviews:512, badge:"NEW", image:img("1553062407-98eeb64c6a62"), description:"Breathable mesh panels with a padded 16-inch laptop sleeve.", amazonUrl:"", flipkartUrl:"" }
];

app.get("/api/health", (_, res) => res.json({
  ok: true,
  service: "Nexora Market API",
  database: mongoose.connection.readyState === 1 ? "connected" : "demo",
  marketplaces: {
    amazon: { configured: !isPlaceholder(AMAZON_TAG), storefront: AMAZON_STORE },
    flipkart: { configured: !isPlaceholder(FLIPKART_AFFID), storefront: FLIPKART_STORE }
  }
}));

app.get("/api/marketplaces", (_, res) => res.json({
  amazon: { name: "Amazon", url: `https://${AMAZON_STORE}`, affiliate: !isPlaceholder(AMAZON_TAG) },
  flipkart: { name: "Flipkart", url: `https://${FLIPKART_STORE}`, affiliate: !isPlaceholder(FLIPKART_AFFID) }
}));

app.get("/api/products", async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const products = await Product.find().lean();
      if (products.length) return res.json(products.map(withMarketLinks));
    }
  } catch {}
  res.json(demoProducts.map(withMarketLinks));
});

app.post("/api/auth/register", async (req,res) => {
  try {
    const {name,email,password} = req.body;
    if (!name || !email || !password) return res.status(400).json({message:"All fields are required"});
    if (mongoose.connection.readyState !== 1) return res.status(503).json({message:"Connect MongoDB before registering"});
    const exists = await User.findOne({email});
    if (exists) return res.status(409).json({message:"Email already registered"});
    const hash = await bcrypt.hash(password, 10);
    await User.create({name,email,password:hash});
    res.status(201).json({message:"Account created"});
  } catch(e) { res.status(500).json({message:"Registration failed"}); }
});

app.post("/api/auth/login", async (req,res) => {
  try {
    const {email,password} = req.body;
    if (mongoose.connection.readyState !== 1) return res.status(503).json({message:"Connect MongoDB before login"});
    const user = await User.findOne({email});
    if (!user || !(await bcrypt.compare(password,user.password))) return res.status(401).json({message:"Invalid email or password"});
    const token = jwt.sign({id:user._id,email:user.email}, process.env.JWT_SECRET || "dev-secret", {expiresIn:"7d"});
    res.json({token,user:{name:user.name,email:user.email}});
  } catch { res.status(500).json({message:"Login failed"}); }
});

app.post("/api/orders", async (req,res) => {
  try {
    const {userEmail,items,total} = req.body;
    if (!items?.length) return res.status(400).json({message:"Cart is empty"});
    if (mongoose.connection.readyState === 1) {
      const order = await Order.create({userEmail,items,total});
      return res.status(201).json({message:"Order placed",orderId:order._id});
    }
    res.status(201).json({message:"Demo order placed",orderId:"DEMO-"+Date.now()});
  } catch { res.status(500).json({message:"Order failed"}); }
});

async function seed() {
  if (mongoose.connection.readyState !== 1) return;
  const existing = new Set((await Product.find({}, { title: 1 }).lean()).map((p) => p.title));
  const missing = demoProducts
    .filter((p) => !existing.has(p.title))
    .map(({ id, ...fields }) => fields);
  if (missing.length) {
    await Product.insertMany(missing);
    console.log(`Seeded ${missing.length} new product(s)`);
  }
}

mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/nexora_market")
  .then(async()=>{ console.log("MongoDB connected"); await seed(); })
  .catch(()=>console.log("MongoDB unavailable — running in demo mode"));

app.listen(PORT,()=>console.log(`Nexora API running on http://localhost:${PORT}`));
