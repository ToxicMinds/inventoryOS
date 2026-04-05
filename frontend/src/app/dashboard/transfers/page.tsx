"use client";

import { motion } from "framer-motion";
import { ArrowRightLeft, Send, Download } from "lucide-react";
import { useState } from "react";

const mockTransfers = [
  { id: "trf-101", from: "Downtown", to: "Westside", items: 3, date: "Today, 10:30 AM", status: "In Transit" },
  { id: "trf-102", from: "Midtown", to: "Riverside", items: 12, date: "Yesterday", status: "Completed" },
  { id: "trf-103", from: "Riverside", to: "Midtown", items: 1, date: "Oct 12, 2024", status: "Completed" },
];

export default function TransfersPage() {
  const [activeTab, setActiveTab] = useState('history');

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Location Transfers</h1>
          <p className="text-muted-foreground mt-1">Move inventory across the corporate network.</p>
        </div>
        
        <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
          <button 
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'history' ? 'bg-[#181920] text-primary shadow-sm border border-white/5' : 'text-muted-foreground hover:text-foreground'}`}
          >
            Transfer History
          </button>
          <button 
            onClick={() => setActiveTab('new')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'new' ? 'bg-[#181920] text-primary shadow-sm border border-white/5' : 'text-muted-foreground hover:text-foreground'}`}
          >
            Initiate Transfer
          </button>
        </div>
      </div>

      {activeTab === 'history' ? (
        <motion.div 
          key="history"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card overflow-hidden !p-0"
        >
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-white/[0.02] border-b border-white/5">
              <tr>
                <th className="px-6 py-4 font-medium">Transfer ID</th>
                <th className="px-6 py-4 font-medium">Date/Time</th>
                <th className="px-6 py-4 font-medium">Origin</th>
                <th className="px-6 py-4 font-medium">Destination</th>
                <th className="px-6 py-4 font-medium text-right">Items</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {mockTransfers.map((trf, idx) => (
                <tr key={trf.id} className="hover:bg-white/[0.02] transition-colors cursor-pointer group">
                  <td className="px-6 py-4 font-medium text-foreground">{trf.id}</td>
                  <td className="px-6 py-4 text-muted-foreground">{trf.date}</td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-2">
                       <Send className="w-3 h-3 text-amber-500" /> {trf.from}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-2">
                      <Download className="w-3 h-3 text-green-400" /> {trf.to}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-mono">{trf.items}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded border text-xs font-medium ${
                      trf.status === 'Completed' ? 'bg-green-400/10 border-green-400/20 text-green-400' : 'bg-primary/10 border-primary/20 text-primary'
                    }`}>
                      {trf.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      ) : (
        <motion.div 
          key="new"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {/* Form */}
          <div className="glass-card space-y-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-1 block">From Location</label>
                <select className="w-full bg-[#09090b] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-foreground focus:ring-1 focus:ring-primary outline-none">
                  <option>Bella Cucina Downtown</option>
                  <option>Bella Cucina Westside</option>
                </select>
              </div>
              <div className="flex justify-center -my-2 relative z-10">
                <div className="bg-[#181920] border border-white/10 p-2 rounded-full">
                  <ArrowRightLeft className="w-4 h-4 text-primary" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-1 block">To Location</label>
                <select className="w-full bg-[#09090b] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-foreground focus:ring-1 focus:ring-primary outline-none">
                  <option>Bella Cucina Westside</option>
                  <option>Bella Cucina Downtown</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 space-y-4">
              <h3 className="text-foreground font-medium text-sm">Select Items to Transfer</h3>
              <div className="flex gap-2">
                 <input type="text" placeholder="Search ingredient..." className="flex-1 bg-[#09090b] border border-white/10 rounded-lg px-4 py-2 text-sm text-foreground focus:ring-1 focus:ring-primary outline-none" />
                 <input type="number" placeholder="Qty" className="w-24 bg-[#09090b] border border-white/10 rounded-lg px-4 py-2 text-sm text-foreground focus:ring-1 focus:ring-primary outline-none" />
                 <button className="bg-white/5 hover:bg-white/10 text-foreground px-4 py-2 rounded-lg text-sm border border-white/10 transition-colors">Add</button>
              </div>
            </div>

            <button className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-medium shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:scale-[1.02] transition-transform">
              Initiate Transfer
            </button>
          </div>

          {/* Education Panel */}
          <div className="glass-card bg-primary/5 border-primary/20 flex flex-col justify-center text-center p-8">
            <ArrowRightLeft className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-2">Immutable Transfer Ledger</h3>
            <p className="text-sm text-muted-foreground text-balance">
              When a transfer is initiated, a <code className="text-primary">TransferSent</code> event is appended to the origin location's ledger.
              When received, a <code className="text-primary">TransferReceived</code> event is appended.
            </p>
            <p className="text-sm text-muted-foreground mt-4 text-balance">
              The theoretical engine perfectly computes transit state without maintaining ephemeral flags on the items themselves. Deterministic math always prevails.
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
