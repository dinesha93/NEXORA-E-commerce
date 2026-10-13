import React, {useMemo, useState} from "react";
import {createRoot} from "react-dom/client";
import {Search, ShoppingBag, Heart, User, Star, ArrowRight, Zap, ShieldCheck, Truck, X} from "lucide-react";
import "./styles.css";

const API="http://localhost:5000/api";
const img=id=>`https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=900&q=80`;
const demo=[
{id:"1",title:"AeroBeat Pro Wireless Headphones",category:"Electronics",price:2499,oldPrice:3999,rating:4.7,reviews:1842,badge:"BESTSELLER",image:img("1505740420928-5e560c06d30e")},
{id:"2",title:"Pulse X Smartwatch",category:"Wearables",price:3299,oldPrice:5999,rating:4.5,reviews:928,badge:"TRENDING",image:img("1523275335684-37898b6baf30")},
{id:"3",title:"Orbit Mechanical Keyboard",category:"Computing",price:1899,oldPrice:2999,rating:4.6,reviews:612,badge:"HOT",image:img("1587829741301-dc798b83add3")},
{id:"4",title:"Nova Urban Backpack",category:"Lifestyle",price:1299,oldPrice:1999,rating:4.4,reviews:741,badge:"NEW",image:img("1553062407-98eeb64c6a62")},
{id:"5",title:"PixelView 27-inch Monitor",category:"Computing",price:12999,oldPrice:16999,rating:4.8,reviews:305,badge:"PRO PICK",image:img("1527443224154-c4a3942d3acf")},
{id:"6",title:"CloudStep Running Shoes",category:"Fashion",price:2199,oldPrice:3499,rating:4.6,reviews:1204,badge:"POPULAR",image:img("1542291026-7eec264c27ff")},
{id:"7",title:"Lumen 14 Ultrabook",category:"Computing",price:64990,oldPrice:84990,rating:4.7,reviews:486,badge:"PREMIUM",image:img("1517336714731-489689fd1ca8")},
{id:"8",title:"Vertex Studio Notebook",category:"Computing",price:56900,oldPrice:72900,rating:4.6,reviews:352,badge:"PRO PICK",image:img("1496181133206-80ce9b88a853")},
{id:"9",title:"Echo Air Earbuds",category:"Electronics",price:1299,oldPrice:2499,rating:4.3,reviews:2610,badge:"BESTSELLER",image:img("1546868871-7041f2a55e12")},
{id:"10",title:"Vantage Mirrorless Camera",category:"Electronics",price:54900,oldPrice:67900,rating:4.8,reviews:218,badge:"PRO",image:img("1526170375885-4d8ecf77b99f")},
{id:"11",title:"Drift Wireless Earbuds",category:"Electronics",price:1799,oldPrice:3299,rating:4.2,reviews:987,badge:"HOT",image:img("1503602642458-232111445657")},
{id:"12",title:"Glide Wireless Mouse",category:"Computing",price:899,oldPrice:1599,rating:4.4,reviews:1533,badge:"POPULAR",image:img("1523206489230-c012c64b2b48")},
{id:"13",title:"Halo Polarized Sunglasses",category:"Lifestyle",price:1099,oldPrice:2299,rating:4.3,reviews:428,badge:"NEW",image:img("1572635196237-14b3f281503f")},
{id:"14",title:"Slate TWS Earbuds Pro",category:"Electronics",price:1499,oldPrice:2799,rating:4.1,reviews:1344,badge:"HOT",image:img("1541643600914-78b084683601")},
{id:"15",title:"Boom Mini Bluetooth Speaker",category:"Electronics",price:1399,oldPrice:2599,rating:4.5,reviews:876,badge:"TRENDING",image:img("1592750475338-74b7b21085ab")},
{id:"16",title:"Pulse Fitness Band",category:"Wearables",price:999,oldPrice:2499,rating:4.2,reviews:2110,badge:"BESTSELLER",image:img("1524805444758-089113d48a6d")},
{id:"17",title:"Nordic Smart Watch Lite",category:"Wearables",price:1799,oldPrice:3499,rating:4.0,reviews:642,badge:"NEW",image:img("1590658268037-6bf12165a8df")},
{id:"18",title:"Strap Smartwatch Sport",category:"Wearables",price:4299,oldPrice:7499,rating:4.4,reviews:517,badge:"PRO PICK",image:img("1611930022073-b7a4ba5fcccd")},
{id:"19",title:"Zip Everyday Sneakers",category:"Fashion",price:1599,oldPrice:2999,rating:4.3,reviews:903,badge:"POPULAR",image:img("1600185365483-26d7a4cc7519")},
{id:"20",title:"Retro Canvas Low Tops",category:"Fashion",price:1199,oldPrice:1999,rating:4.4,reviews:1520,badge:"BESTSELLER",image:img("1560769629-975ec94e6a86")},
{id:"21",title:"Aero Court Sneakers",category:"Fashion",price:2799,oldPrice:4499,rating:4.5,reviews:688,badge:"TRENDING",image:img("1622434641406-a158123450f9")},
{id:"22",title:"Trail Runner Waterproof",category:"Fashion",price:3499,oldPrice:5299,rating:4.6,reviews:394,badge:"NEW",image:img("1606107557195-0e29a4b5b4aa")},
{id:"23",title:"Terra Insulated Bottle",category:"Lifestyle",price:649,oldPrice:1199,rating:4.4,reviews:1129,badge:"POPULAR",image:img("1583394838336-acd977736f90")},
{id:"24",title:"Mesh Panel Daypack",category:"Lifestyle",price:1499,oldPrice:2299,rating:4.2,reviews:512,badge:"NEW",image:img("1553062407-98eeb64c6a62")}];

