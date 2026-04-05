"use client";

import { motion } from "framer-motion";
import { Store, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function ReportsHub() {
  const [locations, setLocations] = useState([
    { id: "downtown", name: "Bella Cucina Downtown", type: "greenfield" },
    { id: "westside", name: "Bella Cucina Westside", type: "greenfield" },
    { id: "midtown", name: "The Brass Tap Midtown", type: "brownfield" },
    { id: "riverside", name: "The Brass Tap Riverside", type: "brownfield" },
  ]);

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Variance Reports Hub</h1>
        <p className="text-muted-foreground mt-1">Select a location to view detailed forensic variance and expected vs actuals.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {locations.map((loc, i) => (
          <Link key={loc.id} href={`/dashboard/reports/${loc.id}`}>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-6 flex flex-col h-full cursor-pointer hover:border-primary/50 group"
            >
              <div className="flex justify-between items-center mb-4">
                <div className="p-3 bg-primary/10 rounded-xl text-primary">
                  <Store className="w-6 h-6" />
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <h2 className="text-xl font-bold text-foreground mb-1">{loc.name}</h2>
              <p className="text-sm text-muted-foreground capitalize">{loc.type} Integration</p>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}
