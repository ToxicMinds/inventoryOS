"use client";

import { motion } from "framer-motion";
import { User, Store, ShieldCheck, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const [role, setRole] = useState("owner");

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[#09090b]">
      {/* Background aesthetics */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 blur-[120px] rounded-full pointer-events-none opacity-50" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-10 w-full max-w-md relative z-10 border border-white/10"
      >
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mb-4 text-primary relative overflow-hidden">
            <Store className="w-8 h-8 relative z-10" />
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/40 to-transparent" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">InventoryOS</h1>
          <p className="text-muted-foreground mt-2 text-sm">Enterprise multi-tenant authentication</p>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <p className="text-sm font-medium text-foreground">Select Simulation Role</p>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setRole("owner")}
                className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${
                  role === "owner" ? "bg-primary/20 border-primary text-primary" : "bg-white/5 border-white/5 text-muted-foreground hover:bg-white/10"
                }`}
              >
                <ShieldCheck className="w-6 h-6" />
                <span className="text-xs font-bold uppercase tracking-wider">Corporate</span>
              </button>
              <button 
                onClick={() => setRole("manager")}
                className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${
                  role === "manager" ? "bg-primary/20 border-primary text-primary" : "bg-white/5 border-white/5 text-muted-foreground hover:bg-white/10"
                }`}
              >
                <User className="w-6 h-6" />
                <span className="text-xs font-bold uppercase tracking-wider">Manager</span>
              </button>
            </div>
          </div>

          <Link href="/dashboard" className="block w-full">
            <button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 rounded-lg transition-all shadow-[0_0_20px_rgba(245,158,11,0.4)] flex items-center justify-center gap-2 group">
              Login as {role === 'owner' ? 'Corporate' : 'Manager'}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
          
          <div className="text-center pt-4 border-t border-white/5">
            <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
              Protected by <ShieldCheck className="w-3 h-3 text-primary" /> DynamoDB Security
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