function App(){
 const [products,setProducts]=useState(demo),[query,setQuery]=useState(""),[cat,setCat]=useState("All"),[cart,setCart]=useState([]),[liked,setLiked]=useState([]),[drawer,setDrawer]=useState(false),[toast,setToast]=useState("");
 React.useEffect(()=>{fetch(API+"/products").then(r=>r.json()).then(setProducts).catch(()=>{})},[]);
 const cats=["All",...new Set(products.map(p=>p.category))];
 const filtered=useMemo(()=>products.filter(p=>(cat==="All"||p.category===cat)&&p.title.toLowerCase().includes(query.toLowerCase())),[products,cat,query]);
 const total=cart.reduce((s,p)=>s+p.price,0);
 const add=p=>{setCart(c=>[...c,p]);setToast("Added to cart");setTimeout(()=>setToast(""),1600)};
 const buyLink=(p,market)=>{
  if(p[market+"Url"])return p[market+"Url"];
  const q=encodeURIComponent(p.title);
  return market==="amazonUrl"?`https://www.amazon.in/s?k=${q}`:`https://www.flipkart.com/search?q=${q}`;
 };
 return <div>
  <header><div className="nav">
   <div className="logo">NEXORA<span>.</span></div>
   <div className="search"><Search size={19}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search products, brands and categories..."/></div>
   <button className="iconbtn"><User size={20}/><small>Account</small></button>
   <button className="iconbtn" onClick={()=>setDrawer(true)}><ShoppingBag size={20}/><b className="count">{cart.length}</b><small>Bag</small></button>
  </div>
  <div className="categories">{cats.map(c=><button className={cat===c?"active":""} onClick={()=>setCat(c)} key={c}>{c}</button>)}</div></header>
  <main>
   <section className="hero"><div><p className="eyebrow">CURATED FOR THE CURIOUS</p><h1>Shop what<br/><em>moves you.</em></h1><p className="sub">Discover useful tech, everyday essentials and standout finds — all in one beautifully simple place.</p><button className="primary" onClick={()=>document.getElementById("products").scrollIntoView()}>Explore collection <ArrowRight size={18}/></button></div><div className="hero-card"><Zap/><strong>Flash Drop</strong><span>Fresh picks every week</span><b>UP TO 40% OFF</b></div></section>
   <section className="trust"><div><Truck/>Fast delivery</div><div><ShieldCheck/>Secure checkout</div><div><Star/>Verified ratings</div><div><Heart/>Easy returns</div></section>
   <section id="products"><div className="section-head"><div><p className="eyebrow">THE EDIT</p><h2>Made for your wishlist</h2></div><span>{filtered.length} products</span></div>
   <div className="grid">{filtered.map(p=><article className="product" key={p.id}>
    <div className="pic"><img src={p.image}/><label>{p.badge}</label><button className={liked.includes(p.id)?"liked":""} onClick={()=>setLiked(l=>l.includes(p.id)?l.filter(x=>x!==p.id):[...l,p.id])}><Heart size={18} fill={liked.includes(p.id)?"currentColor":"none"}/></button></div>
    <div className="pbody"><small>{p.category}</small><h3>{p.title}</h3><div className="rating"><Star size={14} fill="currentColor"/> {p.rating} <span>({p.reviews})</span></div><div className="price">₹{p.price.toLocaleString("en-IN")} <del>₹{p.oldPrice?.toLocaleString("en-IN")}</del></div><div className="actions"><button onClick={()=>add(p)}>Add to bag</button><a href={buyLink(p,"amazonUrl")} target="_blank" rel="noreferrer">Amazon</a><a href={buyLink(p,"flipkartUrl")} target="_blank" rel="noreferrer">Flipkart</a></div></div>
   </article>)}</div></section>
  </main>
  <footer><div className="logo">NEXORA<span>.</span></div><p>Independent storefront UI. Marketplace buttons are designed for approved affiliate/API links.</p><div>© 2026 Nexora Market</div></footer>
  {toast&&<div className="toast">{toast}</div>}
  {drawer&&<div className="overlay" onClick={()=>setDrawer(false)}><aside onClick={e=>e.stopPropagation()}><button className="close" onClick={()=>setDrawer(false)}><X/></button><h2>Your Bag</h2>{cart.length?<>{cart.map((p,i)=><div className="bagitem" key={i}><img src={p.image}/><div><b>{p.title}</b><p>₹{p.price.toLocaleString("en-IN")}</p></div></div>)}<div className="total"><span>Total</span><b>₹{total.toLocaleString("en-IN")}</b></div><button className="checkout" onClick={async()=>{try{await fetch(API+"/orders",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({items:cart,total})});}catch{}setToast("Order request submitted");setCart([]);setDrawer(false);setTimeout(()=>setToast(""),1800)}}>Place order</button></>:<p className="empty">Your bag is waiting for something great.</p>}</aside></div>}
 </div>
}
createRoot(document.getElementById("root")).render(<App/>);
