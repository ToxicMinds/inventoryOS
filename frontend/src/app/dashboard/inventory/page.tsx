"use client";

import { motion } from "framer-motion";
import { Search, Filter, AlertCircle, ArrowDown, ArrowUp } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { formatCurrency } from "@/lib/currency";

const mockInventory = [
  { id: "ing:chicken-breast", name: "Chicken Breast", category: "Protein", qty: 42.5, unit: "lb", value: 146.62, status: "ok", loc: "Bella Cucina Downtown" },
  { id: "ing:keg-ipa", name: "Local IPA Keg", category: "Alcohol", qty: 2.1, unit: "keg", value: 304.50, status: "low", loc: "The Brass Tap Midtown" },
  { id: "ing:pizza-dough", name: "Pizza Dough Ball", category: "Dry Goods", qty: 15, unit: "each", value: 7.50, status: "critical", loc: "Bella Cucina Westside" },
  { id: "ing:mozzarella", name: "Mozzarella Cheese", category: "Dairy", qty: 31.5, unit: "lb", value: 129.15, status: "ok", loc: "Bella Cucina Downtown" },
  { id: "ing:tomato-sauce", name: "Tomato Sauce", category: "Dry Goods", qty: 18.0, unit: "gal", value: 95.00, status: "ok", loc: "Bella Cucina Downtown" },
  { id: "ing:truffle-oil", name: "Truffle Oil", category: "Dry Goods", qty: 4.5, unit: "l", value: 240.00, status: "ok", loc: "Bella Cucina Westside" },
  { id: "ing:stout-keg", name: "Stout Keg", category: "Alcohol", qty: 0.5, unit: "keg", value: 120.00, status: "critical", loc: "The Brass Tap Riverside" },
];

export default function InventoryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("All Locations");
  const [category, setCategory] = useState("All");

  const filtered = mockInventory.filter(item => {
    const matchSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchLoc = location === "All Locations" || item.loc === location;
    const matchCat = category === "All" || item.category === category;
    return matchSearch && matchLoc && matchCat;
  });

  const uniqueCategories = ["All", ...Array.from(new Set(mockInventory.map(i => i.category)))];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Live Inventory</h1>
          <p className="text-muted-foreground mt-1">Real-time theoretical balances derived from the ledger.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <select 
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="bg-[#181920] border border-white/10 rounded-lg px-4 py-2 text-sm text-foreground focus:ring-1 focus:ring-primary outline-none cursor-pointer"
          >
            <option>All Locations</option>
            <option>Bella Cucina Downtown</option>
            <option>Bella Cucina Westside</option>
            <option>The Brass Tap Midtown</option>
            <option>The Brass Tap Riverside</option>
          </select>
          <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors shadow-[0_0_15px_rgba(245,158,11,0.3)]">
            Export CSV
          </button>
        </div>
      </div>

      <div className="glass-card overflow-hidden !p-0">
        <div className="p-4 border-b border-white/5 flex flex-col md:flex-row gap-4 bg-white/[0.02]">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search ingredients..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#09090b] border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-foreground focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-muted-foreground"
            />
          </div>
          
          <div className="flex gap-2 border-l border-white/10 pl-4 items-center overflow-x-auto pb-2 md:pb-0">
             <span className="text-xs text-muted-foreground uppercase font-bold mr-2">Category:</span>
             {uniqueCategories.map(cat => (
               <button 
                 key={cat}
                 onClick={() => setCategory(cat)}
                 className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${category === cat ? 'bg-primary text-primary-foreground shadow-[0_0_10px_rgba(245,158,11,0.3)]' : 'bg-white/5 text-muted-foreground hover:bg-white/10'}`}
               >
                 {cat}
               </button>
             ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-white/[0.02] border-b border-white/5">
              <tr>
                <th className="px-6 py-4 font-medium">Item Name</th>
                <th className="px-6 py-4 font-medium">Location</th>
                <th className="px-6 py-4 font-medium text-right">Quantity</th>
                <th className="px-6 py-4 font-medium text-right">Unit Value</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((item, idx) => (
                <motion.tr 
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className="hover:bg-white/[0.02] transition-colors group"
                >
                  <td className="px-6 py-4 font-medium text-foreground">
                    {item.name}
                    <div className="text-xs text-muted-foreground font-mono mt-0.5">{item.id}</div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground text-xs">
                     {item.loc}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="font-mono font-bold text-foreground">{item.qty.toFixed(2)}</span>
                    <span className="text-muted-foreground ml-1">{item.unit}</span>
                  </td>
                  <td className="px-6 py-4 text-right font-mono text-muted-foreground">
                    {formatCurrency(item.value)}
                  </td>
                  <td className="px-6 py-4">
                    {item.status === 'ok' && <span className="flex items-center gap-1.5 text-xs text-green-400"><div className="w-1.5 h-1.5 rounded-full bg-green-400" /> Optimal</span>}
                    {item.status === 'low' && <span className="flex items-center gap-1.5 text-xs text-amber-500"><div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" /> Reorder Soon</span>}
                    {item.status === 'critical' && <span className="flex items-center gap-1.5 text-xs text-destructive"><AlertCircle className="w-3.5 h-3.5" /> Critical Level</span>}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link href="/dashboard/inventory/ledger">
                      <button className="text-primary hover:text-primary-foreground text-xs font-bold uppercase transition-colors opacity-0 group-hover:opacity-100 border border-primary/20 px-3 py-1.5 rounded bg-primary/10">
                        View Trace
                      </button>
                    </Link>
                  </td>
                </motion.tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                   <td className="px-6 py-8 text-center text-muted-foreground" colSpan={6}>
                     No inventory matching current filters.
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
