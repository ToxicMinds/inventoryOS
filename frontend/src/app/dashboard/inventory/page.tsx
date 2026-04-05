"use client";

import { motion } from "framer-motion";
import { Search, Filter, AlertCircle, ArrowDown, ArrowUp } from "lucide-react";
import { useState } from "react";

const mockInventory = [
  { id: "ing:chicken-breast", name: "Chicken Breast", category: "Protein", qty: 42.5, unit: "lb", value: 146.62, status: "ok" },
  { id: "ing:keg-ipa", name: "Local IPA Keg", category: "Alcohol", qty: 2.1, unit: "keg", value: 304.50, status: "low" },
  { id: "ing:pizza-dough", name: "Pizza Dough Ball", category: "Dry Goods", qty: 15, unit: "each", value: 7.50, status: "critical" },
  { id: "ing:mozzarella", name: "Mozzarella Cheese", category: "Dairy", qty: 31.5, unit: "lb", value: 129.15, status: "ok" },
  { id: "ing:tomato-sauce", name: "Tomato Sauce", category: "Dry Goods", qty: 18.0, unit: "gal", value: 95.00, status: "ok" },
];

export default function InventoryPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = mockInventory.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Live Inventory</h1>
          <p className="text-muted-foreground mt-1">Real-time theoretical balances derived from the ledger.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <select className="bg-[#181920] border border-white/10 rounded-lg px-4 py-2 text-sm text-foreground focus:ring-1 focus:ring-primary outline-none">
            <option>All Locations</option>
            <option>Bella Cucina Downtown</option>
            <option>Bella Cucina Westside</option>
            <option>The Brass Tap Midtown</option>
          </select>
          <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors shadow-[0_0_15px_rgba(245,158,11,0.3)]">
            Export CSV
          </button>
        </div>
      </div>

      <div className="glass-card overflow-hidden !p-0">
        <div className="p-4 border-b border-white/5 flex gap-4 bg-white/[0.02]">
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
          <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-foreground transition-colors">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-white/[0.02] border-b border-white/5">
              <tr>
                <th className="px-6 py-4 font-medium">Item Name</th>
                <th className="px-6 py-4 font-medium">Category</th>
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
                  <td className="px-6 py-4 font-medium text-foreground">{item.name}</td>
                  <td className="px-6 py-4 text-muted-foreground">
                    <span className="px-2.5 py-1 bg-white/5 rounded-md text-xs">{item.category}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="font-mono">{item.qty.toFixed(2)}</span>
                    <span className="text-muted-foreground ml-1">{item.unit}</span>
                  </td>
                  <td className="px-6 py-4 text-right font-mono text-muted-foreground">
                    ${item.value.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    {item.status === 'ok' && <span className="flex items-center gap-1.5 text-xs text-green-400"><div className="w-1.5 h-1.5 rounded-full bg-green-400" /> Optimal</span>}
                    {item.status === 'low' && <span className="flex items-center gap-1.5 text-xs text-amber-500"><div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" /> Reorder Soon</span>}
                    {item.status === 'critical' && <span className="flex items-center gap-1.5 text-xs text-destructive"><AlertCircle className="w-3.5 h-3.5" /> Critical Level</span>}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-primary hover:text-primary-foreground text-xs font-medium transition-colors opacity-0 group-hover:opacity-100">
                      View Ledger
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
