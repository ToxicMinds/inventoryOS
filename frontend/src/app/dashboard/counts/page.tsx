"use client";

import { motion } from "framer-motion";
import { PlusCircle, Search, ClipboardList } from "lucide-react";
import { useState } from "react";

const mockCounts = [
  { id: "cnt-2025-10-01", date: "Oct 1, 2024", location: "Midtown", status: "submitted", variances: 3, owner: "manager1" },
  { id: "cnt-2025-10-08", date: "Oct 8, 2024", location: "Riverside", status: "draft", variances: 0, owner: "manager2" },
  { id: "cnt-2025-10-15", date: "Oct 15, 2024", location: "Downtown", status: "approved", variances: 1, owner: "owner1" },
];

export default function PhysicalCountsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Physical Counts</h1>
          <p className="text-muted-foreground mt-1">Record and manage end-of-day/week inventory counts.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors shadow-[0_0_15px_rgba(245,158,11,0.3)]">
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
                  <td className="px-6 py-4 text-right">
                    <span className={`font-mono ${count.variances > 0 ? 'text-amber-500' : 'text-green-400'}`}>
                      {count.variances}
                    </span>
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
