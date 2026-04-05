"use client";

import { motion } from "framer-motion";
import { TrendingDown, TrendingUp, AlertTriangle, ArrowUpRight, DollarSign, RefreshCw, Info, Edit2 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RcTooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import Link from "next/link";
import { formatCurrency } from "@/lib/currency";
import { useState } from "react";

const varianceData = [
  { date: 'Oct 1', midline: 0, variance: -12.5 },
  { date: 'Oct 8', midline: 0, variance: -8.2 },
  { date: 'Oct 15', midline: 0, variance: -15.4 },
  { date: 'Oct 22', midline: 0, variance: -5.1 },
  { date: 'Oct 29', midline: 0, variance: -2.3 },
  { date: 'Nov 5', midline: 0, variance: +1.2 },
];

export default function DashboardHome() {
  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Corporate Overview</h1>
        <p className="text-muted-foreground mt-1">Multi-location consolidated metrics</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard 
          title="Total Inventory Value" 
          val={formatCurrency(45231.80)} 
          trend="+2.1%" 
          trendDir="up" 
          icon={<DollarSign className="w-5 h-5 text-primary" />} 
          delay={0}
          info="Calculated natively using (Quantity * Current Vendor Price) from absolute Event Store deductions."
          link="/dashboard/inventory"
        />
        <KPICard 
          title="Consolidated Variance" 
          val="-1.8%" 
          trend="Improved 4%" 
          trendDir="up" 
          icon={<TrendingDown className="w-5 h-5 text-green-400" />} 
          delay={0.1}
          alert
          info="Dynamic delta between Expected math & Actual Physical Counts. Recalculated every 12 hours based on End of Day receipts."
          link="/dashboard/reports"
        />
        <KPICard 
          title="Pending Transfers" 
          val="3" 
          trend="Requires attention" 
          trendDir="neutral" 
          icon={<RefreshCw className="w-5 h-5 text-amber-500" />} 
          delay={0.2}
          info="Inventory currently in temporal transit between geographical zones based on UUID routing."
          link="/dashboard/transfers"
        />
        <KPICard 
          title="Waste Logs this week" 
          val={formatCurrency(1240.50)} 
          trend="-15%" 
          trendDir="up" 
          icon={<AlertTriangle className="w-5 h-5 text-destructive" />} 
          delay={0.3}
          info="Specific 'Waste' event type submissions aggregated globally."
          link="/dashboard/inventory/ledger"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="glass-card lg:col-span-2 space-y-4"
        >
          <div>
            <h2 className="text-lg font-semibold text-foreground">Variance Trend (Trailing 30 Days)</h2>
            <p className="text-sm text-muted-foreground">The Brass Tap - All Locations</p>
          </div>
          <div className="h-72 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={varianceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVariance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="date" stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${val}%`} />
                <RcTooltip 
                  contentStyle={{ backgroundColor: '#181920', borderColor: '#27272a', borderRadius: '8px' }}
                  itemStyle={{ color: '#f59e0b' }}
                />
                <Area type="monotone" dataKey="variance" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorVariance)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Location Breakdown */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="glass-card space-y-4 flex flex-col"
        >
          <div>
            <h2 className="text-lg font-semibold text-foreground">Location Performance</h2>
            <p className="text-sm text-muted-foreground group flex gap-2">
              Variance ranking
              <span className="relative flex group-hover:opacity-100 transition-opacity cursor-help">
                 <Info className="w-4 h-4" />
                 <span className="opacity-0 group-hover:opacity-100 absolute bg-black border border-white/10 p-2 text-xs rounded right-0 w-48 z-10 bottom-full mb-1">
                   Locational metric evaluating total ingredient drift multiplied by absolute raw cost.
                 </span>
              </span>
            </p>
          </div>
          <div className="flex-1 space-y-4">
            <LocationRow name="Bella Cucina Downtown" value="-0.5%" status="good" link="/dashboard/reports/bella-cucina-downtown" />
            <LocationRow name="Bella Cucina Westside" value="-1.2%" status="good" link="/dashboard/reports/bella-cucina-westside" />
            <LocationRow name="The Brass Tap Midtown" value="-4.1%" status="warning" link="/dashboard/reports/the-brass-tap-midtown" />
            <LocationRow name="The Brass Tap R-side" value="-8.5%" status="danger" link="/dashboard/reports/the-brass-tap-riverside" />
          </div>
          <Link href="/dashboard/reports" className="w-full">
            <button className="w-full py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-foreground transition-colors mt-auto border border-white/5 font-bold">
              View Detailed Hierarchy
            </button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

function KPICard({ title, val, trend, trendDir, icon, delay, alert, info, link }: any) {
  const [showInfo, setShowInfo] = useState(false);
  const [lastEdited, setLastEdited] = useState("Just now");

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay }}
      className={`glass-card p-5 relative overflow-visible ${alert ? 'border-primary/50 border' : ''}`}
    >
      {alert && <div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 blur-xl rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />}
      <div className="flex justify-between items-start relative">
        <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          {title}
          {info && (
            <div className="relative group cursor-help z-20">
              <Info className="w-3.5 h-3.5 text-muted-foreground/50 hover:text-white" />
              <div className="opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-black/90 p-3 rounded-lg border border-white/10 text-xs text-white z-50">
                {info}
                <div className="mt-2 pt-2 border-t border-white/10 text-[10px] text-muted-foreground">
                  Last calculation: {lastEdited}. 
                </div>
              </div>
            </div>
          )}
        </p>
        <div className="p-2 bg-white/5 rounded-xl">{icon}</div>
      </div>
      <div className="mt-4 flex justify-between items-end">
        <div>
          <h3 className="text-3xl font-bold text-foreground">{val}</h3>
          <p className={`text-xs mt-1 flex items-center gap-1 ${trendDir === 'up' ? 'text-green-400' : trendDir === 'down' ? 'text-destructive' : 'text-amber-500'}`}>
            {trendDir === 'up' && <ArrowUpRight className="w-3 h-3" />}
            {trend}
          </p>
        </div>
        <div className="flex flex-col gap-2 items-end">
          <button onClick={() => alert("Immutable state overrides are restricted via Settings threshold.")} className="text-xs bg-white/5 hover:bg-white/10 px-2 py-1 flex items-center gap-1 rounded border border-white/10 transition-colors">
            <Edit2 className="w-3 h-3" /> Fix
          </button>
          {link && (
            <Link href={link} className="text-[10px] uppercase font-bold text-primary hover:underline tracking-wider">
              Explore Data
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function LocationRow({ name, value, status, link }: any) {
  const getStatusColor = () => {
    switch(status) {
      case 'good': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'warning': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      case 'danger': return 'text-destructive bg-destructive/10 border-destructive/20';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <Link href={link || "#"} className="flex items-center justify-between p-3 rounded-lg border border-white/5 bg-white/5 hover:bg-white/10 transition-colors group cursor-pointer">
      <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{name}</span>
      <span className={`text-xs font-mono font-bold px-2 py-1 rounded-md border ${getStatusColor()}`}>
        {value}
      </span>
    </Link>
  );
}
