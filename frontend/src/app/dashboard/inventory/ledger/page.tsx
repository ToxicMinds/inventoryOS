"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Copy, History, ArrowLeft, Filter, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";

export default function LedgerTracing() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  useEffect(() => {
    const loadLedger = async () => {
      await new Promise(r => setTimeout(r, 800));
      setEvents([
        { 
          id: "018e9c20-...-0001", 
          type: "InitialInventoryEstablished", 
          time: "2025-01-01T00:00:00Z", 
          actor: "Nik Owner",
          payload: { action: "SEED", lineItems: [{ ref: "ing:chicken-breast", initialVal: 50 }, { ref: "ing:tomato-sauce", initialVal: 100 }] }
        },
        { 
          id: "018ebc40-...-0005", 
          type: "InventoryCountSubmitted", 
          time: "2025-01-14T14:32:00Z", 
          actor: "Manager Sarah",
          payload: { countReference: "wk2-tue", auditedItems: [{ ref: "ing:chicken-breast", observed: 48, theoretical: 50 }] }
        },
        { 
          id: "018ecc55-...-0019", 
          type: "VarianceIdentified", 
          time: "2025-01-14T14:32:05Z", 
          actor: "System",
          payload: { deduction: -2, target: "ing:chicken-breast", monetaryValueDrift: -5.80, associatedCount: "018ebc40-...-0005" }
        },
        { 
          id: "018edd11-...-0022", 
          type: "TransferOut", 
          time: "2025-01-15T09:15:00Z", 
          actor: "Nik Owner",
          payload: { destination: "Riverside", manifest: [{ ref: "ing:keg-ipa", amt: 2 }] }
        },
      ]);
      setLoading(false);
    };
    loadLedger();
  }, []);

  const toggleRow = (id: string) => {
    setExpandedRow(prev => prev === id ? null : id);
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/inventory">
            <button className="p-2 glass-card hover:bg-white/10 rounded-xl transition-colors">
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
              Event Store Ledger <History className="w-6 h-6 text-primary" />
            </h1>
            <p className="text-muted-foreground mt-1">Immutable NoSQL Event Sourcing Trace</p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 glass-card hover:bg-white/10 rounded-lg text-sm transition-colors">
          <Filter className="w-4 h-4" /> Filter Stream
        </button>
      </div>

      <div className="glass-card overflow-hidden">
        {loading ? (
          <div className="h-64 flex items-center justify-center">
             <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/5">
                <th className="p-4 w-12"></th>
                <th className="p-4 text-xs font-medium text-muted-foreground uppercase">Event Time</th>
                <th className="p-4 text-xs font-medium text-muted-foreground uppercase">Event Type</th>
                <th className="p-4 text-xs font-medium text-muted-foreground uppercase">Actor</th>
                <th className="p-4 text-xs font-medium text-muted-foreground uppercase">Transaction Hash (ID)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {events.map((evt, i) => (
                <React.Fragment key={evt.id}>
                  <motion.tr
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => toggleRow(evt.id)}
                    className="hover:bg-white/[0.02] transition-colors group cursor-pointer"
                  >
                    <td className="p-4">
                      {expandedRow === evt.id ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                    </td>
                    <td className="p-4">
                      <span className="text-sm font-mono text-muted-foreground">{new Date(evt.time).toLocaleString()}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm font-medium text-primary bg-primary/10 px-2 py-1 rounded-md">{evt.type}</span>
                    </td>
                    <td className="p-4 text-sm text-foreground">{evt.actor}</td>
                    <td className="p-4 flex items-center gap-2 border-b-0">
                      <span className="text-xs font-mono text-muted-foreground">{evt.id}</span>
                      <Copy className="w-3 h-3 text-transparent group-hover:text-muted-foreground hover:text-white transition-colors" onClick={(e) => e.stopPropagation()} />
                    </td>
                  </motion.tr>
                  <AnimatePresence>
                    {expandedRow === evt.id && (
                      <motion.tr
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-black/40"
                      >
                        <td colSpan={5} className="p-0 border-t-0">
                           <div className="p-4 pl-16 border-l-2 border-l-primary/30 mx-4 my-2 overflow-hidden">
                             <p className="text-xs font-bold text-muted-foreground uppercase mb-2">Immutable JSON Payload</p>
                             <pre className="text-xs font-mono text-green-400 bg-black/60 p-4 rounded-lg border border-white/5 overflow-x-auto">
                               {JSON.stringify(evt.payload, null, 2)}
                             </pre>
                           </div>
                        </td>
                      </motion.tr>
                    )}
                  </AnimatePresence>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
import React from 'react';
