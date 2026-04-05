"use client";

import { motion } from "framer-motion";
import { ArrowRightLeft, Send, Download, Plus, CheckCircle, Clock } from "lucide-react";
import { useState } from "react";

const inventoryItems = [
  { id: "ing:chicken-breast", name: "Chicken Breast", qty: 42.5 },
  { id: "ing:keg-ipa", name: "Local IPA Keg", qty: 2.1 },
  { id: "ing:pizza-dough", name: "Pizza Dough Ball", qty: 15 },
  { id: "ing:mozzarella", name: "Mozzarella Cheese", qty: 31.5 },
];

const mockTransfers = [
  { id: "trf-101", from: "Downtown", to: "Westside", items: 3, date: "Today, 10:30 AM", status: "In Transit" },
  { id: "trf-102", from: "Midtown", to: "Riverside", items: 12, date: "Yesterday", status: "Completed" },
  { id: "trf-103", from: "Riverside", to: "Midtown", items: 1, date: "Oct 12, 2024", status: "Completed" },
];

export default function TransfersPage() {
  const [activeTab, setActiveTab] = useState('history');
  const [transfers, setTransfers] = useState(mockTransfers);
  
  // Form State
  const [fromLoc, setFromLoc] = useState("Bella Cucina Downtown");
  const [toLoc, setToLoc] = useState("Bella Cucina Westside");
  const [manifest, setManifest] = useState<{item: any, qty: number}[]>([]);
  const [selectedItemId, setSelectedItemId] = useState(inventoryItems[0].id);
  const [transferQty, setTransferQty] = useState(1);

  const toggleStatus = (id: string) => {
    setTransfers(transfers.map(trf => {
      if (trf.id === id && trf.status === 'In Transit') {
        return { ...trf, status: 'Completed' };
      }
      return trf;
    }));
  };

  const handleAddItem = () => {
    const item = inventoryItems.find(i => i.id === selectedItemId);
    if (!item) return;
    if (transferQty > item.qty) {
      alert(`Cannot transfer ${transferQty}. Max available is  ${item.qty}.`);
      return;
    }
    setManifest([...manifest, { item, qty: transferQty }]);
    setTransferQty(1);
  };

  const handleInitiate = () => {
    if (manifest.length === 0) return alert("Add at least 1 item to manifest.");
    setTransfers([
      { id: `trf-${Date.now().toString().slice(-4)}`, from: fromLoc.split(" ").pop() || "", to: toLoc.split(" ").pop() || "", items: manifest.length, date: "Just now", status: "In Transit" },
      ...transfers
    ]);
    setManifest([]);
    setActiveTab('history');
  };

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
                <th className="px-6 py-4 font-medium">Status / Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {transfers.map((trf) => (
                <tr key={trf.id} className="hover:bg-white/[0.02] transition-colors group">
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
                    {trf.status === 'Completed' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-green-400/10 border border-green-400/20 text-xs font-medium text-green-400">
                        <CheckCircle className="w-3.5 h-3.5" /> Completed
                      </span>
                    ) : (
                      <button 
                         onClick={() => toggleStatus(trf.id)}
                         className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-primary/10 border border-primary/20 text-xs font-medium text-primary hover:bg-primary hover:text-black transition-colors shadow-[0_0_10px_rgba(245,158,11,0.2)]"
                      >
                         <Clock className="w-3.5 h-3.5" /> Mark Received
                      </button>
                    )}
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
                <label className="text-sm font-medium text-muted-foreground mb-1 block">Origin (Deduction)</label>
                <select value={fromLoc} onChange={e => setFromLoc(e.target.value)} className="w-full bg-[#09090b] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-foreground focus:ring-1 focus:ring-primary outline-none">
                  <option>Bella Cucina Downtown</option>
                  <option>Bella Cucina Westside</option>
                  <option>The Brass Tap Midtown</option>
                  <option>The Brass Tap Riverside</option>
                </select>
              </div>
              <div className="flex justify-center -my-2 relative z-10">
                <div className="bg-[#181920] border border-white/10 p-2 rounded-full">
                  <ArrowRightLeft className="w-4 h-4 text-primary" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-1 block">Destination (Addition)</label>
                <select value={toLoc} onChange={e => setToLoc(e.target.value)} className="w-full bg-[#09090b] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-foreground focus:ring-1 focus:ring-primary outline-none">
                  <option>Bella Cucina Westside</option>
                  <option>Bella Cucina Downtown</option>
                  <option>The Brass Tap Riverside</option>
                  <option>The Brass Tap Midtown</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-foreground font-medium text-sm">Transfer Manifest</h3>
                <span className="text-xs text-muted-foreground">{manifest.length} items</span>
              </div>
              
              <div className="bg-black/30 border border-white/5 rounded-lg p-3 space-y-2 mb-4">
                 {manifest.map((m, i) => (
                    <div key={i} className="flex justify-between items-center text-sm p-2 bg-white/5 rounded border border-white/5">
                      <span>{m.item.name}</span>
                      <span className="font-mono text-primary font-bold">+{m.qty}</span>
                    </div>
                 ))}
                 {manifest.length === 0 && <p className="text-xs text-center text-muted-foreground py-2">Manifest empty. Construct shipment.</p>}
              </div>

              <div className="flex gap-2 items-end">
                 <div className="flex-1">
                   <select 
                     value={selectedItemId} 
                     onChange={e => setSelectedItemId(e.target.value)}
                     className="w-full bg-[#09090b] border border-white/10 rounded-lg px-4 py-2 text-sm text-foreground focus:ring-1 focus:ring-primary outline-none"
                   >
                     {inventoryItems.map(i => (
                       <option key={i.id} value={i.id}>{i.name} (Max: {i.qty})</option>
                     ))}
                   </select>
                 </div>
                 <input 
                   type="number" 
                   value={transferQty}
                   onChange={e => setTransferQty(Number(e.target.value))}
                   placeholder="Qty" 
                   className="w-20 bg-[#09090b] border border-white/10 rounded-lg px-4 py-2 text-sm text-foreground focus:ring-1 focus:ring-primary outline-none" 
                 />
                 <button onClick={handleAddItem} className="bg-white/5 hover:bg-white/10 text-foreground px-4 py-2 rounded-lg text-sm border border-white/10 transition-colors flex items-center gap-1"><Plus className="w-4 h-4"/> Add</button>
              </div>
            </div>

            <button onClick={handleInitiate} className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-medium shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:scale-[1.02] transition-transform">
              Dispatch Shipment
            </button>
          </div>

          {/* Education Panel */}
          <div className="glass-card bg-primary/5 border-primary/20 flex flex-col justify-center text-center p-8">
            <ArrowRightLeft className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-2">Immutable Transfer Ledger</h3>
            <p className="text-sm text-muted-foreground text-balance">
              When a transfer is initiated, a <code className="text-primary bg-black/40 px-1 rounded">TransferSent</code> event is appended to the origin location's ledger.
              When marked received, a <code className="text-primary bg-black/40 px-1 rounded">TransferReceived</code> event is appended.
            </p>
            <p className="text-sm text-muted-foreground mt-4 text-balance">
              The theoretical engine perfectly computes transit state without maintaining ephemeral flags on the items themselves. Deterministic math always prevails. Restrictions apply strictly based on absolute physical ceilings.
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
