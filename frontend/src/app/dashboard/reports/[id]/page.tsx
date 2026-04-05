"use client";

import { motion } from "framer-motion";
import { useState, useEffect, use } from "react";
import { ArrowLeft, TrendingDown, PackageSearch, Scale, BarChart3 } from "lucide-react";
import Link from "next/link";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { formatCurrency } from "@/lib/currency";

// Philosophy note included via UI
export default function DetailedReport({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const locationId = resolvedParams.id;
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    // In a live integration, we fetch from /api/inventory/{locationId}/variance
    // Assuming backend data returns structured variance drops
    const dynamicFetch = async () => {
      // Mocking network delay
      await new Promise(r => setTimeout(r, 600));
      setData({
        expected: 1450,
        actual: 1390,
        varianceUnits: -60,
        varianceCost: -320.50,
        items: [
          { id: "ing:chicken", name: "Chicken Breast", exp: 50, act: 45, diff: -5, cost: -17.25 },
          { id: "ing:tomato", name: "Crushed Tomatoes", exp: 120, act: 120, diff: 0, cost: 0 },
          { id: "ing:keg-ipa", name: "Keg - IPA", exp: 12, act: 10, diff: -2, cost: -300.00 },
        ]
      });
    };
    dynamicFetch();
  }, [locationId]);

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/reports">
          <button className="p-2 glass-card hover:bg-white/10 rounded-xl transition-colors">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground capitalize">{locationId.replace('-', ' ')} Variance</h1>
          <p className="text-muted-foreground mt-1">Detailed Forensic Report</p>
        </div>
      </div>

      <div className="glass-card p-6 border-l-4 border-l-amber-500">
        <h3 className="text-lg font-bold text-foreground flex items-center gap-2 mb-2">
          <Scale className="w-5 h-5 text-amber-500" />
          Variance Philosophy
        </h3>
        <p className="text-sm text-foreground/80 leading-relaxed">
          The difference between Expected Inventory (Calculated from initial snapshot + purchases - recipe consumption) and Actual Inventory (Physical counts). InventoryOS permanently logs physical counts as reality. If reality mismatches theory, a <strong>Variance Event</strong> is spawned on the immutable ledger attributing financial shrinkage to the period.
        </p>
      </div>

      {!data ? (
        <div className="h-64 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="glass-card p-5">
              <p className="text-xs text-muted-foreground font-medium uppercase">Expected Units</p>
              <h4 className="text-2xl font-bold text-foreground mt-1">{data.expected}</h4>
            </div>
            <div className="glass-card p-5 border-primary/20 border">
              <p className="text-xs text-muted-foreground font-medium uppercase">Actual Reality</p>
              <h4 className="text-2xl font-bold text-primary mt-1">{data.actual}</h4>
            </div>
            <div className="glass-card p-5 border-destructive/20 border">
              <p className="text-xs text-muted-foreground font-medium uppercase">Net Variance</p>
              <h4 className="text-2xl font-bold text-destructive mt-1 flex items-center gap-2">
                <TrendingDown className="w-4 h-4" /> {data.varianceUnits}
              </h4>
            </div>
            <div className="glass-card p-5">
              <p className="text-xs text-muted-foreground font-medium uppercase">Financial Bleed</p>
              <h4 className="text-2xl font-bold text-destructive mt-1">{formatCurrency(Math.abs(data.varianceCost))}</h4>
            </div>
          </div>

          <div className="glass-card overflow-hidden">
            <div className="p-4 border-b border-white/5 flex gap-3 items-center">
              <BarChart3 className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-foreground">Ingredient Level Drift</h3>
            </div>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/5">
                  <th className="p-4 text-xs font-medium text-muted-foreground uppercase">Item Ref</th>
                  <th className="p-4 text-xs font-medium text-muted-foreground uppercase">Expected</th>
                  <th className="p-4 text-xs font-medium text-muted-foreground uppercase">Actual</th>
                  <th className="p-4 text-xs font-medium text-muted-foreground uppercase text-right">Drift</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((item: any, i: number) => (
                  <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <p className="font-medium text-foreground">{item.name}</p>
                      <p className="text-xs text-muted-foreground font-mono mt-1">{item.id}</p>
                    </td>
                    <td className="p-4 text-sm">{item.exp}</td>
                    <td className="p-4 text-sm text-primary">{item.act}</td>
                    <td className="p-4 text-right">
                      {item.diff === 0 ? (
                        <span className="text-xs bg-white/5 px-2 py-1 rounded text-muted-foreground">Perfect Match</span>
                      ) : (
                        <div className="flex flex-col items-end">
                          <span className="text-sm font-bold text-destructive">{item.diff} units</span>
                          <span className="text-xs text-muted-foreground mt-0.5">{formatCurrency(Math.abs(item.cost))} loss</span>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
}
