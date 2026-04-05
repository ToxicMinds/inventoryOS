"use client";

import { motion, AnimatePresence } from "framer-motion";
import { PlusCircle, Search, ClipboardList, X } from "lucide-react";
import { useState } from "react";

const mockCounts = [
  { id: "cnt-2025-10-01", date: "Oct 1, 2024", location: "Downtown", status: "submitted", variances: 3, owner: "manager1" },
  { id: "cnt-2025-10-08", date: "Oct 8, 2024", location: "Westside", status: "draft", variances: 0, owner: "manager2" },
  { id: "cnt-2025-10-15", date: "Oct 15, 2024", location: "Midtown", status: "approved", variances: 1, owner: "owner1" },
];

export default function PhysicalCountsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [countForm, setCountForm] = useState([
    { id: "ing:chicken-breast", name: "Chicken Breast", actual: 0, exp: 42.5 },
    { id: "ing:pizza-dough", name: "Pizza Dough Ball", actual: 0, exp: 15 },
    { id: "ing:keg-ipa", name: "Local IPA Keg", actual: 0, exp: 2.1 }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Formatting the payload to match DynamoDB expectation
    const payload = {
      eventType: "InventoryCountSubmitted",
      payload: { items: countForm.map(c => ({ id: c.id, quantity: c.actual })) }
    };
    
    try {
      const res = await fetch('http://localhost:8080/api/locations/downtown/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Idempotency-Key': 'cnt-' + Date.now(),
          'X-Actor-Id': 'frontend-user'
        },
        body: JSON.stringify(payload)
      });
      // Accept response without blocking UX
    } catch(e) { console.error("Event failed to reach store", e); }
    
    setTimeout(() => {
      setIsSubmitting(false);
      setIsModalOpen(false);
    }, 1000);
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Physical Counts</h1>
          <p className="text-muted-foreground mt-1">Record and manage end-of-day/week inventory counts.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors shadow-[0_0_15px_rgba(245,158,11,0.3)]">
            <PlusCircle className="w-4 h-4" /> New Count
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card flex items-center gap-4">
          <div className="bg-primary/10 p-3 rounded-full text-primary"><ClipboardList className="w-6 h-6" /></div>
          <div>
            <h3 className="text-2xl font-bold">12</h3>
            <p className="text-sm text-muted-foreground">Counts This Month</p>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card flex items-center gap-4">
          <div className="bg-amber-500/10 p-3 rounded-full text-amber-500"><ClipboardList className="w-6 h-6" /></div>
          <div>
            <h3 className="text-2xl font-bold">2</h3>
            <p className="text-sm text-muted-foreground">Drafts Pending</p>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card flex items-center gap-4">
          <div className="bg-destructive/10 p-3 rounded-full text-destructive"><ClipboardList className="w-6 h-6" /></div>
          <div>
            <h3 className="text-2xl font-bold">5</h3>
            <p className="text-sm text-muted-foreground">High Variances</p>
          </div>
        </motion.div>
      </div>

      <div className="glass-card overflow-hidden !p-0">
        <div className="p-4 border-b border-white/5 bg-white/[0.02]">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search counts by ID or location..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#09090b] border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-foreground focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-muted-foreground"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-white/[0.02] border-b border-white/5">
              <tr>
                <th className="px-6 py-4 font-medium">Count ID</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Location</th>
                <th className="px-6 py-4 font-medium">Owner</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Variances</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {mockCounts.map((count, idx) => (
                <motion.tr 
                  key={count.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className="hover:bg-white/[0.02] transition-colors cursor-pointer group"
                >
                  <td className="px-6 py-4 font-medium text-foreground">{count.id}</td>
                  <td className="px-6 py-4 text-muted-foreground">{count.date}</td>
                  <td className="px-6 py-4 text-foreground">{count.location}</td>
                  <td className="px-6 py-4 text-muted-foreground">{count.owner}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-medium border ${
                      count.status === 'approved' ? 'bg-green-400/10 text-green-400 border-green-400/20' :
                      count.status === 'submitted' ? 'bg-primary/10 text-primary border-primary/20' :
                      'bg-white/5 text-muted-foreground border-white/10'
                    }`}>
                      {count.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-mono">
                    <span className={count.variances > 0 ? 'text-amber-500' : 'text-green-400'}>
                      {count.variances}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#09090b] border border-white/10 rounded-2xl p-6 w-full max-w-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-foreground">Record Physical Count</h2>
                  <p className="text-sm text-muted-foreground font-mono mt-1">Loc: Bella Cucina Downtown</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              <div className="overflow-y-auto py-4 flex-1 space-y-4">
                 <div className="glass-card bg-amber-500/5 border-amber-500/20 p-4 mb-4">
                   <p className="text-xs text-amber-500/80 leading-relaxed font-medium">Record exactly what you see on the shelves. This will be submitted as an <code className="bg-black/50 px-1 rounded text-primary">InventoryCountSubmitted</code> event to the NoSQL engine, triggering a zero-variance assertion or drift penalty.</p>
                 </div>

                 {countForm.map((item, idx) => (
                    <div key={item.id} className="flex justify-between items-center p-4 border border-white/5 bg-white/[0.02] rounded-xl hover:border-white/10 transition-colors">
                       <div>
                          <p className="font-bold text-foreground">{item.name}</p>
                          <p className="text-xs font-mono text-muted-foreground">{item.id} • Expected: {item.exp}</p>
                       </div>
                       <div className="flex items-center gap-3">
                          <label className="text-xs text-muted-foreground font-mono">ACTUAL</label>
                          <input 
                            type="number"
                            value={item.actual}
                            onChange={(e) => {
                               const arr = [...countForm];
                               arr[idx].actual = parseFloat(e.target.value) || 0;
                               setCountForm(arr);
                            }}
                            className="bg-black border border-white/10 rounded-lg w-24 px-3 py-2 text-right focus:ring-1 focus:ring-primary outline-none text-foreground font-bold"
                          />
                       </div>
                    </div>
                 ))}
              </div>

              <div className="pt-4 border-t border-white/5 mt-auto flex justify-end">
                 <button 
                  disabled={isSubmitting}
                  onClick={handleSubmit} 
                  className="bg-primary text-primary-foreground px-8 py-2.5 rounded-xl font-bold shadow-[0_0_15px_rgba(245,158,11,0.3)] hover:scale-105 transition-transform disabled:opacity-50 disabled:scale-100 flex items-center justify-center min-w-[200px]"
                 >
                   {isSubmitting ? <div className="w-5 h-5 border-2 border-black border-t-transparent flex rounded-full animate-spin" /> : "Commit Physical Truth"}
                 </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
