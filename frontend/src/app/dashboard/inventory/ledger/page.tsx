"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Copy, History, ArrowLeft, Filter } from "lucide-react";
import Link from "next/link";

export default function LedgerTracing() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In live mode, fetches from /api/locations/{locationId}/events
    // We will simulate the array of events representing the true DynamoDB EventStore
    const loadLedger = async () => {
      await new Promise(r => setTimeout(r, 800));
      setEvents([
        { id: "018e9c20-...-0001", type: "InitialInventoryEstablished", time: "2025-01-01T00:00:00Z", actor: "Nik Owner" },
        { id: "018ebc40-...-0005", type: "InventoryCountSubmitted", time: "2025-01-14T14:32:00Z", actor: "Manager Sarah" },
        { id: "018ecc55-...-0019", type: "VarianceIdentified", time: "2025-01-14T14:32:05Z", actor: "System" },
        { id: "018edd11-...-0022", type: "TransferOut", time: "2025-01-15T09:15:00Z", actor: "Nik Owner" },
        { id: "018edd22-...-0023", type: "TransferIn", time: "2025-01-15T11:45:00Z", actor: "Manager Sarah" },
        { id: "018fee99-...-0089", type: "RecipeConsumption", time: "2025-01-16T22:30:00Z", actor: "System" },
      ]);
      setLoading(false);
    };
    loadLedger();
  }, []);

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
                <th className="p-4 text-xs font-medium text-muted-foreground uppercase">Event Time</th>
                <th className="p-4 text-xs font-medium text-muted-foreground uppercase">Event Type</th>
                <th className="p-4 text-xs font-medium text-muted-foreground uppercase">Actor</th>
                <th className="p-4 text-xs font-medium text-muted-foreground uppercase">Transaction Hash (ID)</th>
              </tr>
            </thead>
            <tbody>
              {events.map((evt, i) => (
                <motion.tr
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  key={evt.id}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors group cursor-pointer"
                >
                  <td className="p-4">
                    <span className="text-sm font-mono text-muted-foreground">{new Date(evt.time).toLocaleString()}</span>
                  </td>
                  <td className="p-4">
                    <span className="text-sm font-medium text-primary bg-primary/10 px-2 py-1 rounded-md">{evt.type}</span>
                  </td>
                  <td className="p-4 text-sm text-foreground">{evt.actor}</td>
                  <td className="p-4 flex items-center gap-2">
                    <span className="text-xs font-mono text-muted-foreground">{evt.id}</span>
                    <Copy className="w-3 h-3 text-transparent group-hover:text-muted-foreground hover:text-white transition-colors" />
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
